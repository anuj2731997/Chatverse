"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useRemoveMember } from "../hooks/useRemoveMember";
import { useNow } from "@/features/presence/hooks/useNow";
import { formatLastSeen } from "@/features/presence/utils/formatLastSeen";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Member {
  _id: Id<"users">;
  name: string;
  image?: string;
  role: "admin" | "member";
  isOnline: boolean;
  lastSeen?: number;
}

interface GroupMemberProps {
  member: Member;
  conversationId: Id<"conversations">;
  currentUserId: Id<"users">;
  isCurrentUserAdmin: boolean;
}

export function GroupMember({
  member,
  conversationId,
  currentUserId,
  isCurrentUserAdmin,
}: GroupMemberProps) {
  const removeMember = useRemoveMember();

  const now = useNow();

  const [loading, setLoading] = useState(false);

  const canRemove =
    isCurrentUserAdmin &&
    member.role !== "admin" &&
    member._id !== currentUserId;

  const handleRemove = async () => {
    try {
      setLoading(true);

      await removeMember({
        conversationId,
        userId: member._id,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={member.image} />
          <AvatarFallback>
            {member.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{member.name}</p>

            {member.role === "admin" && (
              <Badge>Admin</Badge>
            )}

            {member._id === currentUserId && (
              <Badge variant="secondary">
                You
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {member.isOnline
              ? "Online"
              : formatLastSeen(
                  member.lastSeen ?? 0,
                  now
                )}
          </p>
        </div>
      </div>

      {canRemove && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button size="sm" variant="destructive">
                Remove
              </Button>
            }
          />

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Remove Member?
              </AlertDialogTitle>

              <AlertDialogDescription>
                {member.name} will be removed from
                this group and lose access to all
                future messages.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={loading}
                onClick={handleRemove}
              >
                {loading
                  ? "Removing..."
                  : "Remove"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}