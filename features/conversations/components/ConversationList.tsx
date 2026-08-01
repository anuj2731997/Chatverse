"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConversationItem } from "./ConversationItem";
import { Skeleton } from "@/components/ui/skeleton";


import type { FunctionReturnType } from "convex/server";

type Conversation = FunctionReturnType<
  typeof api.conversations.list
>[number];
export function ConversationList() {
  const conversations = useQuery(
    api.conversations.list
  );


  if (conversations === undefined) {
    return (
      <div className="p-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full mt-2" />
        <Skeleton className="h-6 w-full mt-2" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-muted-foreground">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation: Conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
        />
      ))}
    </div>
  );
}