"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  conversationId: Id<"conversations">;
  children: React.ReactNode;
}

export function PresenceProvider({
  conversationId,
  children,
}: Props) {
  const heartbeat = useMutation(api.presence.heartbeat);
  const markOffline = useMutation(api.presence.markOffline);
  const sendHeartbeat = () => {
  if (!conversationId) return;

  heartbeat({
    conversationId,
  });
};

useEffect(() => {
  if (!conversationId) return;

  const sendHeartbeat = async () => {
    try {
      await heartbeat({ conversationId });
    } catch (err) {
      console.error("Heartbeat failed:", err);
    }
  };

  sendHeartbeat();

  const interval = setInterval(sendHeartbeat, 30000);

  return () => {
    clearInterval(interval);

    markOffline().catch(console.error);
  };
}, [conversationId, heartbeat, markOffline]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        sendHeartbeat();
      } else {
        markOffline();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [conversationId, heartbeat, markOffline]);

  return <>{children}</>;
}