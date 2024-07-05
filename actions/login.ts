'use server';

import { signIn } from '@/auth';
import { getToFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import {
    generateTwoFactorToken,
    generateVerificationToken
} from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { credentialCheck } from '@/actions/credential-check';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Campos inválidos!' };
    }

    const { email, password, code } = validatedFields.data;

    const isCredentialsMatch = await credentialCheck(email, password);

    if (!isCredentialsMatch) {
        return { error: 'Email ou senha não conferem!' };
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email) {
        return { error: 'Email ou senha não conferem!' };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: 'Email enviado com sucesso!' };
    }

    if (existingUser.isTwoFactorEnable && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );
            if (!twoFactorToken) {
                return { error: 'Código inválido!' };
            }

            if (twoFactorToken.token !== code) {
                return { error: 'Código inválido!' };
            }
            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: 'Código expirado!' };
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            });

            const existingConfirmation = await getToFactorConfirmationByUserId(
                existingUser.id
            );

            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(
                existingUser.email
            );
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            );

            return {
                twoFactor: true,
                success: 'Código enviado para o e-mail!'
            };
        }
    }

    try {
        await signIn('credentials', {
            redirectTo: DEFAULT_LOGIN_REDIRECT,
            email,
            password
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CallbackRouteError':
                    return { error: 'Email ou senha não conferem!' };
                default:
                    return { error: 'Algo deu errado!' };
            }
        }

        throw error;
    }
};
