'use server';

import { currentRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export const admin = async () => {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
        return { error: 'Permitido Server Action!' };
    }

    return { success: 'Proibido Server Action!' };
};
