"use client";

import { useState } from "react";
import EmojiPickerReact, { EmojiClickData } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({
    onEmojiSelect,
}: EmojiPickerProps) {
    const [open, setOpen] = useState(false);

    function handleEmojiClick(emojiData: EmojiClickData) {
        onEmojiSelect(emojiData.emoji);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <span className="inline-flex">
                    <Smile className="h-5 w-5 cursor-pointer" />
                </span>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto border-none p-0 shadow-lg"
                align="start"
            >
                <EmojiPickerReact
                    onEmojiClick={handleEmojiClick}
                    lazyLoadEmojis
                    skinTonesDisabled
                />
            </PopoverContent>
        </Popover>
    );
}