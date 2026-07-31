"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useHideConversation() {
  return useMutation(api.conversations.hideConversation);
}