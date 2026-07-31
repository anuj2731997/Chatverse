"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";
import { useConversation } from "../hooks/useConversation";
import { usePresence } from "@/features/presence/hooks/usePresence"
import { formatLastSeen } from "@/features/presence/utils/formatLastSeen";
import { useNow } from "@/features/presence/hooks/useNow";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTypingUsers } from "@/features/presence/hooks/useTypingUsers";
import {toast} from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { useHideConversation } from "@/features/conversations/hooks/useHideConversation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  conversationId: string;
}

export function ChatHeader({
  conversationId,
}: Props) {


  const hideConversation = useHideConversation();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const now = useNow();
  const router = useRouter();

  const conversation = useConversation(
    conversationId as Id<"conversations">
  );

  const typingUsers = useTypingUsers(
    conversationId as Id<"conversations">
  );



  const presence = usePresence(
    conversation?.otherUser?._id
  );

  const title = conversation?.title;

  let subtitle = "";

  if (typingUsers && typingUsers.length > 0) {

    typingUsers.sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    switch (typingUsers.length) {
      case 1:
        subtitle = `${typingUsers[0].name} is typing...`;
        break;

      case 2:
        subtitle = `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
        break;

      default:
        subtitle = `${typingUsers.length} people are typing...`;
        break;
    }
  } else if (conversation?.isGroup) {
    subtitle = `${conversation.memberCount} members`;
  } else {
    subtitle = presence?.isOnline
      ? "Online"
      : presence
        ? formatLastSeen(presence.lastSeen, now)
        : "Offline";
  }


  if (conversation === undefined) {
    return (
      <div className="flex h-16 items-center border-b px-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-16 items-center justify-between border-b px-6">
      <div
        className="flex items-center gap-3 cursor-pointer"


        onClick={() => {
          if (conversation?.isGroup) {
            router.push(`/groups/${conversation.id}`);
          }
        }}
      >
        <Avatar>
          <AvatarImage src={conversation?.image} />
          <AvatarFallback>
            {conversation?.isGroup ? "👥" : conversation?.title.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold">
            {title}
          </h2>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {!conversation?.isGroup && (
              <span
                className={`h-2.5 w-2.5 rounded-full ${presence?.isOnline
                  ? "bg-green-500"
                  : "bg-gray-400"
                  }`}
              />
            )}

            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>



        </div>
      </div>

      {!conversation?.isGroup && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600"
              onClick={() =>
                setOpenDeleteDialog(true)
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <AlertDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete chat?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This chat will be removed from your conversation list.

              If either participant sends a new message,
              it will appear again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                try {
                  await hideConversation({
                    conversationId: conversation?.id as Id<"conversations">,
                  });

                  router.push("/chat");
                } catch (error) {
                  toast.error("Failed to delete chat.");
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}