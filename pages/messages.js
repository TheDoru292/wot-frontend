import Conversation from "@/components/Conversation";
import ConversationTab from "@/components/ConversationTab";
import Head from "next/head";
import LeftSidebar from "@/components/LeftSidebar";
import { useState } from "react";

export default function Messages() {
  const [conversation, setConversation] = useState();

  return (
    <div className="bg-black flex min-h-screen text-gray-200">
      <Head>
        <title>Messages</title>
      </Head>
      <LeftSidebar />
      <main className="flex flex-grow flex-col">
        <div className="flex">
          <ConversationTab setConv={setConversation} />
          <Conversation conversation={conversation} />
        </div>
      </main>
    </div>
  );
}
