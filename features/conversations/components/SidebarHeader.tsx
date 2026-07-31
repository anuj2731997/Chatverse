"use client";

import { NewChatButton } from "./NewChatButton";
import { CreateGroupDialog } from "@/features/groups/components/CreateGroupDialog";

export function SidebarHeader() {
  return (
    <header className="border-b px-4 py-5">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            ChatVerse
          </h1>
          <p className="text-sm text-muted-foreground">
            Start a new conversation
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <NewChatButton />
          </div>

          <CreateGroupDialog />
        </div>
      </div>
    </header>
  );
}