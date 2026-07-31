import { Id } from "@/convex/_generated/dataModel";

interface ReadStatusArgs {
    senderId: Id<"users">;
    currentUserId: Id<"users">;
    messageId: Id<"messages">;

    readMap: Map<
        Id<"users">,
        Id<"messages">
    >;

    messageIndexMap: Map<
        Id<"messages">,
        number
    >;
}

export interface ReadStatus {
    delivered: boolean;
    read: boolean;
    seenBy: number;
}

export function getReadStatus(
    args: ReadStatusArgs
): ReadStatus {
    const { currentUserId, messageId, messageIndexMap, readMap, senderId } = args;

    let seenBy = 0;
    if (senderId !== currentUserId) {
        return {
            delivered: false,
            read: false,
            seenBy: 0,
        };
    }



    const currentIndex = messageIndexMap.get(messageId);

    if (currentIndex === undefined) {
        return {
            delivered: true,
            read: false,
            seenBy: 0,
        };
    }
    for (const [userId, lastReadMessageId] of readMap) {

        if (userId === currentUserId) {
            continue;
        }
        const lastReadIndex =
            messageIndexMap.get(lastReadMessageId);

        if (lastReadIndex === undefined) {
            continue;
        }
        if (lastReadIndex >= currentIndex) {
            seenBy++;
        }



    }


    return {
        delivered: true,
        read: seenBy > 0,
        seenBy,
    };
}