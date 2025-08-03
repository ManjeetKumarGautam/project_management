'use client';

import { BackButton } from '@/components/back-button';
import { Loader } from '@/components/loader';
import { AddMemberDialog } from '@/components/project/add-member';
import DeleteProjectDialog from '@/components/project/delete-project-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    UseProjectDetailsQuery,
    useUpdateProjectMutation,
} from '@/hooks/use-project';
import { projectSchema } from '@/lib/schema';
import { ProjectStatus, type Project, type MemberProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { CalendarIcon, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import type { z } from 'zod';

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectEdit() {
    const params = useParams();
    const projectId = params?.projectId as string;
    const [isDeleted, setIsDeleted] = useState(false);
    const [open, setOpen] = useState(false);
    const { mutate: updateProject, isPending } = useUpdateProjectMutation();

    const { data, isLoading } = UseProjectDetailsQuery(projectId) as {
        data: {
            project: Project;
            workspaceMembers: MemberProps[];
        };
        isLoading: boolean;
    };

    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            status: ProjectStatus.PLANNING,
            startDate: '',
            dueDate: '',
            members: [],
            tags: '',
        },
    });

    const onSubmit = (values: CreateProjectFormData) => {
        if (!projectId) return toast.error('Project ID not found');

        updateProject(
            { projectId, newData: values },
            {
                onSuccess: () => {
                    toast.success('Project updated successfully');
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || 'Update failed');
                },
            },
        );
    };

    useEffect(() => {
        if (data) {
            form.reset({
                title: data.project.title,
                description: data.project.description || '',
                status: data.project.status,
                startDate: data.project.startDate
                    ? new Date(data.project.startDate).toISOString()
                    : '',
                dueDate: data.project.dueDate
                    ? new Date(data.project.dueDate).toISOString()
                    : '',
                tags: Array.isArray(data.project.tags)
                    ? data.project.tags.join(',')
                    : data.project.tags || '',
            });
        }
    }, [data, form]);


    if (isLoading || !data) return <Loader />

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <BackButton />

            <Card className="p-6 space-y-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Settings />
                        <CardTitle>Project Settings</CardTitle>
                    </div>
                    <CardDescription>
                        Update your project details and delete the project
                    </CardDescription>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Project Title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Project Description" rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Project Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(ProjectStatus).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left">
                                                        <CalendarIcon className="size-4 mr-2" />
                                                        {field.value ? moment(field.value).format("MMM D, YYYY") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString() || '')}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left">
                                                        <CalendarIcon className="size-4 mr-2" />
                                                        {field.value ? moment(field.value).format("MMM D, YYYY") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString() || '')}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Tags separated by commas" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end mt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save changes'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>

            <Card className="p-6">
                <div className="flex justify-between">
                    <div>
                        <CardTitle>Project Members</CardTitle>
                        <CardDescription>List of all members in this project</CardDescription>
                    </div>
                    {data?.workspaceMembers?.length > 0 &&
                        <Button onClick={() => setOpen(true)} variant={'outline'} className="text-xs">
                            Add new
                        </Button>
                    }
                </div>

                {data.project?.members?.length > 0 ? (
                    <div className="divide-y">
                        {data.project?.members?.map((member) => (
                            <div key={member.user?._id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={member.user?.profilePicture} />
                                        <AvatarFallback>{member.user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm">{member.user?.name}</p>
                                    </div>
                                </div>
                                <Badge
                                    variant={['manager', 'admin'].includes(member.role) ? 'destructive' : member.role === 'viewer' ? 'secondary' : 'default'}
                                    className="capitalize"
                                >
                                    {member.role}
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h2 className="text-muted-foreground">No members assigned yet</h2>
                )}
            </Card>

            <Card className="p-6">
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for your project</CardDescription>
                <div className="mt-4">
                    <DeleteProjectDialog
                        isOpen={isDeleted}
                        onOpenChange={setIsDeleted}
                        projectId={projectId || ''}
                    />
                </div>
            </Card>

            {open &&
                <AddMemberDialog
                    projectId={projectId}
                    projectMembers={data?.workspaceMembers}
                    isOpen={open}
                    onOpenChange={setOpen}
                />
            }
        </div>
    );
}