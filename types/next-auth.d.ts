import { UserRole } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';
import { type JWTOptions } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            role: UserRole;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: UserRole;
    }
}
