'use server';

import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NewPasswordSchema } from '@/schemas';
import { z } from 'zod';

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    if (!token) {
        return { error: 'Token requerido!' };
    }

    const validateFields = NewPasswordSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: 'Campos inválidos!' };
    }

    const { password } = validateFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: 'Token inválido!' };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: 'Token expirado!' };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: 'Email não existe!' };
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    });

    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    });

    return { success: 'Senha atualizada!' };
};
