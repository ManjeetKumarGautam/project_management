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
import { toast } from 'sonner';
import { useDeleteTaskMutation } from '@/hooks/use-task';

interface DeleteTaskDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    taskId: string | null;
}

export default function DeleteTaskDialog({
    isOpen,
    onOpenChange,
    taskId,
}: DeleteTaskDialogProps) {
    const navigate = useNavigate();
    const { mutate } = useDeleteTaskMutation();

    function handleClick() {
        if (!taskId) return;

        mutate(
            { taskId },
            {
                onSuccess: () => {
                    toast.success("Task deleted");
                    navigate(-1);
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message);
                },
            }
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your
                        task and remove all associated data.
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
