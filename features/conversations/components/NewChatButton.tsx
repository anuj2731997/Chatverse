"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NewChatDialog } from "./NewChatDialog";

export function NewChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        className="
          w-full
          h-10
          justify-center
          gap-2
          rounded-lg
          font-medium
          transition-all
          duration-200
          hover:shadow-sm
          active:scale-[0.98]
        "
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 shrink-0" />
        <span>New Chat</span>
      </Button>

      <NewChatDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}