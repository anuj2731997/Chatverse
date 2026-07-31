import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export async function deleteConversation(
  ctx: MutationCtx,
  conversationId: Id<"conversations">
) {
  // Delete reactions first
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_conversation", (q) =>
      q.eq("conversationId", conversationId)
    )
    .collect();

  for (const message of messages) {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_message", (q) =>
        q.eq("messageId", message._id)
      )
      .collect();

    await Promise.all(
      reactions.map((reaction) =>
        ctx.db.delete(reaction._id)
      )
    );
  }

  // Delete messages
  await Promise.all(
    messages.map((message) =>
      ctx.db.delete(message._id)
    )
  );

  // Delete presence
  const presences = await ctx.db
    .query("presence")
    .withIndex("by_conversation", (q) =>
      q.eq("conversationId", conversationId)
    )
    .collect();

  await Promise.all(
    presences.map((presence) =>
      ctx.db.delete(presence._id)
    )
  );

  // Delete members
  const members = await ctx.db
    .query("members")
    .withIndex("by_conversation", (q) =>
      q.eq("conversationId", conversationId)
    )
    .collect();

  await Promise.all(
    members.map((member) =>
      ctx.db.delete(member._id)
    )
  );

  // Delete conversation
  await ctx.db.delete(conversationId);
}