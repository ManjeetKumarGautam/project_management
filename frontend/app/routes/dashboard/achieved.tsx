'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/loader';
import { useGetAchievedTasksQuery } from '@/hooks/use-task';
import type { Task } from '@/types';



export default function Achieved() {


    const { data: tasks, isLoading } = useGetAchievedTasksQuery() as {
        data: Task[];
        isLoading: boolean;
    };

    console.log(tasks);


    if (isLoading) return <Loader />;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Achieved Tasks</h1>

            {tasks.length === 0 ? (
                <p className="text-muted-foreground">No achieved tasks found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <Card key={task._id} className="shadow-sm hover:shadow-md transition">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <Badge className="bg-green-500 text-white">Done</Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {/* {format(task?.completedAt, 'PPpp')} */}
                                    </span>
                                </div>
                                <h2 className="font-semibold text-lg">{task.title}</h2>
                                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                            </CardHeader>

                            <CardContent className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-muted-foreground">Project:</p>
                                    <p className="font-medium">{task.project?.title || 'N/A'}</p>
                                </div>

                                <div className="flex -space-x-2 items-center">
                                    {task.assignees.slice(0, 3).map((member) => (
                                        <Avatar key={member._id} className="h-8 w-8 border">
                                            <AvatarImage src={member.profilePicture} />
                                            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {task.assignees.length > 3 && (
                                        <span className="text-xs text-muted-foreground w-8 h-8 border bg-muted rounded-full flex items-center justify-center z-1">
                                            +{task.assignees.length - 3}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
