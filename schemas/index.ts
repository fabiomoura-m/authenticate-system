import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'E-mail incompleto'
    }),
    password: z.string().min(1, {
        message: 'É necessário uma senha'
    })
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'E-mail incompleto'
    }),
    password: z.string().min(6, {
        message: 'Mínimo de 6 caracteres'
    }),
    name: z.string().min(3, {
        message: 'Nome incompleto'
    })
});
