"use client";

import { Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  name: string;
  email: string;
  image?: string;
}

interface Props {
  users: User[];
  selected: Id<"users">[];
  onToggle: (id: Id<"users">) => void;
}

export function MemberSelector({
  users,
  selected,
  onToggle,
}: Props) {
  return (
    <div className="space-y-2">
      {users.map((user) => {
        const isSelected = selected.includes(user._id);

        return (
          <button
            key={user._id}
            type="button"
            onClick={() => onToggle(user._id)}
            className="flex w-full items-center justify-between rounded-lg border p-3 transition hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.image} />
                <AvatarFallback>
                  {user.name.charAt(0)}
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
            </div>

            {isSelected && (
              <Check className="h-5 w-5 text-green-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}