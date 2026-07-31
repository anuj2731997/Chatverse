import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/users";

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_user_message", (q:any) =>
        q
          .eq("userId", user._id)
          .eq("messageId", args.messageId)
      )
      .filter((q:any) =>
        q.eq(q.field("emoji"), args.emoji)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return;
    }

    await ctx.db.insert("reactions", {
      messageId: args.messageId,
      userId: user._id,
      emoji: args.emoji,
    });
  },
});