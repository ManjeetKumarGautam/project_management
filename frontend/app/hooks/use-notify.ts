
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, updateData } from "@/lib/fetch-util";
import type { Notification } from "@/components/ui/notification-bell";

export const useNotificationsQuery = () => {
    return useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: () => fetchData("/notifications"),
    });
};

export const useNotificationReadStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({

        mutationFn: (notifyId: string) =>
            updateData(`/notifications/${notifyId}/read`, {}),

        onSuccess: () => {
            // Refetch notifications after marking as read
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
    });
};