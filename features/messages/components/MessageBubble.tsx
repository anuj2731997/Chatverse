"use client";

import { format } from "date-fns";
import { FunctionReturnType } from "convex/server";
import { Id } from "@/convex/_generated/dataModel";
import { MessageActions } from "./MessageActions";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useEditMessage } from "../hooks/useEditMessage";
import { useState } from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDeleteMessage } from "../hooks/useDeleteMessage";
import { ReadStatus } from "@/features/conversationReads/utils/getReadStatus";
import { MessageStatus } from "./MessageStatus"
import { forwardRef } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type Message =
  FunctionReturnType<typeof api.messages.list>[number];

interface Props {
  message: Message;
  previousMessage?: Message;
  nextMessage?: Message;
  onReply: (message: Message) => void;
  onJumpToMessage?: (messageId: Id<"messages">) => void;

  readStatus?: ReadStatus;
}
export const MessageBubble = forwardRef<
  HTMLDivElement,
  Props
>(function MessageBubble({ message, previousMessage, nextMessage, onReply,  onJumpToMessage, readStatus

}, ref) {

  const user = useCurrentUser();
  const editMessage = useEditMessage();
  const deleteMessage = useDeleteMessage();

  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(message.body);

  if (user === undefined || user === null) {
    return null;
  }

  const isMine = message.senderId === user._id;




  const isFirstMessage =
    !previousMessage ||
    previousMessage.senderId !== message.senderId;

  const isLastMessage =
    !nextMessage ||
    nextMessage.senderId !== message.senderId;

  const bubbleClasses = [
    "relative",
    "px-4",
    "py-3",
    "max-w-sm",
    "shadow-sm",
    "transition-colors",


    isMine
      ? "bg-blue-600 text-white"
      : "bg-muted text-foreground",

    isFirstMessage
      ? "rounded-t-2xl"
      : "rounded-t-md",

    isLastMessage
      ? "rounded-b-2xl"
      : "rounded-b-md",

    isMine
      ? "rounded-l-2xl"
      : "rounded-r-2xl",
  ].join(" ");

  async function handleSave() {
    const body = editedBody.trim();

    if (!body) return;

    await editMessage({
      messageId: message._id,
      body,
    });

    setIsEditing(false);
  }
  function handleCancel() {
    setEditedBody(message.body);
    setIsEditing(false);
  }
  function handleEdit() {
    setEditedBody(message.body);
    setIsEditing(true);
  }
  async function handleDelete() {
    await deleteMessage({
      messageId: message._id,
    });
  }

  function handleReply() {
    onReply(message);
  }

  return (
    <div
      ref={ref}

      id={`message-${message._id}`}
      className={`${isLastMessage ? "mb-4" : "mb-0.5"
        } flex ${isMine ? "justify-end" : "justify-start"}`}
    >
      {!isMine && (
        <div className="mr-3 w-8 flex-shrink-0">
          {isFirstMessage && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.senderImage} />
              <AvatarFallback>
                {message.senderName?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div className="group w-fit max-w-sm">

        {!isMine && isFirstMessage && (
          <p className="mb-1 text-xs font-medium">
            {message.senderName}
          </p>
        )}


        <div className="relative w-fit max-w-sm">

          <div
            className={`absolute top-2 z-10 ${isMine ? "-left-10" : "-right-6"
              } opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
          >
            <MessageActions
              isMine={isMine}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Message bubble */}
          <div className={bubbleClasses}>

            {message.deleted ? (
              <p className="italic text-lg text-red-400">
                This message was deleted.
              </p>
            ) : (

              <>
                {message.reply && (

                  <div
                    onClick={() => {
                      if (!message.reply) return;

                      onJumpToMessage?.(message.reply.id);
                    }}
                  >
                    <p className="text-xs font-semibold text-blue-500">
                      Replying to {message.reply.senderName}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {message.reply.body || "📷 Image"}
                    </p>
                  </div>
                )}
                {message.image && (
                  <a
                    href={message.image}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={message.image}
                      alt="Message"
                      className="
                          mb-2
                          max-h-80
                          max-w-full
                          rounded-xl
                          object-contain
                          transition-opacity
                          hover:opacity-90
                          cursor-pointer
                           "
                    />
                  </a>
                )}

                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedBody}
                      onChange={(e) =>
                        setEditedBody(e.target.value)
                      }
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSave();
                        }

                        if (e.key === "Escape") {
                          handleCancel();
                        }
                      }}
                    />

                    <div className="flex justify-end gap-2 text-red-500">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>

                      <Button
                        size="sm"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  message.body && (
                    <p className="break-words">
                      {message.body}
                    </p>
                  )
                )}
              </>
            )}

            {isLastMessage && (
              <div className="mt-2 flex items-center justify-end gap-2">
                <p
                  className={`text-[11px] ${isMine
                    ? "text-blue-100"
                    : "text-muted-foreground"
                    }`}
                >
                  {message.edited && "Edited • "}
                  {format(
                    new Date(message.createdAt),
                    "HH:mm"
                  )}
                </p>

                {isMine && readStatus && (
                  <MessageStatus
                    readStatus={readStatus}
                    isGroup={false}
                    className={
                      isMine
                        ? "text-blue-100"
                        : "text-muted-foreground"
                    }
                  />
                )}
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );


}
);