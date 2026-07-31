"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useMessages(
  conversationId: Id<"conversations">
) {
  return useQuery(
    api.messages.list,
    {
      conversationId,
    }
  );
}