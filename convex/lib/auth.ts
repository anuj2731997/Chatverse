import { QueryCtx, MutationCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function getIdentity(ctx: Ctx) {
  return await ctx.auth.getUserIdentity();
}