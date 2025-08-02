import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useNotificationReadStatus } from '@/hooks/use-notify';
import type { Notification } from '@/types';

interface NotificationDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    notify: Notification | null;
}

export default function NotificationDetailsDialog({
    isOpen,
    onOpenChange,
    notify,
}: NotificationDetailsDialogProps) {
    const navigate = useNavigate();
    const { mutate } = useNotificationReadStatus();

    if (!notify) return null;

    const handleClick = () => {
        mutate(
            notify._id.toString(),
            {
                onSuccess: () => {

                    onOpenChange(false);
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Notification</DialogTitle>
                    <DialogDescription>{notify.message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleClick}>
                        Ok
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
