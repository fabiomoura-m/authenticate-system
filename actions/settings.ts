'use server';

import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { SettingsSchema } from '@/schemas';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user?.id) {
        return { error: 'Unauthorized' };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: 'Unauthorized' };
    }

    if (user.isOauth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnable = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id != user.id) {
            return { error: 'E-mail já cadastrado!' };
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: 'E-mail de verificação enviado!' };
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        );

        if (!passwordsMatch) {
            return { error: 'Senha incorreta!' };
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);

        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            ...values
        }
    });

    return { success: 'Dados atualizados!' };
};
