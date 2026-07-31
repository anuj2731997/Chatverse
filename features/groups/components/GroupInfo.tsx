"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Id } from "@/convex/_generated/dataModel";

import { useGroup } from "../hooks/useGroup";

import { GroupMember } from "./GroupMember";

import { useLeaveGroup } from "../hooks/useLeaveGroup";
import { useRouter } from "next/navigation";

import { EditGroupDialog } from "./EditGroupDialog";
import { AddMembersDialog } from "./AddMembersDialog";
import { DeleteGroupDialog } from "./DeleteGroupDialog";

interface Props {
    conversationId: Id<"conversations">;
}


export function GroupInfo({
    conversationId,
}: Props) {

    const leaveGroup = useLeaveGroup();

    const router = useRouter();
    const group = useGroup(conversationId);

    if (group === undefined) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading group...
            </div>
        );
    }

    if (group === null) {
        return (
            <div className="p-6">
                Group not found.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">

            {/* Header */}

            <div className="flex flex-col items-center gap-4">

                <Avatar className="h-24 w-24">
                    <AvatarImage src={group.image} />

                    <AvatarFallback>
                        👥
                    </AvatarFallback>
                </Avatar>

                <div className="text-center">
                    <h2 className="text-2xl font-bold">
                        {group.name}
                    </h2>

                    <p className="text-muted-foreground">
                        {group.memberCount} members
                    </p>
                </div>

            </div>

            {/* Members */}

            <div className="space-y-3">

                <h3 className="font-semibold">
                    Members
                </h3>

                {group.members.map((member) => (
                    <GroupMember
                        key={member._id}
                        member={member}
                        conversationId={conversationId}
                        currentUserId={group.currentUserId}
                        isCurrentUserAdmin={group.isCurrentUserAdmin}
                    />
                ))}

            </div>

            {/* Actions */}

            <div className="space-y-2">
                <div className="flex gap-2">
                <AddMembersDialog
                    conversationId={conversationId}
                />

                {group.isCurrentUserAdmin && (
                    <EditGroupDialog
                        conversationId={conversationId}
                    />
                )}
                </div>
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={async () => {
                        await leaveGroup({
                            conversationId,
                        });

                        router.push("/chat");
                    }}
                >
                    Leave Group
                </Button>
                {/* {group.isCurrentUserAdmin && (
                    <EditGroupDialog
                        conversationId={conversationId}
                    />
                )} */}

               <DeleteGroupDialog
  conversationId={conversationId}
/>

            </div>

        </div>
    );
}