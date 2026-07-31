"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useConversationReads(
  conversationId: Id<"conversations">
) {
  return useQuery(
    api.conversationReads.getConversationReads,
    {
      conversationId,
    }
  );
}