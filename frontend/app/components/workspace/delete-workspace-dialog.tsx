'use client';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useDeleteWorkspaceMutation } from '@/hooks/use-workspace';
import { toast } from 'sonner';

interface DeleteWorkspaceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string | null;
}

export default function DeleteWorkspaceDialog({
    isOpen,
    onOpenChange,
    workspaceId,
}: DeleteWorkspaceDialogProps) {
    const navigate = useNavigate();
    const { mutate } = useDeleteWorkspaceMutation();

    function handleClick() {
        if (!workspaceId) return;

        mutate(
            { workspaceId },
            {
                onSuccess: () => {
                    toast.success("Workspace deleted successfully");
                    navigate('/workspaces');
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Failed to delete workspace");
                    console.error("Delete error:", error);
                },
            }
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Workspace</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Workspace</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your
                        workspace and remove all associated data.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleClick}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
