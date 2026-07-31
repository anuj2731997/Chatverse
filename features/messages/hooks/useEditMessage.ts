"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useEditMessage() {
  return useMutation(api.messages.edit);
}