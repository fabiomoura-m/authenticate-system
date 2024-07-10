'use client';
import { settings } from '@/actions/settings';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/hooks/use-current-user';
import { SettingsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillSetting } from 'react-icons/ai';
import { z } from 'zod';

const SettingsPage = () => {
    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined
        }
    });

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    }
                    if (data.success) {
                        update();
                        setSuccess(data.success);
                    }
                })
                .catch(() => setError('Something went wrong!'));
        });
    };

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="flex items-center justify-center gap-x-2 text-2xl font-semibold">
                    <AiFillSetting className="text-gray-600" />
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button type="submit" disabled={isPending}>
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SettingsPage;
