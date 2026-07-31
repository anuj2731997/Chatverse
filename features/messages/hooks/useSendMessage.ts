"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSendMessage() {
  return useMutation(api.messages.send);
}