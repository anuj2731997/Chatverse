import { Id } from "../_generated/dataModel";

/**
 * Generates a stable key for direct messages.
 * Always sorts IDs so:
 * A+B == B+A
 */
export function generateConversationKey(
  userA: Id<"users">,
  userB: Id<"users">
) {
  return [userA, userB].sort().join("_");
}