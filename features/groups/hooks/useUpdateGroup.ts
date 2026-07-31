"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useUpdateGroup() {
  return useMutation(api.groups.updateGroup);
}