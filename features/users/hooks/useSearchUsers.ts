"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSearchUsers(search: string) {
  return useQuery(api.users.searchUsers, {
    search,
  });
}