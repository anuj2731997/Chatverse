import { Chat } from "@/features/messages/Chat";

interface Props {
  params: Promise<{
    conversationId: string;
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