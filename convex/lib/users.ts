import { QueryCtx, MutationCtx } from "../_generated/server";
import { getIdentity } from "./auth";

type Ctx = QueryCtx | MutationCtx;

export async function getCurrentUser(ctx: Ctx) {
  const identity = await getIdentity(ctx);

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", q =>
      q.eq("clerkId", identity.subject)
    )
    .unique();

  return user;
}

export async function searchUsers(ctx: Ctx, args: { search: string }) {
    const me = await getCurrentUser(ctx);
    if (!me) {
    throw new Error("User not synced yet");
}
    const users = await ctx.db.query("users").collect();

    return users.filter(user =>
        user._id !== me._id &&
        user.name
            ?.toLowerCase()
            .includes(args.search.toLowerCase())
    );


}