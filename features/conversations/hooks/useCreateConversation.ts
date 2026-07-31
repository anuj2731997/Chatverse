"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useCreateConversation() {
  return useMutation(api.conversations.getOrCreate);
}