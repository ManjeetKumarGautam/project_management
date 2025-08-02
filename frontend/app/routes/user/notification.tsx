import { BackButton } from '@/components/back-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import type { Notification } from '@/components/ui/notification-bell';
import NotificationDetailsDialog from '@/components/user/notification-details';
import NotificationCard from '@/components/user/NotificationCard';
import { useNotificationsQuery } from '@/hooks/use-notify';
import React, { useState } from 'react'

function Notification() {
    const [selectedNotify, setSelectedNotify] = useState<Notification | null>(null);
    const [openNotify, setOpenNotify] = useState(false);

    const { data = [], isLoading } = useNotificationsQuery();

    return (
        <div>
            {/* notify header */}
            <div className='sticky top-10 pb-5 bg-white'>
                <BackButton />
                <div className='flex justify-between items-center '>
                    <CardTitle>Notifications</CardTitle>
                    <div className="flex items-center space-x-2 text-sm">
                        <div className="space-x-2">
                            <Badge variant="outline" className="bg-black text-white">
                                9 new
                            </Badge>
                            <Badge variant="outline">
                                Mark all as read
                            </Badge>

                        </div>
                    </div>
                </div>
            </div>
            {/* notify  */}

            <div className=''>
                {
                    data.map((notify: Notification) => (
                        <NotificationCard key={notify._id} notify={notify} setSelectedNotify={setSelectedNotify} setOpenNotify={setOpenNotify} />
                    ))
                }


            </div>



            <NotificationDetailsDialog
                isOpen={openNotify}
                onOpenChange={setOpenNotify}
                notify={selectedNotify}
            />
        </div>
    )
}

export default Notification;