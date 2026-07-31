import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/users";

export const heartbeat = mutation({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        conversationId: args.conversationId,
        isOnline: true,
        lastSeen: Date.now(),
        updatedAt: Date.now(),
      });

      return;
    }

    await ctx.db.insert("presence", {
      userId: user._id,
      conversationId: args.conversationId,
      isTyping: false,
      isOnline: true,
      lastSeen: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const markOffline = mutation({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) return;

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id)
      )
      .first();

    if (!presence) return;

    await ctx.db.patch(presence._id, {
      isOnline: false,
      isTyping: false,
      lastSeen: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getPresence = query({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      )
      .first();

    if (!presence) {
      return null;
    }

    const isOnline =
      Date.now() - presence.updatedAt < 35_000;

    return {
      ...presence,
      isOnline,
    };
  },
});

export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    isTyping: v.boolean(),
  },

  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id)
      )
      .first();

    if (!presence) {
      return;
    }

    await ctx.db.patch(presence._id, {
      conversationId: args.conversationId,
      isTyping: args.isTyping,
      updatedAt: Date.now(),
    });
  },
});

export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (!currentUser) return [];

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    const typingUsers = (
      await Promise.all(
        presence
          .filter(
            (p) =>
              p.isTyping &&
              p.userId !== currentUser._id
          )
          .map(async (p) => {
            const user = await ctx.db.get(p.userId);

            if (!user) {
              return null;
            }

            return {
              id: user._id,
              name: user.name,
              updatedAt: p.updatedAt,
            };
          })
      )
    ).filter(
      (user): user is {
        id: typeof currentUser._id;
        name: string;
        updatedAt: number;
      } => user !== null
    );

    return typingUsers.filter(Boolean);
  },
});