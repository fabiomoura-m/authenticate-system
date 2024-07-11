'use client';

import { admin } from '@/actions/admin';
import { RoleGate } from '@/components/auth/role-gate';
import FormSuccess from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserRole } from '@prisma/client';
import { FaKey } from 'react-icons/fa';
import { toast } from 'sonner';

const AdminPage = () => {
    const onApiRouteClick = () => {
        fetch('/api/admin').then(response => {
            if (response.ok) {
                toast.success('Permitido API Route!');
            } else {
                toast.error('Proibido API Route!');
            }
        });
    };

    const onServerActionClick = () => {
        admin().then(data => {
            if (data.error) {
                toast.error(data.error);
            }

            if (data.success) {
                toast.success(data.success);
            }
        });
    };

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="flex items-center gap-x-2 text-2xl font-semibold justify-center">
                    <FaKey className="text-yellow-500/60" />
                    Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="Você está permitido para ver o conteúdo!" />
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p>Admin-only API Route</p>
                    <Button onClick={onApiRouteClick}>Clique para testar</Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p>Admin-only Server Action</p>
                    <Button onClick={onServerActionClick}>Clique para testar</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminPage;
