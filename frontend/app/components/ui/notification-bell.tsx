'use client';

import { useEffect, useRef, useState } from "react";
import { useNotificationsQuery } from "@/hooks/use-notify";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router";
import moment from "moment";
import NotificationDetailsDialog from "../user/notification-details";

export interface Notification {
    _id: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    user: string;
}

export const NotificationBell = () => {
    const { data = [], isLoading } = useNotificationsQuery();
    const [open, setOpen] = useState(false);
    const [openNotify, setOpenNotify] = useState(false);

    const [selectedNotify, setSelectedNotify] = useState<Notification | null>(null);

    const navigate = useNavigate();
    const bellRef = useRef<HTMLDivElement>(null);

    const handleViewAll = () => {
        navigate("/user/notifications");
        setOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
            setOpen(false);
        }
    };

    function handleClickNotify(notify: Notification) {
        setSelectedNotify(notify);
        setOpenNotify(true);
    }

    useEffect(() => {
        if (open) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const latestThree = data.slice(0, 3);

    return (
        <div className="relative mr-2" ref={bellRef}>
            <button onClick={() => setOpen((prev) => !prev)} className="relative">
                <Bell className="w-5 h-5 text-white hover:text-black transition cursor-pointer" />
                {data.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
            </button>

            {open && (
                <div className="absolute top-10 right-0 w-96 bg-white shadow-2xl rounded-lg z-50 animate-fade-in">
                    <div className="p-4 border-b font-semibold text-gray-800 text-base">
                        Notifications
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y">
                        {isLoading ? (
                            <p className="text-gray-500 text-sm p-4">Loading...</p>
                        ) : latestThree.length === 0 ? (
                            <p className="text-gray-500 text-sm p-4">No notifications</p>
                        ) : (
                            latestThree.map((n) => (

                                <div key={n._id} onClick={() => handleClickNotify(n)} className="flex flex-col gap-1 px-4 py-3 hover:bg-gray-100 transition">
                                    <div className="text-sm text-gray-800 font-medium truncate">
                                        {n.message}
                                    </div>
                                    <span className="text-xs text-gray-400 text-right">
                                        {moment(n.createdAt).fromNow()}
                                    </span>



                                </div>


                            ))
                        )}
                    </div>

                    <div className="p-3 text-center border-t">
                        <button
                            onClick={handleViewAll}
                            className="text-blue-600 text-sm font-medium hover:underline"
                        >
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
            <NotificationDetailsDialog
                isOpen={openNotify}
                onOpenChange={setOpenNotify}
                notify={selectedNotify}
            />
        </div>
    );
};
