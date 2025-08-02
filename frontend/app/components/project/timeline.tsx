"use client";

import type { Task, User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState, useMemo } from "react";

// interface Task {
//     _id: string;
//     assignees: User[];
//     title: string;
//     createdAt: Date;
//     dueDate: Date;
//     priority: "Low" | "Medium" | "High";
//     createdBy: string;
// }

const priorityColors = {
    Low: "#3b82f6",
    Medium: "#f59e0b",
    High: "#ef4444",
};

export default function Timeline({ tasks }: { tasks: Task[] }) {

    console.log(tasks);
    const [currentDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState<string | null>(null);

    const dateRange = useMemo(() => {
        if (tasks.length === 0) return { start: new Date(), end: new Date(), days: [] };

        const startDate = new Date(Math.min(...tasks.map(t => new Date(t.createdAt).getTime())));
        const endDate = new Date(Math.max(...tasks.map(t => new Date(t.dueDate).getTime())));

        // startDate.setDate(startDate.getDate() - 10);
        // endDate.setDate(endDate.getDate() + 10);

        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1, 1);

        const days: Date[] = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return { start: startDate, end: endDate, days };
    }, [tasks]);

    const getTaskBarStyle = (task: Task) => {
        const dayWidth = 40;
        const startIndex = dateRange.days.findIndex(day => day.toDateString() === new Date(task.createdAt).toDateString());
        const endIndex = dateRange.days.findIndex(day => day.toDateString() === new Date(task.dueDate).toDateString());
        if (startIndex === -1 || endIndex === -1) return { left: 0, width: 0 };
        return { left: startIndex * dayWidth, width: (endIndex - startIndex + 1) * dayWidth };
    };

    const getCurrentDayPosition = () => {
        const dayWidth = 40;
        const currentIndex = dateRange.days.findIndex(day => day.toDateString() === currentDate.toDateString());
        return currentIndex !== -1 ? currentIndex * dayWidth : -1;
    };

    const formatMonth = (date: Date) => date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const monthGroups = useMemo(() => {
        const groups: { month: string; days: Date[] }[] = [];
        let currentMonth = "";
        let group: Date[] = [];

        dateRange.days.forEach(day => {
            const m = formatMonth(day);
            if (m !== currentMonth) {
                if (group.length) groups.push({ month: currentMonth, days: group });
                currentMonth = m;
                group = [day];
            } else group.push(day);
        });
        if (group.length) groups.push({ month: currentMonth, days: group });
        return groups;
    }, [dateRange.days]);

    const currentDayPosition = getCurrentDayPosition();

    return (
        <div className="bg-gray-50 flex flex-col max-w-fit">
            <div className="flex-1 flex overflow-hidden">
                <div className="border-r">
                    <div className="bg-white border-b px-6 py-4 h-20">
                        <h1 className="text-2xl font-semibold">Project Timeline</h1>
                    </div>
                    <div className="w-60 border-r bg-white overflow-y-auto">
                        {tasks.map(task => (
                            <div
                                key={task._id}
                                onClick={() => setSelectedTask(task._id)}
                                className="border-b p-4 cursor-pointer hover:bg-gray-100"
                                style={{ height: "80px" }}
                            >
                                <div className="flex mb-1 items-center gap-2">
                                    <div className="font-medium text-sm ">{task.title}</div>
                                    <div className="w-3 h-3 border rounded-full" style={{ backgroundColor: priorityColors[task.priority] }}></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {task.assignees && task.assignees.length > 0 && (
                                        <div className="flex -space-x-2">
                                            {task.assignees.slice(0, 5).map((member) => (
                                                <Avatar
                                                    key={member._id}
                                                    className="relative size-8 flex items-center justify-center text-xs bg-gray-300 rounded-full border-2 border-background overflow-hidden"
                                                    title={member.name}
                                                >
                                                    <AvatarImage src={member.profilePicture} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            ))}

                                            {task.assignees.length > 5 && (
                                                <span className="text-xs text-muted-foreground">
                                                    + {task.assignees.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-x-auto">
                    <div className="min-w-fit">
                        <div className="sticky h-20 top-0 z-10 bg-white border-b">
                            <div className="flex">
                                {monthGroups.map((group, idx) => (
                                    <div
                                        key={idx}
                                        className="text-sm font-medium text-center border-r py-2 bg-gray-50"
                                        style={{ width: `${group.days.length * 40}px` }}
                                    >
                                        {group.month}
                                    </div>
                                ))}
                            </div>
                            <div className="flex">
                                {dateRange.days.map((day, i) => (
                                    <div
                                        key={i}
                                        className="w-10 text-center text-xs border-r py-1"
                                    >
                                        <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                                        <div>{day.getDate()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative" style={{ width: `${dateRange.days.length * 40}px` }}>
                            {currentDayPosition >= 0 && (
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                                    style={{ left: `${currentDayPosition}px` }}
                                />
                            )}

                            {tasks.map(task => {
                                const style = getTaskBarStyle(task);
                                return (
                                    <div key={task._id} className="relative border-b" style={{ height: "80px" }}>
                                        <div className="absolute inset-0 flex">
                                            {dateRange.days.map((_, i) => (
                                                <div key={i} className="w-10 border-r border-gray-100" />
                                            ))}
                                        </div>
                                        <div
                                            className="absolute top-1/2 transform -translate-y-1/2 h-6 rounded-md shadow-md text-white text-xs px-2 flex items-center truncate"
                                            style={{
                                                left: `${style.left}px`,
                                                width: `${style.width}px`,
                                                backgroundColor: priorityColors[task.priority],
                                            }}
                                        >
                                            {task.title.length > 20 ? task.title.slice(0, 20) + "..." : task.title}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
