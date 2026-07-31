"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Loader2 } from "lucide-react";
interface UserResultProps {
  user: {
    _id: string;
    name?: string;
    image?: string;
    email?: string;

  };
  loading?: boolean;


  onClick: () => void;
}

export function UserResult({
  user,
  loading,
  onClick,
}: UserResultProps) {


  
  return (
<>
    {loading && (
  <Loader2 className="h-4 w-4 animate-spin" />
)}

    <button
      onClick={onClick}
        disabled={loading}

      className="flex w-full items-center gap-3 rounded-lg p-3 transition hover:bg-accent"
    >
      <Avatar>
        <AvatarImage src={user.image} />
        <AvatarFallback>
          {user.name?.charAt(0) ?? "U"}
        </AvatarFallback>
      </Avatar>

      <div className="text-left">
        <p className="font-medium">
          {user.name}
        </p>

        <p className="text-sm text-muted-foreground">
          {user.email}
        </p>
      </div>
    </button>
    </>
  );
}