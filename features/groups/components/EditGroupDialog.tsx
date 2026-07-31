"use client";

import { useEffect, useRef, useState } from "react";

import { Camera, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel";

import { useGroup } from "../hooks/useGroup";
import { useUpdateGroup } from "../hooks/useUpdateGroup";
// import { useUploadImage } from "@/features/messages/hooks/useUploadImage";
import { uploadImage } from "@/lib/uploadImage";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

interface Props {
    conversationId: Id<"conversations">;
}

export function EditGroupDialog({
    conversationId,
}: Props) {
    const group = useGroup(conversationId);

    const updateGroup = useUpdateGroup();
    // const generateUploadUrl = useUploadImage();

    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");

    const [selectedImage, setSelectedImage] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(false);

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!group || !open) return;

        setName(group.name);
        setPreview(group.image ?? null);
        setSelectedImage(null);
    }, [group, open]);

    useEffect(() => {
        if (!selectedImage) return;

        const url = URL.createObjectURL(selectedImage);

        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [selectedImage]);

    // async function uploadImage(file: File) {
    //     const postUrl = await generateUploadUrl();

    //     const result = await fetch(postUrl, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": file.type,
    //         },
    //         body: file,
    //     });

    //     const { storageId } = await result.json();

    //     return storageId;
    // }


    function handleImageSelect(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image.");
            return;
        }

        const MAX_SIZE = 5 * 1024 * 1024;

        if (file.size > MAX_SIZE) {
            toast.error("Image must be smaller than 5 MB.");
            return;
        }

        setSelectedImage(file);

        e.target.value = "";
    }
    async function handleSave() {
        if (!name.trim()) {
            toast.error("Group name is required.");
            return;
        }

        try {
            setLoading(true);

            let image = group?.image;

            if (selectedImage) {
                image = await uploadImage(selectedImage);
            }

            await updateGroup({
                conversationId,
                name: name.trim(),
                image,
            });

            toast.success("Group updated.");

            setOpen(false);
            setSelectedImage(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update group.");
        } finally {
            setLoading(false);
        }
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button variant="outline" />
                }
            >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Group
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Edit Group
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={preview ?? ""} />
                                <AvatarFallback>
                                    {name.trim().charAt(0).toUpperCase() || "G"}
                                </AvatarFallback>
                            </Avatar>

                            <Button
                                size="icon"
                                className="absolute -bottom-2 -right-2 rounded-full"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                            >
                                <Camera className="h-4 w-4" />
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </div>
                    </div>

                    <Input
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Group name"
                    />

                    <Button
                        className="w-full"
                        onClick={handleSave}
                        disabled={loading || !name.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );

}

