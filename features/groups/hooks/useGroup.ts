import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";


export function useGroup(
    conversationId: Id<"conversations">
){
    return useQuery(
        api.groups.getGroup,
        {
            conversationId
        }
    );
}