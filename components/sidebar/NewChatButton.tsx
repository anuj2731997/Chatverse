import Link from "next/link";

export default function NewChatButton() {
  return (
    <Link
      href="/chat/new"
      className="block rounded-lg bg-black py-3 text-center text-white transition hover:bg-gray-800"
    >
      + New Chat
    </Link>
  );
}