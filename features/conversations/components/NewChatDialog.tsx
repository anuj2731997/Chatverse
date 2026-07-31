"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { api } from "@/convex/_generated/api";
import { useDebounce } from "@/hooks/useDebounce";
import { UserSearch } from "./UserSearch";
import { UserResult } from "./UserResult";
import { useCreateConversation } from "../hooks/useCreateConversation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewChatDialog({
  open,
  onOpenChange,
}: Props) {
  const [search, setSearch] = useState("");

  const debounced = useDebounce(search);
  const [loadingUser, setLoadingUser] =
  useState<Id<"users"> | null>(null);


  const users = useQuery(
  api.users.searchUsers,
  open ? { search: debounced } : "skip"
);


  const createConversation =
    useCreateConversation();

  const router = useRouter();


  async function handleClick(userId: Id<"users">) {
  try {
    setLoadingUser(userId);

    const conversationId =
      await createConversation({
        otherUserId: userId,
      });

    onOpenChange(false);

    router.push(`/chat/${conversationId}`);
  } finally {
    setLoadingUser(null);
  }
}


  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            New Chat
          </DialogTitle>
        </DialogHeader>

        <UserSearch
          value={search}
          onChange={setSearch}
        />

        <div className="mt-4 space-y-2">
          {users === undefined && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          )}

          {search.trim() === "" ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Start typing to search for users.
            </p>
          ) : users?.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No users found.
            </p>
          ) : (
            users?.map((user) => (
            <UserResult
              key={user._id}
              user={user}
              onClick={() =>
                handleClick(user._id)
              }
              loading={loadingUser === user._id}

            />
          ))
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}