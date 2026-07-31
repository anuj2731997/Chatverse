"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useMe() {
  return useQuery(api.users.me);
}