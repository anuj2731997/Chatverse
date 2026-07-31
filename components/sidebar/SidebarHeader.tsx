import { UserButton } from "@clerk/nextjs";

export default function SidebarHeader() {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <h1 className="text-2xl font-bold">
        ChatVerse
      </h1>

      <UserButton />
    </div>
  );
}