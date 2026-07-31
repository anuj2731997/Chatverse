"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useDeleteGroup() {
  return useMutation(api.groups.deleteGroup);
}