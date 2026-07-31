"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useTypingUsers(
  conversationId: Id<"conversations">
) {
  return useQuery(api.presence.getTypingUsers, {
    conversationId,
  });
}