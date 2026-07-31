import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/users";
import { deleteConversation } from "./lib/conversations";

export const getGroup = query({
    args: {
        conversationId: v.id("conversations"),
    },

    handler: async (ctx, args) => {
        const currentUser = await getCurrentUser(ctx);

        if (!currentUser) {
            return null;
        }

        const conversation = await ctx.db.get(
            args.conversationId
        );

        if (!conversation || !conversation.isGroup) {
            return null;
        }

        const members = await ctx.db
            .query("members")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .collect();

        const memberDetails = await Promise.all(
            members.map(async (member) => {
                const user = await ctx.db.get(member.userId);

                const presence = await ctx.db
                    .query("presence")
                    .withIndex("by_user", (q) =>
                        q.eq("userId", member.userId)
                    )
                    .first();

                const isOnline =
                    !!presence &&
                    Date.now() - presence.updatedAt < 35_000;

                return {
                    _id: user!._id,
                    name: user!.name,
                    image: user!.image,
                    role: member.role,
                    isOnline,
                    lastSeen: presence?.lastSeen ?? 0,
                };
            })
        );

        const isCurrentUserAdmin = members.some(
            (member) =>
                member.userId === currentUser._id &&
                member.role === "admin"
        );

        return {
  id: conversation._id,
  name: conversation.name ?? "Unnamed Group",
  image: conversation.image,
  memberCount: memberDetails.length,
  members: memberDetails,

  isCurrentUserAdmin,

  currentUserId: currentUser._id,
};
    },
});


export const leaveGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || !conversation.isGroup) {
      throw new Error("Group not found");
    }

    const membership = await ctx.db
      .query("members")
      .withIndex("by_user", (q) =>
        q.eq("userId", currentUser._id)
      )
      .filter((q) =>
        q.eq(q.field("conversationId"), args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member");
    }

    // 👇 Get all group members
    const groupMembers = await ctx.db
      .query("members")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // 👇 Last member? Delete the entire conversation
    if (groupMembers.length === 1) {
      await deleteConversation(ctx, args.conversationId);
      return true;
    }

    // 👇 Admin leaving? Transfer admin
    if (membership.role === "admin") {
      const nextAdmin = groupMembers.find(
        (member) => member.userId !== currentUser._id
      );

      if (nextAdmin) {
        await ctx.db.patch(nextAdmin._id, {
          role: "admin",
        });
      }
    }

    // 👇 Remove current user
    await ctx.db.delete(membership._id);

    return true;
  },
});


export const addMembers = mutation({
  args: {
    conversationId: v.id("conversations"),
    userIds: v.array(v.id("users")),
  },

  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || !conversation.isGroup) {
      throw new Error("Group not found");
    }

    // Verify current user is an admin
    const currentMembership = await ctx.db
      .query("members")
      .withIndex("by_user", (q) =>
        q.eq("userId", currentUser._id)
      )
      .filter((q) =>
        q.eq(q.field("conversationId"), args.conversationId)
      )
      .unique();

    if (!currentMembership) {
      throw new Error("Not a member");
    }

    if (currentMembership.role !== "admin") {
      throw new Error("Only admins can add members");
    }

    // Existing members
    const existingMembers = await ctx.db
      .query("members")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    const existingUserIds = new Set(
      existingMembers.map((m) => m.userId)
    );

    // Insert only users who aren't already members
    for (const userId of args.userIds) {
      if (existingUserIds.has(userId)) {
        continue;
      }

     await ctx.db.insert("members", {
  conversationId: args.conversationId,
  userId,
  role: "member",
  joinedAt: Date.now(),
});

    }

    return true;
  },
});

export const removeMember = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || !conversation.isGroup) {
      throw new Error("Group not found");
    }

    // Current user's membership
    const currentMembership = await ctx.db
      .query("members")
      .withIndex("by_user", q =>
        q.eq("userId", currentUser._id)
      )
      .filter(q =>
        q.eq(
          q.field("conversationId"),
          args.conversationId
        )
      )
      .unique();

    if (!currentMembership) {
      throw new Error("Not a member");
    }

    if (currentMembership.role !== "admin") {
      throw new Error("Only admins can remove members");
    }

    // Target membership
    const targetMembership = await ctx.db
      .query("members")
      .withIndex("by_user", q =>
        q.eq("userId", args.userId)
      )
      .filter(q =>
        q.eq(
          q.field("conversationId"),
          args.conversationId
        )
      )
      .unique();

    if (!targetMembership) {
      throw new Error("User is not a member");
    }

    await ctx.db.delete(targetMembership._id);

    return true;
  },
});

export const updateGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
    name: v.string(),
    image: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || !conversation.isGroup) {
      throw new Error("Group not found");
    }

    const membership = await ctx.db
      .query("members")
      .withIndex("by_user", (q) =>
        q.eq("userId", currentUser._id)
      )
      .filter((q) =>
        q.eq(q.field("conversationId"), args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member");
    }

    if (membership.role !== "admin") {
      throw new Error(
        "Only admins can update the group"
      );
    }

    const name = args.name.trim();

    if (!name.length) {
      throw new Error("Group name is required");
    }

    if (name.length > 50) {
      throw new Error(
        "Group name must be less than 50 characters"
      );
    }

    await ctx.db.patch(args.conversationId, {
      name,
      image: args.image,
    });

    return true;
  },
});


export const deleteGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || !conversation.isGroup) {
      throw new Error("Group not found");
    }

    const membership = await ctx.db
      .query("members")
      .withIndex("by_user", (q) =>
        q.eq("userId", currentUser._id)
      )
      .filter((q) =>
        q.eq(q.field("conversationId"), args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a member");
    }

    if (membership.role !== "admin") {
      throw new Error("Only admins can delete the group");
    }

    await deleteConversation(ctx, args.conversationId);

    return true;
  },
});

