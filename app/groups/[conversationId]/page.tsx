import { Id } from "@/convex/_generated/dataModel";
import { GroupInfo } from "@/features/groups/components/GroupInfo";

interface Props {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function GroupPage({
  params,
}: Props) {
  const { conversationId } = await params;

  return (
    <GroupInfo
      conversationId={
        conversationId as Id<"conversations">
      }
    />
  );
}