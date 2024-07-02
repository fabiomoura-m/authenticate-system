'use server';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Campos inválidos!' };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'Email ou senha não conferem!' };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email
        );

        return { success: 'Email enviado com sucesso!' };
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
