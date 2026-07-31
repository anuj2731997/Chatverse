
import  AuthSync  from "@/components/AuthSync";

import {Sidebar} from "@/features/conversations/components/Sidebar";
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
     <AuthSync />
     <Sidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}