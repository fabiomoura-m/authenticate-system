'use server';

import { signIn } from '@/auth';
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
