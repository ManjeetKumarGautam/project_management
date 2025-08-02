'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AttachmentModal() {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<'upload' | 'url'>('url');
    const [fileName, setFileName] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const handleAdd = () => {
        console.log({ fileName, fileUrl });
        setOpen(false);
        setFileName('');
        setFileUrl('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add Attachment</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Attachment</DialogTitle>
                    <DialogDescription>Upload or link a file</DialogDescription>
                </DialogHeader>

                {/* Tab Switch */}
                <div className="flex mb-4 border-b">
                    <button
                        className={`w-1/2 py-2 text-center ${tab === 'upload' ? 'font-semibold border-b-2 border-blue-600' : ''
                            }`}
                        onClick={() => setTab('upload')}
                    >
                        📤 Upload
                    </button>
                    <button
                        className={`w-1/2 py-2 text-center ${tab === 'url' ? 'font-semibold border-b-2 border-blue-600' : ''
                            }`}
                        onClick={() => setTab('url')}
                    >
                        🔗 By URL
                    </button>
                </div>

                {/* Form Fields */}
                {tab === 'url' && (
                    <div className="space-y-4">
                        <Input
                            placeholder="File name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                        <Input
                            placeholder="File URL"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                        />
                    </div>
                )}

                {tab === 'upload' && (
                    <div>
                        <Input type="file" />
                    </div>
                )}

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={handleAdd}
                        disabled={tab === 'url' && (!fileName || !fileUrl)}
                    >
                        Add Attachment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
