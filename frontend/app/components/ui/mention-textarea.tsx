'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Member {
    id: string;
    name: string;
    email: string;
}

const dummyMembers: Member[] = [
    { id: '1', name: 'Codewave Akwasi', email: 'akwasi@example.com' },
    { id: '2', name: 'Manjeet Kumar', email: 'manjeet@example.com' },
    { id: '3', name: 'John Doe', email: 'john@example.com' },
];

export default function MentionTextarea() {
    const [value, setValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
    const [mentionQuery, setMentionQuery] = useState('');
    const [caretPos, setCaretPos] = useState(0);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Detect typing "@" and trigger suggestion list
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setValue(text);

        const cursor = e.target.selectionStart || 0;
        const sliced = text.slice(0, cursor);
        const match = sliced.match(/@([\w]*)$/); // detect @mention

        if (match) {
            setMentionQuery(match[1]);
            const filtered = dummyMembers.filter((m) =>
                m.name.toLowerCase().includes(match[1].toLowerCase())
            );
            setFilteredMembers(filtered);
            setShowSuggestions(true);
            setCaretPos(cursor);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectMember = (member: Member) => {
        const cursor = caretPos;
        const beforeMention = value.slice(0, cursor).replace(/@[\w]*$/, `@${member.name}`);
        const afterMention = value.slice(cursor);
        const newText = `${beforeMention} ${afterMention}`;
        setValue(newText);
        setShowSuggestions(false);
        textareaRef.current?.focus();
    };

    return (
        <div className="relative max-w-xl mx-auto mt-10">
            <textarea
                ref={textareaRef}
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Add a comment"
                value={value}
                onChange={handleChange}
                rows={4}
            />

            {showSuggestions && filteredMembers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-sm max-h-48 overflow-y-auto">
                    {filteredMembers.map((member) => (
                        <div
                            key={member.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleSelectMember(member)}
                        >
                            <span className="font-medium">@{member.name}</span>
                            <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
