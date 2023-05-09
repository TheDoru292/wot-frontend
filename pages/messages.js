import Conversation from "@/components/Conversation";
import Head from "next/head";
import LeftSidebar from "@/components/LeftSidebar";
import { useEffect, useState } from "react";
import { MobileView, BrowserView, isMobile } from "react-device-detect";
import MobileBottomBar from "@/components/MobileBottomBar";
import { useSelector } from "react-redux";
import ConversationTabComponent from "@/components/ConversationTabComponent";
import Notification from "@/components/Notification";

export default function Messages() {
  const [conversation, setConversation] = useState([]);
  const [conversations, setConversations] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getConversations() {
      const token = localStorage.getItem("token");

      const data = await fetch(
        `http://localhost:3000/api/user/${userInfo.handle}/conversation`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (res) => {
          const data = await res.json();

          setConversations(data.conversations);
        })
        .catch((err) => setError(true));
    }

    getConversations();
  }, []);

  function messageSent(message) {
    const array = conversations.map((item) => {
      if (item._id == message.conversation) {
        return {
          ...item,
          latestMessage: message,
        };
      } else {
        return item;
      }
    });

    setConversations(array);
  }

  function setActive(id) {
    const array = conversations.map((item) => {
      if (item._id == id) {
        return {
          ...item,
          active: true,
        };
      } else {
        return {
          ...item,
          active: false,
        };
      }
    });

    setConversations(array);
  }

  const tab = (
    <div
      className={
        !isMobile
          ? "w-[388px] flex flex-col min-h-screen border-r border-gray-700/75"
          : "flex flex-col min-h-screen w-full"
      }
    >
      <div className="flex flex-col gap-4">
        <div className="px-3 py-2 flex gap-2 items-center">
          {isMobile ? (
            <img
              src={userInfo.profile_picture_url
                .replace(`"`, "")
                .replace(",", "")}
              className="bg-red-400 w-[30px] h-[30px] rounded-full"
            />
          ) : (
            <></>
          )}
          <p className={!isMobile ? "text-lg font-bold" : "font-bold"}>
            Messages
          </p>
        </div>
        <div className="mx-4">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search Direct Messages"
            className="w-full h-10 bg-inherit text-[15px] placeholder:text-secondary border rounded-full text-center border-secondary/50"
          />
        </div>
        <div className="flex flex-col">
          {conversations.map((item, i) => (
            <ConversationTabComponent
              key={i}
              conv={item}
              setConv={setConversation}
              setActiveItem={setActive}
            />
          ))}
          {error ? (
            <Notification errorMessage="Failed to fetch conversations" />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );

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
              {tab}
              <Conversation
                conversation={conversation}
                messageSentFunc={messageSent}
              />
            </div>
          </main>
        </div>
      </BrowserView>
      <MobileView className="bg-black flex flex-col min-h-screen text-gray-200">
        <div className="flex flex-grow">{tab}</div>
        <MobileBottomBar></MobileBottomBar>
      </MobileView>
    </>
  );
}
