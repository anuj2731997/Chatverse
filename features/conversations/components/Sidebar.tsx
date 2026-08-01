
"use client";

import { SidebarHeader } from "./SidebarHeader";
import { ConversationList } from "./ConversationList";
import { SidebarFooter } from "./SidebarFooter";

export function Sidebar() {
  
  return (
    <aside className="flex h-full w-80 flex-col border-r bg-background">
      <SidebarHeader />

      <div className="flex-1 overflow-hidden">
        <ConversationList />
      </div>

      <SidebarFooter />
    </aside>
  );
}