import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/users";
import { generateConversationKey } from "./lib/conversation";
import { ConvexError } from "convex/values";

export const create = mutation({
  args: {
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    members: v.array(v.id("users")),
  },

  handler: async (ctx, args) => {

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("User not synced yet");
    }

    const conversationId = await ctx.db.insert(
      "conversations",
      {
        name: args.name,
        isGroup: args.isGroup,
        createdBy: user._id,
        lastMessageAt: Date.now(),
      }
    );

    const allMembers = [
      user._id,
      ...args.members,
    ];



    await Promise.all(
      allMembers.map((memberId) =>
        ctx.db.insert("members", {
          conversationId,
          userId: memberId,
          role: memberId === user._id ? "admin" : "member",
          joinedAt: Date.now(),
        })
      )
    );



    return conversationId;




  },
});

export const list = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) return [];

    const memberships = (
      await ctx.db
        .query("members")
        .withIndex("by_user", (q) =>
          q.eq("userId", user._id)
        )
        .collect()
    ).filter(
      (member) => member.hiddenAt === undefined
    );

    const conversations = await Promise.all(
      memberships.map((member) =>
        ctx.db.get(member.conversationId)
      )
    );

    const validConversations = conversations.filter(
      (
        conversation
      ): conversation is NonNullable<typeof conversation> =>
        conversation !== null
    );

    validConversations.sort(
      (a, b) => b.lastMessageAt - a.lastMessageAt
    );

    return await Promise.all(
      validConversations.map(async (conversation) => {
        const latestMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .order("desc")
          .first();

        const read = await ctx.db
          .query("conversationReads")
          .withIndex("by_user_conversation", (q) =>
            q
              .eq("userId", user._id)
              .eq("conversationId", conversation._id)
          )
          .unique();


        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation_createdAt", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .collect();

        let unreadCount = 0;

        if (!read) {
          unreadCount = messages.filter(
            (message) => message.senderId !== user._id
          ).length;
        } else {
          unreadCount = messages.filter(
            (message) =>
              message.senderId !== user._id &&
              message.createdAt > read.readAt
          ).length;
        }



        let lastMessage = null;

        if (latestMessage) {
          const sender = await ctx.db.get(latestMessage.senderId);

          lastMessage = {
            body: latestMessage.body,
            senderId: latestMessage.senderId,
            senderName: sender?.name ?? "Unknown",
            image: !!latestMessage.image,
            deleted: latestMessage.deleted,
            createdAt: latestMessage.createdAt,
          };
        }

        const members = await ctx.db
          .query("members")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .collect();

        if (conversation.isGroup) {
          return {
            id: conversation._id,
            title: conversation.name ?? "Unnamed Group",
            image: conversation.image,
            isGroup: true,
            memberCount: members.length,
            lastMessage: lastMessage,
            lastMessageTime:
              latestMessage?.createdAt ??
              conversation.lastMessageAt,
            unreadCount,
          };
        }

        const otherMember = members.find(
          (member) => member.userId !== user._id
        );

        const otherUser = otherMember
          ? await ctx.db.get(otherMember.userId)
          : null;

        return {
          id: conversation._id,
          title: otherUser?.name ?? "Unknown",
          image: otherUser?.image,
          isGroup: false,
          memberCount: 2,
          lastMessage: lastMessage,
          lastMessageTime:
            latestMessage?.createdAt ??
            conversation.lastMessageAt,
          unreadCount,
        };
      })
    );
  },
});


export const getOrCreate = mutation({
  args: {
    otherUserId: v.id("users"),
  },

  handler: async (ctx, args) => {


    const me = await getCurrentUser(ctx);

    if (!me)
      throw new Error("User not synced yet");

    if (me._id === args.otherUserId) {
      throw new Error("You cannot chat with yourself.");
    }

    const key = generateConversationKey(
      me._id,
      args.otherUserId
    );

    const existing = await ctx.db
      .query("conversations")
      .withIndex(
        "by_conversation_key",
        q => q.eq("conversationKey", key)
      )
      .unique();

    if (existing) {
      const membership = await ctx.db
        .query("members")
        .withIndex("by_user_conversation", (q) =>
          q
            .eq("userId", me._id)
            .eq("conversationId", existing._id)
        )
        .unique();

      if (membership?.hiddenAt !== undefined) {
        await ctx.db.patch(membership._id, {
          hiddenAt: undefined,
        });
      }

      return existing._id;
    }
    const conversationId = await ctx.db.insert(
      "conversations",
      {
        isGroup: false,

        conversationKey: key,

        createdBy: me._id,

        lastMessageAt: Date.now(),
      }
    );




    await ctx.db.insert("members", {
      conversationId,
      userId: me._id,
      role: "admin",
      joinedAt: Date.now(),
    });

    await ctx.db.insert("members", {
      conversationId,
      userId: args.otherUserId,
      role: "member",
      joinedAt: Date.now(),
    });
    return conversationId;

  }
})

export const getById = query({
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

    if (!conversation) {
      throw new Error("Conversation not found");
    }


    const members = await ctx.db
      .query("members")
      .withIndex(
        "by_conversation",
        q => q.eq(
          "conversationId",
          conversation._id
        )
      )
      .collect();

    if (conversation.isGroup) {
      const memberDetails = await Promise.all(
        members.map(async (member) => {
          const user = await ctx.db.get(member.userId);

          return {
            _id: member.userId,
            role: member.role,
            name: user?.name ?? "Unknown",
            image: user?.image,
          };
        })
      );

      return {
        id: conversation._id,

        title: conversation.name ?? "Unnamed Group",

        image: conversation.image,

        isGroup: true,

        memberCount: memberDetails.length,

        members: memberDetails,

        createdBy: conversation.createdBy,
      };
    }

    const otherMember = members.find(
      member => member.userId !== currentUser._id
    );

    if (!otherMember) {
      throw new Error("Member not found");
    }

    const otherUser = await ctx.db.get(
      otherMember.userId
    );

    if (!otherUser) {
      throw new Error("User not found");
    }

    return {
      id: conversation._id,

      title: otherUser.name,

      image: otherUser.image,

      isGroup: conversation.isGroup,

      otherUser: {
        _id: otherUser._id,
        name: otherUser.name,
        image: otherUser.image,
        email: otherUser.email,
      },
    };
  },
});


export const hideConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const me = await getCurrentUser(ctx);

    if (!me) {
      throw new ConvexError("Unauthorized");
    }
    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    if (conversation.isGroup) {
      throw new ConvexError(
        "Groups cannot be hidden using this action."
      );
    }
    const membership = await ctx.db
      .query("members")
      .withIndex("by_user_conversation", (q) =>
        q
          .eq("userId", me._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("Conversation not found");
    }

    await ctx.db.patch(membership._id, {
      hiddenAt: Date.now(),
    });
  },
});