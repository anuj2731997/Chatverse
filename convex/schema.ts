import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_name", ["name"])
    .index("by_email", ["email"])
    .searchIndex("search_name", {
      searchField: "name",
    })
    .searchIndex("search_email", {
      searchField: "email",
    }),

  conversations: defineTable({
    isGroup: v.boolean(),

    // Only present for direct messages
    conversationKey: v.optional(v.string()),

    name: v.optional(v.string()),
    image: v.optional(v.string()),

    createdBy: v.id("users"),
    lastMessageAt: v.number(),
  })
    .index("by_conversation_key", ["conversationKey"])
    .index("by_last_message", ["lastMessageAt"]),

  members: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),

    role: v.union(
      v.literal("admin"),
      v.literal("member")
    ),

    joinedAt: v.number(),

    hiddenAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"])
    .index("by_user_conversation", [
      "userId",
      "conversationId",
    ]),

  messages: defineTable({
    conversationId: v.id("conversations"),

    senderId: v.id("users"),

    body: v.string(),

    image: v.optional(v.id("_storage")),
    replyTo: v.optional(v.id("messages")), // 👈 new

    edited: v.boolean(),

    deleted: v.boolean(),

    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_createdAt", [
      "conversationId",
      "createdAt",
    ]),

  presence: defineTable({
    userId: v.id("users"),

    conversationId: v.id("conversations"),

    isTyping: v.boolean(),

    isOnline: v.boolean(),

    lastSeen: v.number(),

    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"]),

  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  })
    .index("by_message", ["messageId"])
    .index("by_user_message", ["userId", "messageId"]),


  conversationReads: defineTable({
    conversationId: v.id("conversations"),

    userId: v.id("users"),

    lastReadMessageId: v.id("messages"),

    readAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"])
    .index("by_user_conversation", [
      "userId",
      "conversationId",
    ]),



});


