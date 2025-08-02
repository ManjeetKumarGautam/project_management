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
import { useDeleteProjectMutation } from '@/hooks/use-project';
import { toast } from 'sonner';

interface DeleteProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string | null;
}

export default function DeleteProjectDialog({
    isOpen,
    onOpenChange,
    projectId,
}: DeleteProjectDialogProps) {
    const navigate = useNavigate();
    const { mutate } = useDeleteProjectMutation();

    function handleClick() {
        if (!projectId) return;

        mutate(
            { projectId },
            {
                onSuccess: () => {
                    toast.success("Project deleted successfully");
                    navigate(-1);
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Failed to delete project");
                    console.error("Delete error:", error);
                },
            }
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Project</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Danger Zone</DialogTitle>
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
