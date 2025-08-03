'use client';

import type { Comment, User } from "@/types";
import { useState, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  useAddCommentMutation,
  useGetCommentsByTaskIdQuery,
} from "@/hooks/use-task";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import moment from "moment";
import { Loader } from "../loader";

export const CommentSection = ({
  taskId,
  members,
}: {
  taskId: string;
  members: { user: User }[];
}) => {

  const [newComment, setNewComment] = useState('');
  const [mentionQuery, setMentionQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<{ user: User }[]>([]);
  const [caretPosition, setCaretPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: addComment, isPending } = useAddCommentMutation();
  const { data: comments, isLoading } = useGetCommentsByTaskIdQuery(taskId) as {
    data: Comment[];
    isLoading: boolean;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment(
      { taskId, text: newComment },
      {
        onSuccess: () => {
          setNewComment('');
          toast.success('Comment added successfully');
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
          console.log(error);
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setCaretPosition(cursorPos);
    setNewComment(value);

    const textBeforeCaret = value.slice(0, cursorPos);
    const match = textBeforeCaret.match(/@([\w\s]*)$/);


    if (match) {
      const query = match[1].toLowerCase();
      setMentionQuery(query);
      const filtered = members.filter((member) =>
        member.user.name.toLowerCase().includes(query)
      );
      setFilteredMembers(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectMention = (member: User) => {
    const before = newComment.slice(0, caretPosition).replace(/@[\w\s]*$/, `@${member.name}`);
    const after = newComment.slice(caretPosition);
    setNewComment(before + ' ' + after);
    setShowSuggestions(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm relative">
      <h3 className="text-lg font-medium mb-4">Comments</h3>

      <ScrollArea className="h-[300px] mb-4">
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 py-2">
              <Avatar className="size-8">
                <AvatarImage src={comment.author.profilePicture} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No comment yet</p>
          </div>
        )}
      </ScrollArea>

      <Separator className="my-4" />

      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Add a comment"
          value={newComment}
          onChange={handleChange}
          rows={3}
        />
        {showSuggestions && filteredMembers.length > 0 && (
          <div className="absolute z-20 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto w-full shadow-lg">
            {filteredMembers.map((member) => (
              <div
                key={member.user._id}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectMention(member.user)}
              >
                {member.user.name}
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-4">
          <Button disabled={!newComment.trim() || isPending} onClick={handleAddComment}>
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
