'use client';

import React from 'react';
import moment from 'moment';
import type { Notification } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface NotificationCardProps {
    notify: Notification;
    setSelectedNotify: (notify: Notification) => void;
    setOpenNotify: (open: boolean) => void;
}

export default function NotificationCard({
    notify,
    setSelectedNotify,
    setOpenNotify
}: NotificationCardProps) {
    return (
        <div
            onClick={() => { setSelectedNotify(notify); setOpenNotify(true) }}
            className="w-full mx-auto mt-4 p-4 border rounded-md bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:shadow-sm transition"
        >
            <div className="flex items-start sm:items-center gap-3 w-4/5">
                <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        {notify?.user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                </Avatar>

                <div className="text-sm text-gray-800">
                    <p className="line-clamp-2">{notify.message}</p>
                </div>
            </div>

            <div className="w-1/5 flex flex-row sm:flex-col text-xs items-center justify-between mt-3 sm:mt-0 text-gray-500 gap-1 sm:items-end">
                <span>{moment(notify.createdAt).fromNow()}</span>
                {!notify.isRead && (
                    <span onClick={() => { setSelectedNotify(notify); setOpenNotify(true) }} className="text-blue-600 text-sm hover:underline sm:mt-6 cursor-pointer">
                        Mark as read
                    </span>
                )}
            </div>
        </div>
    );
}
