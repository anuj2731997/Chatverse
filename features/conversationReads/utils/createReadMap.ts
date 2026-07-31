import { Id } from "@/convex/_generated/dataModel";

interface ConversationRead {
  userId: Id<"users">;
  lastReadMessageId: Id<"messages">;
}

export function createReadMap(
  reads: ConversationRead[] = []
) {
  return new Map(
    reads.map((read) => [
      read.userId,
      read.lastReadMessageId,
    ])
  );
}