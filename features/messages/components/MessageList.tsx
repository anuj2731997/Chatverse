"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useMessages } from "../hooks/useMessages";
import { MessageBubble } from "./MessageBubble";
import { api } from "@/convex/_generated/api";
import { useMarkAsRead } from "@/features/conversationReads/hooks/useMarkAsRead";
import { FunctionReturnType } from "convex/server";
import { useEffect } from "react";
import { useMe } from "@/features/users/hooks/useMe";
import { useConversationReads } from "@/features/conversationReads/hooks/useConversationReads";
import { useMemo } from "react";
import { createReadMap } from "@/features/conversationReads/utils/createReadMap";
import { getReadStatus } from "@/features/conversationReads/utils/getReadStatus";
import { useRef ,useCallback} from "react";

type Message = FunctionReturnType<typeof api.messages.list>[number];


interface Props {
  conversationId: string;
  onReply: (message: Message) => void;
}

export function MessageList({
  conversationId,
  onReply

}: Props) {
  const messages = useMessages(
    conversationId as Id<"conversations">
  );

  const initialScrollDone = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const firstUnreadRef = useRef<HTMLDivElement>(null);


  const messageIndexMap = useMemo(() => {
    const map = new Map<
      Id<"messages">,
      number
    >();

    messages?.forEach((message, index) => {
      map.set(message._id, index);
    });

    return map;
  }, [messages]);




  const markAsRead = useMarkAsRead();
  const me = useMe();
  const reads = useConversationReads(
    conversationId as Id<"conversations">
  );
  const latestMessage =
    messages && messages.length > 0
      ? messages[messages.length - 1]
      : null;

  const lastReadMessageId = useMemo(() => {
    const myRead = reads?.find(
      (read) => read.userId === me?.id
    );

    return myRead?.lastReadMessageId;
  }, [reads, me]);


  const firstUnreadMessage = useMemo(() => {
    if (!messages || !lastReadMessageId) {
      return null;
    }

    const lastReadIndex = messages.findIndex(
      (message) => message._id === lastReadMessageId
    );

    if (lastReadIndex === -1) {
      return null;
    }

    return messages[lastReadIndex + 1] ?? null;
  }, [messages, lastReadMessageId]);



  const messageRefs = useRef(
    new Map<
      Id<"messages">,
      HTMLDivElement
    >()
  );

  const scrollToMessage = useCallback(
    (messageId: Id<"messages">) => {
      const element = messageRefs.current.get(messageId);

      if (!element) return;

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.classList.add("message-highlight");

      setTimeout(() => {
        element.classList.remove("message-highlight");
      }, 2000);
    },
    []
  );

  useEffect(() => {
    if (initialScrollDone.current) {
      return;
    }

    if (!messages?.length) {
      return;
    }

    requestAnimationFrame(() => {
      if (firstUnreadRef.current) {
        firstUnreadRef.current.scrollIntoView({
          behavior: "auto",
          block: "center",
        });
      } else {
        const container = document.querySelector(
          ".overflow-y-auto"
        );

        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }

      initialScrollDone.current = true;
    });
    if (latestMessage && me && latestMessage.senderId !== me.id) {
      markAsRead({
        conversationId: conversationId as Id<"conversations">,
        messageId: latestMessage._id,
      }).catch(console.error);
    }
  }, [messages, firstUnreadMessage]);

  // useEffect(() => {
  //   console.log(messageRefs.current);
  // }, [messages]);


  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({
  //     behavior: "smooth",
  //   });
  // }, [latestMessage?._id]);


  const previousMessageId = useRef<Id<"messages"> | null>(null);

useEffect(() => {
  if (!initialScrollDone.current) return;
  if (!latestMessage) return;

  // Ignore first render
  if (previousMessageId.current === null) {
    previousMessageId.current = latestMessage._id;
    return;
  }

 
  if (previousMessageId.current === latestMessage._id) {
    return;
  }

  previousMessageId.current = latestMessage._id;

  
  if (latestMessage.senderId === me?.id) {
    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }
}, [latestMessage, me]);


  useEffect(() => {
    if (!initialScrollDone.current) {
      return;
    }

    if (!latestMessage || !me) {
      return;
    }

    if (latestMessage.senderId === me.id) {
      return;
    }

    markAsRead({
      conversationId: conversationId as Id<"conversations">,
      messageId: latestMessage._id,
    }).catch(console.error);

  }, [
    latestMessage?._id,
    me?.id,
    conversationId,
    markAsRead,
  ]);

  const readMap = useMemo(
    () => createReadMap(reads ?? []),
    [reads]
  );


  const readContext = {
    readMap,
    messageIndexMap,
  };

  const readStatusMap = useMemo(() => {
    if (!messages || !me) {
      return new Map();
    }

    const map = new Map();

    for (const message of messages) {
      map.set(
        message._id,
        getReadStatus({
          senderId: message.senderId,
          currentUserId: me.id,
          messageId: message._id,
          readMap,
          messageIndexMap,
        })
      );
    }

    return map;
  }, [
    messages,
    me,
    readMap,
    messageIndexMap,
  ]);

  if (!messages) {
    return (
      <div className="flex-1 p-4">
        Loading...
      </div>
    );
  }



  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4"
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message._id}
          ref={
            firstUnreadMessage?._id === message._id
              ? firstUnreadRef
              : null
          }
          message={message}
          previousMessage={messages[index - 1]}
          nextMessage={messages[index + 1]}
          onReply={onReply}
          onJumpToMessage={scrollToMessage}
          readStatus={readStatusMap.get(message._id)}
        />
      ))}
      
    </div>
  );
}