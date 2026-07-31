"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useCreateGroup() {
  return useMutation(api.conversations.create);
}