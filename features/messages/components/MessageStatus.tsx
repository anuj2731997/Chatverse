

import { cn } from "@/lib/utils";
import { ReadStatus } from "@/features/conversationReads/utils/getReadStatus";

interface Props {
    readStatus: ReadStatus;
    isGroup: boolean;
    className?: string;
}
export function MessageStatus({
    readStatus,
    isGroup,
    className
}: Props) {
    if (isGroup) {
        if (readStatus.seenBy > 0) {
            return (
                <p className={cn("text-[11px]", className)}>
                    ✓ Seen by {readStatus.seenBy}{" "}
                    {readStatus.seenBy === 1
                        ? "person"
                        : "people"}
                </p>
            );
        }

        return (
            <p className="text-[11px] text-blue-100">
                ✓ Sent
            </p>
        );
    }

    return (
        <p className="text-[11px] text-blue-100">
            {readStatus.read
                ? "✓✓ Seen"
                : "✓ Sent"}
        </p>
    );
}