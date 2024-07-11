'use client';

import { useCurrentRole } from '@/hooks/use-current-role';
import { UserRole } from '@prisma/client';
import { ReactNode } from 'react';
import FormError from '@/components/form-error';

interface RoleGateProps {
    children: ReactNode;
    allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurrentRole();

    if (role !== allowedRole)
        return (
            <FormError message="Você não possui permissão para ver este conteúdo" />
        );

    return <>{children}</>;
};
