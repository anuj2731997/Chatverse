import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import NewChatButton from "./NewChatButton";
import ConversationList from "./ConversationList";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-80 flex-col border-r bg-white">
      <SidebarHeader />

      <div className="p-4">
        <SearchBar />
      </div>

      <div className="px-4 pb-4">
        <NewChatButton />
      </div>

      <ConversationList />
    </aside>
  );
}