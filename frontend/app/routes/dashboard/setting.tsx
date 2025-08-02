'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workspaceSchema } from '@/lib/schema';
import type { WorkspaceForm } from '@/components/workspace/create-workspace';
import type { User, Workspace } from '@/types';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';
import { Loader } from "@/components/loader";
import { useSearchParams } from 'react-router';
import {
    useGetWorkspaceDetailsQuery,
    useTransferWorkspaceOwnerMutation,
    useUpdateWorkspaceMutation,
} from '@/hooks/use-workspace';
import DeleteWorkspaceDialog from '@/components/workspace/delete-workspace-dialog';
import { toast } from 'sonner';
import { TransferOwnershipDialog } from '@/components/workspace/transfer-ownership-dialog';

export const colorOptions = [
    '#FF5733', // Red-Orange
    '#33C1FF', // Blue
    '#28A745', // Green
    '#FFC300', // Yellow
    '#8E44AD', // Purple
    '#E67E22', // Orange
    '#2ECC71', // Light Green
    '#34495E', // Navy
];

export default function Setting() {
    const [searchParams] = useSearchParams();
    const workspaceId: string | null = searchParams.get('workspaceId');

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const { mutate: updateWorkspace, isPending } = useUpdateWorkspaceMutation();
    const { mutate: transferWorkspace } = useTransferWorkspaceOwnerMutation();

    const {
        data,
        isLoading,
    } = useGetWorkspaceDetailsQuery(workspaceId!) as {
        data: Workspace;
        isLoading: boolean;
    };

    // Transform members to get only non-owner users
    const workspaceMembers: User[] =
        data?.members
            ?.filter((m) => m.user._id !== data.owner)
            .map((m) => m.user) ?? [];

    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: '',
            color: colorOptions[0],
            description: '',
        },
    });

    const handleTransfer = (newOwnerId: string) => {
        if (!workspaceId) return toast.error('Workspace ID not found');

        transferWorkspace(
            { workspaceId, newOwnerId },
            {
                onSuccess: () => {
                    toast.success('Workspace transferred successfully');
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || 'Transfer failed');
                },
            }
        );
        setIsDialogOpen(false);
    };

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
                color: data.color,
                description: data.description || '',
            });
        }
    }, [data, form]);

    const onSubmit = (formData: WorkspaceForm) => {
        if (!workspaceId) return toast.error('Workspace ID not found');

        updateWorkspace(
            { workspaceId, newData: formData },
            {
                onSuccess: () => {
                    toast.success('Workspace updated successfully');
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || 'Update failed');
                },
            }
        );
    };

    if (isLoading) {
        return (<Loader />);
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Workspace Settings Form */}
            <Card className="p-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Settings />
                        <CardTitle>Workspace Settings</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your workspace settings and preferences
                    </CardDescription>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Workspace Name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Workspace Description"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-3 flex-wrap">
                                            {colorOptions.map((color) => (
                                                <div
                                                    key={color}
                                                    onClick={() => field.onChange(color)}
                                                    className={cn(
                                                        'w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300',
                                                        field.value === color &&
                                                        'ring-2 ring-offset-2 ring-blue-500'
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end mt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save changes'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>

            {/* Transfer Workspace */}
            <Card className="p-6">
                <div className="space-y-1">
                    <CardTitle>Transfer Workspace</CardTitle>
                    <CardDescription>
                        Transfer ownership of this workspace to another member
                    </CardDescription>
                </div>
                <div className="flex justify-start mt-4">
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-950"
                    >
                        Transfer Workspace
                    </Button>
                    <TransferOwnershipDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        members={workspaceMembers}
                        onTransfer={handleTransfer}
                    />
                </div>
            </Card>

            {/* Delete Workspace */}
            <Card className="p-6">
                <div className="space-y-1">
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible actions for your workspace
                    </CardDescription>
                </div>
                <div className="flex justify-start mt-4">
                    <DeleteWorkspaceDialog
                        isOpen={isDeleted}
                        onOpenChange={setIsDeleted}
                        workspaceId={workspaceId || ''}
                    />
                </div>
            </Card>
        </div>
    );
}
