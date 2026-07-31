"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    
} from "@/components/ui/dialog";
import { UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { UserSearch } from "@/features/conversations/components/UserSearch";
import { MemberSelector } from "./MemberSelector";

import { useSearchUsers } from "@/features/users/hooks/useSearchUsers";
import { useCreateGroup } from "../hooks/useCreateGroup";

import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

export function CreateGroupDialog() {
    const [open, setOpen] = useState(false);

    const [groupName, setGroupName] = useState("");

    const [search, setSearch] = useState("");

    const [selectedMembers, setSelectedMembers] = useState<
        Id<"users">[]
    >([]);
    const router = useRouter();

    const users = useSearchUsers(search);

    const createGroup = useCreateGroup();

    const toggleMember = (id: Id<"users">) => {
        setSelectedMembers((current) =>
            current.includes(id)
                ? current.filter((memberId) => memberId !== id)
                : [...current, id]
        );
    };


const handleCreate = async () => {
  if (!groupName.trim()) return;

  if (selectedMembers.length === 0) return;

  const conversationId = await createGroup({
    name: groupName,
    isGroup: true,
    members: selectedMembers,
  });

  setOpen(false);

  setGroupName("");

  setSearch("");

  setSelectedMembers([]);

  router.push(`/chat/${conversationId}`);
};

return (
  <Dialog
    open={open}
    onOpenChange={setOpen}
  >
    {/* <DialogTrigger
      render={<Button>New Group</Button>}
    /> */}
    <DialogTrigger
    render = {
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
      >
        <UsersRound className="h-5 w-5" />
      </Button>
    }
    >
    <UsersRound className="h-5 w-5" />
</DialogTrigger>

    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          Create Group
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">

        <Input
          placeholder="Group name"
          value={groupName}
          onChange={(e) =>
            setGroupName(e.target.value)
          }
        />

        <UserSearch
          value={search}
          onChange={setSearch}
        />

        <MemberSelector
          users={users ?? []}
          selected={selectedMembers}
          onToggle={toggleMember}
        />

        <Button
          className="w-full"
          onClick={handleCreate}
          disabled={
            !groupName.trim() ||
            selectedMembers.length === 0
          }
        >
          Create Group
        </Button>

      </div>
    </DialogContent>
  </Dialog>
);


}