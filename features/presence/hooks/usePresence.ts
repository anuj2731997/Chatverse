"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function usePresence(
  userId: Id<"users"> | undefined
) {
  return useQuery(
    api.presence.getPresence,
    userId
      ? { userId }
      : "skip"
  );
}