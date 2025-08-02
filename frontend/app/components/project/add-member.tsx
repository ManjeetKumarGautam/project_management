import { projectSchema } from "@/lib/schema";
import { ProjectStatus, type MemberProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { useAddMemberProjectMutation } from "@/hooks/use-project";

export interface CreateProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectMembers: MemberProps[];
    currentUserId: string; // ✅ Added this prop
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const AddMemberDialog = ({
    isOpen,
    onOpenChange,
    projectId,
    projectMembers,
    currentUserId, // ✅ Destructure here
}: CreateProjectDialogProps) => {
    const form = useForm<CreateProjectFormData>({

        defaultValues: {
            members: [],
        },
    });

    console.log(projectMembers);

    const { mutate, isPending } = useAddMemberProjectMutation();

    const onSubmit = (values: CreateProjectFormData) => {
        if (!projectId) return;

        mutate(
            { projectId, newData: values },
            {
                onSuccess: () => {
                    toast.success("Members added successfully");
                    form.reset();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || "Something went wrong";
                    toast.error(errorMessage);
                    console.error(error);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                    <DialogTitle>Add Members</DialogTitle>
                    <DialogDescription>
                        Add new members to this project
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => {
                                const selectedMembers = field.value || [];

                                return (
                                    <FormItem>
                                        <FormLabel>Members</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal min-h-11"
                                                    >
                                                        {selectedMembers.length === 0 ? (
                                                            <span className="text-muted-foreground">
                                                                Select Members
                                                            </span>
                                                        ) : selectedMembers.length <= 2 ? (
                                                            selectedMembers.map((m) => {
                                                                const member = projectMembers.find(
                                                                    (wm) => wm.user._id === m.user
                                                                );
                                                                return `${member?.user.name} (${m.role})`;
                                                            }).join(", ")
                                                        ) : (
                                                            `${selectedMembers.length} members selected`
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-full max-w-80 overflow-y-auto"
                                                    align="start"
                                                >
                                                    <div className="flex flex-col gap-2">
                                                        {projectMembers
                                                            ?.filter((member) => member.user._id !== currentUserId)
                                                            .map((member) => {
                                                                const selectedMember = selectedMembers.find(
                                                                    (m) => m.user === member.user._id
                                                                );

                                                                return (
                                                                    <div
                                                                        key={member._id}
                                                                        className="flex items-center gap-2 p-2 border rounded"
                                                                    >
                                                                        <Checkbox
                                                                            checked={!!selectedMember}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked) {
                                                                                    field.onChange([
                                                                                        ...selectedMembers,
                                                                                        {
                                                                                            user: member.user._id,
                                                                                            role: "contributor",
                                                                                        },
                                                                                    ]);
                                                                                } else {
                                                                                    field.onChange(
                                                                                        selectedMembers.filter(
                                                                                            (m) => m.user !== member.user._id
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                            id={`member-${member.user._id}`}
                                                                        />
                                                                        <span className="truncate flex-1">
                                                                            {member.user.name}
                                                                        </span>

                                                                        {selectedMember && (
                                                                            <Select
                                                                                value={selectedMember.role}
                                                                                onValueChange={(role) => {
                                                                                    field.onChange(
                                                                                        selectedMembers.map((m) =>
                                                                                            m.user === member.user._id
                                                                                                ? {
                                                                                                    ...m,
                                                                                                    role: role as
                                                                                                        | "contributor"
                                                                                                        | "manager"
                                                                                                        | "viewer",
                                                                                                }
                                                                                                : m
                                                                                        )
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select Role" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="manager">
                                                                                        Manager
                                                                                    </SelectItem>
                                                                                    <SelectItem value="contributor">
                                                                                        Contributor
                                                                                    </SelectItem>
                                                                                    <SelectItem value="viewer">
                                                                                        Viewer
                                                                                    </SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Adding..." : "Add Members"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
