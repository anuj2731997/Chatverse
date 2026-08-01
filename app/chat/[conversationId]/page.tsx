import { Chat } from "@/features/messages/Chat";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  params: Promise<{
    conversationId: Id<"conversations">;
  }>;
}

export default async function ConversationPage({
  params,
}: Props) {
  const { conversationId } = await params;

  return (
    <Chat
      conversationId={conversationId}
    />
  );
}