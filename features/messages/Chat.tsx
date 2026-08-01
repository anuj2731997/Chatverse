"use client";

import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import {PresenceProvider} from "@/features/presence/PresenceProvider"
import { Id } from "@/convex/_generated/dataModel";

type Message = FunctionReturnType<typeof api.messages.list>[number];

interface Props {
  conversationId: Id<"conversations">;
}


export function Chat({
  conversationId,
}: Props) {

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);




  return (
    <div className="flex h-full min-h-0 flex-col">
<PresenceProvider conversationId={conversationId}>

      <ChatHeader
        conversationId={conversationId}
      />

      <MessageList
        conversationId={conversationId}
        onReply={setReplyingTo}
      />

      <MessageInput
        conversationId={conversationId}
        replyingTo={replyingTo}
        clearReply={() => setReplyingTo(null)}
      />
</PresenceProvider>
    </div>
  );
}