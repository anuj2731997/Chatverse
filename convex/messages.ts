
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/users";

export const send = mutation({

  args: {
    conversationId: v.id("conversations"),
    body: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    replyTo: v.optional(v.id("messages")),
  },


  handler: async (ctx, args) => {


    //     const identity = await ctx.auth.getUserIdentity();

    // if (!identity)
    //     throw new Error("Unauthorized");

    // const me = await ctx.db
    // .query("users")
    // .withIndex("by_clerk_id",q=>

    //     q.eq("clerkId",identity.subject)

    // )
    // .unique();

    // if(!me)
    //     throw new Error("User not found");


    if (!args.body && !args.image) {
      throw new Error("Message cannot be empty.");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("User not synced yet");
    }

    const now = Date.now();


    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: user._id,
      body: args.body ?? "",
      image: args.image,
      replyTo: args.replyTo,
      edited: false,
      deleted: false,
      createdAt: now,
    });


    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
    });
    const members = await ctx.db
      .query("members")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    await Promise.all(
      members.map(async (member) => {
        if (member.hiddenAt !== undefined) {
          await ctx.db.patch(member._id, {
            hiddenAt: undefined,
          });
        }
      })
    );


  }

});

export const list = query({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex(
        "by_conversation",
        (q) =>
          q.eq(
            "conversationId",
            args.conversationId
          )
      )
      .order("asc")
      .collect();




    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);

        const imageUrl = message.image
          ? await ctx.storage.getUrl(message.image)
          : undefined;

        const repliedMessage = message.replyTo
          ? await ctx.db.get(message.replyTo)
          : null;
        const repliedSender = repliedMessage
          ? await ctx.db.get(repliedMessage.senderId)
          : null;


        return {
          ...message,

          image: imageUrl,

          senderName: sender?.name ?? "Unknown",

          senderImage: sender?.image ?? "",

          reply: repliedMessage
            ? {
              id: repliedMessage._id,
              body: repliedMessage.body,
              senderId: repliedMessage.senderId,
              senderName: repliedSender?.name ?? "Unknown",
            }
            : null,
        };
      })
    );

    return enrichedMessages;

  },
});


export const edit = mutation({
  args: {
    messageId: v.id("messages"),
    body: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== user._id) {
      throw new Error("You can only edit your own messages.");
    }

    if (message.deleted) {
      throw new Error("Cannot edit a deleted message.");
    }

    const body = args.body.trim();

    if (!body) {
      throw new Error("Message cannot be empty.");
    }

    await ctx.db.patch(args.messageId, {
      body,
      edited: true,
    });
  },
});

export const remove = mutation({
  args: {
    messageId: v.id("messages"),
  },

  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== user._id) {
      throw new Error("You can only delete your own messages.");
    }

    if (message.deleted) {
      return;
    }

    await ctx.db.patch(args.messageId, {
      deleted: true,
      body: "",
      image: undefined,
    });
  },
});