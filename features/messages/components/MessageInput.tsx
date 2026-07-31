"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FunctionReturnType } from "convex/server";
import { useSendMessage } from "../hooks/useSendMessage";
import { useUploadImage } from "../hooks/useUploadImage"
import { useRef, useEffect } from "react";
import { EmojiPicker } from "./EmojiPicker";
import { useTyping } from "@/features/presence/hooks/useTyping";
import {
  ImageIcon,
  SendHorizonal,
} from "lucide-react";



type Message = FunctionReturnType<typeof api.messages.list>[number];

interface Props {
  conversationId: string;
  replyingTo: Message | null;

  clearReply: () => void;
}

export function MessageInput({
  conversationId,
  replyingTo,
  clearReply
}: Props) {

  const [body, setBody] = useState("");
  const generateUploadUrl = useUploadImage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useSendMessage();
  const [isSending, setIsSending] = useState(false);
  const setTyping = useTyping();



  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  
useEffect(() => {
  return () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTypingRef.current) {
      setTyping({
        conversationId: conversationId as Id<"conversations">,
        isTyping: false,
      }).catch(console.error);
    }
  };
}, [conversationId, setTyping]);

  async function handleSend() {
    if (!body.trim() && !selectedImage) {
      return;
    }

    try {
      setIsSending(true);
      let storageId;

      if (selectedImage) {
        storageId = await uploadImage(selectedImage);
      }

      await sendMessage({
        conversationId:
          conversationId as Id<"conversations">,

        body: body.trim(),

        image: storageId,
        replyTo: replyingTo?._id,
      });
      clearReply();
      setBody("");
      setSelectedImage(null);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      isTypingRef.current = false;

      await setTyping({
        conversationId: conversationId as Id<"conversations">,
        isTyping: false,
      });


    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }
  async function uploadImage(file: File) {
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    const { storageId } = await result.json();

    return storageId;
  }

  function handleImageSelect(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    setSelectedImage(file);


    e.target.value = "";
  }




  const handleTyping = () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;

      setTyping({
        conversationId: conversationId as Id<"conversations">,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;

      setTyping({
        conversationId: conversationId as Id<"conversations">,
        isTyping: false,
      });
    }, 1000);


  };



  return (
    <>
      {replyingTo && (
        <div className="mb-3 rounded-lg border-l-4 border-blue-500 bg-muted p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                Replying to {replyingTo.senderName}
              </p>

              <p className="truncate text-sm">
                {replyingTo.body}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearReply}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="mb-3 flex items-start gap-3">
          <img
            src={previewUrl!}
            alt="Preview"
            className="max-h-56 rounded-xl border"
          />

          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="rounded-full bg-red-500 px-3 py-1 mx-0 text-white hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex gap-2 border-t p-4">
        <EmojiPicker
          onEmojiSelect={(emoji) =>
            setBody((prev) => prev + emoji)
          }
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>
        <Input
          value={body}
          ref={inputRef}
          onChange={(e) => {
            setBody(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isSending) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <Button
          size="icon"
          onClick={handleSend}
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}