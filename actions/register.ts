'use server';

import * as bcrypt from 'bcrypt';
import { z } from 'zod';

import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Campos inválidos!' };
    }

    const { email, password, name } = validatedFields.data;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: 'Email já cadastrado!' };
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    const verificationToken = await generateVerificationToken(email);
    // TODO: Send verification token email
    await sendVerificationEmail(verificationToken.email, verificationToken.token)


    return { success: 'Email de verificação enviado' };
};
