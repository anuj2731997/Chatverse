"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Trash2, Loader2 } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";

import { useDeleteGroup } from "../hooks/useDeleteGroup";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
interface Props {
  conversationId: Id<"conversations">;
}


export function DeleteGroupDialog({
  conversationId,
}: Props) {
  const router = useRouter();

  const deleteGroup = useDeleteGroup();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
  try {
    setLoading(true);

    await deleteGroup({
      conversationId,
    });

    toast.success("Group deleted.");

    router.push("/");

    setOpen(false);
  } catch (error) {
    console.error(error);

    toast.error("Failed to delete group.");
  } finally {
    setLoading(false);
  }
}

return (
  <Dialog
    open={open}
    onOpenChange={setOpen}
  >
    <DialogTrigger
      render={
        <Button
          variant="destructive"
          className="w-full"
        />
      }
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Group
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Delete Group
        </DialogTitle>
      </DialogHeader>

      <p className="text-sm text-muted-foreground">
        This action cannot be undone.
        All messages, members and
        reactions will be permanently
        deleted.
      </p>

      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          "Delete Group"
        )}
      </Button>
    </DialogContent>
  </Dialog>
);

}
