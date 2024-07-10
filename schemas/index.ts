import * as z from 'zod';

export const SettingsSchema = z.object({
    name: z.optional(z.string())
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: 'Mínimo de 6 caracteres'
    })
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: 'E-mail incompleto'
    })
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'E-mail incompleto'
    }),
    password: z.string().min(1, {
        message: 'É necessário uma senha'
    }),
    code: z.string().optional()
});

export const LoginSchemaWithCode = LoginSchema.extend({
    code: z.string().min(1, { message: 'Digite o código recebido no e-mail' })
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
