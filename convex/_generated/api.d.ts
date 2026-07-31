/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as conversationReads from "../conversationReads.js";
import type * as conversations from "../conversations.js";
import type * as groups from "../groups.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_conversation from "../lib/conversation.js";
import type * as lib_conversations from "../lib/conversations.js";
import type * as lib_users from "../lib/users.js";
import type * as messages from "../messages.js";
import type * as presence from "../presence.js";
import type * as reactions from "../reactions.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  conversationReads: typeof conversationReads;
  conversations: typeof conversations;
  groups: typeof groups;
  "lib/auth": typeof lib_auth;
  "lib/conversation": typeof lib_conversation;
  "lib/conversations": typeof lib_conversations;
  "lib/users": typeof lib_users;
  messages: typeof messages;
  presence: typeof presence;
  reactions: typeof reactions;
  storage: typeof storage;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
