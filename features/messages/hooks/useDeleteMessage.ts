"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useDeleteMessage() {
  return useMutation(api.messages.remove);
}