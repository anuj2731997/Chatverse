"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useTypingUsers } from "../hooks/useTypingUsers";

interface Props {
    conversationId: Id<"conversations">;
}

export function TypingIndicator({
    conversationId,
}: Props) {
    const users = useTypingUsers(conversationId);

    if (!users || users.length === 0) {
        return null;
    }

    return (
        <p className="text-sm text-muted-foreground italic">
            {users.length === 1
                ? `${users[0].name} is typing...`
                : users.length === 2
                    ? `${users[0].name} and ${users[1].name} are typing...`
                    : `${users.length} people are typing...`}
        </p>
    );
}