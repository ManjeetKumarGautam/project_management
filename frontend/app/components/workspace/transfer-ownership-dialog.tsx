import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface Member {
    _id: string;
    name?: string;
    email?: string;
    profilePicture?: string;
    user?: {
        _id: string;
        name?: string;
        email?: string;
        profilePicture?: string;
    };
}

interface TransferOwnershipDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    members: Member[];
    onTransfer: (memberId: string) => void;
}

export const TransferOwnershipDialog = ({
    open,
    onOpenChange,
    members,
    onTransfer,
}: TransferOwnershipDialogProps) => {
    const [selectedMemberId, setSelectedMemberId] = useState<string>("");

    const handleTransfer = () => {
        if (selectedMemberId) {
            onTransfer(selectedMemberId);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Workspace Ownership</DialogTitle>
                    <DialogDescription>
                        Select a member to transfer ownership of this workspace. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {members.map((user) => {
                        // const user = member.user;
                        if (!user) return null;

                        return (
                            <label
                                key={user._id}
                                className={`flex relative items-center gap-3 p-3 border rounded-md cursor-pointer ${selectedMemberId === user._id ? "border-primary bg-accent" : ""
                                    }`}
                                onClick={() => setSelectedMemberId(user._id)}
                            >
                                <input
                                    type="radio"
                                    name="member"
                                    value={user._id}
                                    checked={selectedMemberId === user._id}
                                    onChange={() => setSelectedMemberId(user._id)}
                                    className="absolute right-5 top-[50%] translate-y-[-50%]"
                                />
                                <Avatar>
                                    <AvatarImage src={user.profilePicture} />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>

                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={handleTransfer}
                        variant="destructive"
                        disabled={!selectedMemberId}
                    >
                        Transfer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
