// "use client";

// import { UserButton, useUser } from "@clerk/nextjs";

// export function SidebarFooter() {
//   const { user } = useUser();

//   return (
//     <div className="border-t p-4">
//       <div className="flex items-center gap-3">
//         <UserButton
//           appearance={{
//             elements: {
//               avatarBox: "h-10 w-10",
//             },
//           }}
//         />

//         <div className="min-w-0 flex-1">
//           <p className="truncate text-sm font-medium">
//             {user?.fullName}
//           </p>

//           <p className="truncate text-xs text-muted-foreground">
//             {user?.primaryEmailAddress?.emailAddress}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function SidebarFooter() {
  const { user } = useUser();

  return (
    <div className="border-t p-4 space-y-4">
      <div className="flex items-center gap-3">
        <UserButton />

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {user?.fullName}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      <SignOutButton>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:bg-muted">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}