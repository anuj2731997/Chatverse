"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link"
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";

import type { FunctionReturnType } from "convex/server";
import { useCurrentUser } from "@/features/messages/hooks/useCurrentUser";
type Conversation = FunctionReturnType<
  typeof api.conversations.list
>[number];




interface Props {
  conversation: Conversation;
}

export function ConversationItem({
  conversation,
}: Props) {

  const currentUser = useCurrentUser();

  if (!currentUser) {
    return null;
  }


  let preview = "No messages yet";

  if (conversation.lastMessage) {
    const isMine =
      conversation.lastMessage.senderId === currentUser._id;

    if (conversation.lastMessage.deleted) {
      preview = isMine
        ? "You deleted a message"
        : "This message was deleted";
    } else if (conversation.lastMessage.image) {
      preview = isMine
        ? "You: 📷 Photo"
        : conversation.isGroup
          ? `${conversation.lastMessage.senderName}: 📷 Photo`
          : "📷 Photo";
    } else {
      if (isMine) {
        preview = `You: ${conversation.lastMessage.body}`;
      } else if (conversation.isGroup) {
        preview = `${conversation.lastMessage.senderName}: ${conversation.lastMessage.body}`;
      } else {
        preview = conversation.lastMessage.body;
      }
    }
  }

  console.log("conversation", conversation);

  return (
    <Link
      href={`/chat/${conversation.id}`}
      className="flex w-full items-center gap-3 border-b p-4 text-left transition hover:bg-muted">
      <Avatar>
        <AvatarFallback>
          {conversation.title.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <p className="truncate font-medium">
            {conversation.title}
          </p>

          <div className="ml-2 flex flex-col items-end gap-1">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(
                new Date(conversation.lastMessageTime),
                { addSuffix: true }
              )}
            </span>

            {conversation.unreadCount > 0 && (
              <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1.5 text-xs font-medium text-white">
                {conversation.unreadCount}
              </div>
            )}
          </div>
        </div>

        <p className="truncate text-sm text-muted-foreground">
          {preview}
        </p>
      </div>
    </Link>
  );
}