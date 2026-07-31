import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/users";
export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();
if (existing) {
  await ctx.db.patch(existing._id, {
    name: args.name,
    email: args.email,
    image: args.image,
  });

  return existing._id;
}


    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: args.name,
      email: args.email,
      image: args.image,
    });
  },
});

export const current = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();
  },
});


export const searchUsers = query({
  args: {
    search: v.string(),
  },

  handler: async (ctx, args) => {
    const me = await getCurrentUser(ctx);
   if(!me) {
    return [];
}
    const search = args.search.trim();

    if (!search) {
      const users = await ctx.db.query("users").take(20);

      return users.filter(
        (user) => user._id !== me._id
      );
    }

    const byName = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) =>
        q.search("name", search)
      )
      .take(20);

    const byEmail = await ctx.db
      .query("users")
      .withSearchIndex("search_email", (q) =>
        q.search("email", search)
      )
      .take(20);

    const uniqueUsers = new Map();

    [...byName, ...byEmail].forEach((user) => {
      if (user._id !== me._id) {
        uniqueUsers.set(user._id, user);
      }
    });

    return [...uniqueUsers.values()];
  },
});



export const list = query({
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);

  if (!currentUser) {
  return [];
}
    const users = await ctx.db.query("users").collect();

    return users.filter(
      (user) => user._id !== currentUser._id
    );
  },
});


export const me = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return null;
    }

    return {
      id: user._id,
    };
  },
});