"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function AuthSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    
    if (!isLoaded || !isSignedIn || !user) return;
// async function syncUser() {
//   await syncUser({
//   name:
//     user.fullName ||
//     user.username ||
//     user.firstName ||
//     user.primaryEmailAddress?.emailAddress ||
//     "Unknown User",

//   email: user.primaryEmailAddress?.emailAddress ?? "",

//   image: user.imageUrl,
// });
// }

syncUser({
  name:
    user.fullName ||
    user.username ||
    user.firstName ||
    user.primaryEmailAddress?.emailAddress ||
    "Unknown User",

  email: user.primaryEmailAddress?.emailAddress ?? "",
  image: user.imageUrl,
});

  }, [isLoaded, isSignedIn, user, syncUser]);

  return null;
}