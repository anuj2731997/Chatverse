"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

import { useGroup } from "../hooks/useGroup";
import { useSearchUsers } from "@/features/users/hooks/useSearchUsers";
import { useAddMembers } from "../hooks/useAddMembers";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserSearch } from "@/features/conversations/components/UserSearch";
import {MemberSelector} from "./MemberSelector"

interface Props {
    conversationId: Id<"conversations">;
}

export function AddMembersDialog({
    conversationId,
}: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
    const group = useGroup(conversationId);

    const users = useSearchUsers(search);

    const addMembers = useAddMembers();
    const existingMemberIds = new Set(
        group?.members.map(member => member._id) ?? []
    );
    const availableUsers =
        users?.filter(
            user => !existingMemberIds.has(user._id)
        ) ?? [];


    const toggleUser = (userId: Id<"users">) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };



const handleAdd = async () => {
  if (!selectedUsers.length) {
    toast.error("Please select at least one user.");
    return;
  }

  try {
    await addMembers({
      conversationId,
      userIds: selectedUsers,
    });

    toast.success(
      `${selectedUsers.length} member${
        selectedUsers.length > 1 ? "s" : ""
      } added successfully.`
    );

    setSelectedUsers([]);
    setSearch("");
    setOpen(false);
  } catch (error) {
    let message = "Failed to add members.";

    if (error instanceof Error) {
      // Extract only the server error message
      const match = error.message.match(/Uncaught Error:\s*(.*)/);
      message = match?.[1] ?? error.message;
    }

    toast.error(message);
  }
};
    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger render={<Button>Add Members</Button>} />

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Members</DialogTitle>
    </DialogHeader>

    <UserSearch
      value={search}
      onChange={setSearch}
    />

    <MemberSelector
  users={availableUsers}
  selected={selectedUsers}
  onToggle={toggleUser}
/>

    <Button onClick={handleAdd}>
      Add ({selectedUsers.length})
    </Button>
  </DialogContent>
</Dialog>
</>
    )
}