import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./lib/users";

export const markAsRead = mutation({
    args: {
        conversationId: v.id("conversations"),
        messageId: v.id("messages"),
    },

    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx);

        if (!user) {
            throw new Error("Unauthorized");
        }

        const existing = await ctx.db
            .query("conversationReads")
            .withIndex("by_user_conversation", (q) =>
                q
                    .eq("userId", user._id)
                    .eq("conversationId", args.conversationId)
            )
            .unique();

        if (existing) {
            const previousMessage = await ctx.db.get(existing.lastReadMessageId);
            const currentMessage = await ctx.db.get(args.messageId);

            if (
                previousMessage &&
                currentMessage &&
                currentMessage.createdAt <= previousMessage.createdAt
            ) {
                return;
            }

            await ctx.db.patch(existing._id, {
                lastReadMessageId: args.messageId,
                readAt: Date.now(),
            });

            return;
        }
        await ctx.db.insert("conversationReads", {
            conversationId: args.conversationId,
            userId: user._id,
            lastReadMessageId: args.messageId,
            readAt: Date.now(),
        });
    },
});

export const getConversationReads = query({
    args: {
        conversationId: v.id("conversations"),
    },

    handler: async (ctx, args) => {
        return await ctx.db
            .query("conversationReads")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .collect();
    },
});