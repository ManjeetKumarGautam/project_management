// context/NotificationContext.tsx
'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { AuthProvider, useAuth } from "./auth-context";

interface Notification {
    _id: string;
    message: string;
    createdAt: string;
}

interface ContextType {
    notifications: Notification[];
    hasNew: boolean;
    clearNew: () => void;
}

const NotificationContext = createContext<ContextType>({
    notifications: [],
    hasNew: false,
    clearNew: () => { },
});

export const NotificationProvider = ({
    children,

}: {
    children: React.ReactNode;

}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasNew, setHasNew] = useState(false);

    const { user } = useAuth();
    const userId = user?._id;

    useEffect(() => {
        if (userId) {
            socket.emit("join", userId);
        }

        socket.on("new-notification", (data: Notification) => {
            setNotifications((prev) => [data, ...prev]);
            setHasNew(true);
            // Optional toast
            // toast.success(data.message);
        });

        return () => {
            socket.off("new-notification");
        };
    }, [userId]);

    const clearNew = () => setHasNew(false);

    return (
        <NotificationContext.Provider value={{ notifications, hasNew, clearNew }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
