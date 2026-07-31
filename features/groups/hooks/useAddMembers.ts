"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useAddMembers() {
  return useMutation(api.groups.addMembers);
}