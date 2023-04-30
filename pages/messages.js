import Conversation from "@/components/Conversation";
import ConversationTab from "@/components/ConversationTab";
import Head from "next/head";
import LeftSidebar from "@/components/LeftSidebar";
import { useEffect, useState } from "react";
import { MobileView, BrowserView, isMobile } from "react-device-detect";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function Messages() {
  const [conversation, setConversation] = useState();

  return (
    <>
      <Head>
        <title>Messages</title>
      </Head>
      <BrowserView>
        <div className="bg-black flex min-h-screen text-gray-200">
          <LeftSidebar />
          <main className="flex flex-grow flex-col">
            <div className="flex">
              <ConversationTab setConv={setConversation} />
              <Conversation conversation={conversation} />
            </div>
          </main>
        </div>
      </BrowserView>
      <MobileView className="bg-black flex flex-col min-h-screen text-gray-200">
        <div className="flex flex-grow">
          <ConversationTab />
        </div>
        <MobileBottomBar></MobileBottomBar>
      </MobileView>
    </>
  );
}
