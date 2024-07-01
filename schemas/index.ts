import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'E-mail incompleto'
    }),
    password: z.string().min(1, {
        message: 'É necessário uma senha'
    })
});
