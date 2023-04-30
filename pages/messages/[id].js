import MobileBottomBar from "@/components/MobileBottomBar";
import { useState, useEffect, useRef } from "react";
import { MobileView, isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Message from "@/components/Message";
import Send from "@/components/Icons/Send";
import Link from "next/link";

const backendURL = `http://localhost:3000`;

export async function getServerSideProps(context) {
  return {
    props: {
      conversationId: context.params.id,
    },
  };
}

export default function Conversation({ conversationId }) {
  if (isMobile) {
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState({});
    const [otherUserProfilePic, setOtherUserProfilePic] = useState("");
    const [messagePages, setMessagePages] = useState({});
    const [fetched, setFetched] = useState(false);
    const [messageContent, setMessageContent] = useState("");

    const { userInfo } = useSelector((state) => state.auth);

    const textRef = useRef();

    useEffect(() => {
      getMessages();
      getUser();

      const socket = io(backendURL);

      socket.emit("join", conversationId);

      socket.on("new-message", (data) => {
        console.log("New messsage", data);

        setMessages((array) => [data, ...array]);
      });
    }, [conversationId]);

    useEffect(() => {
      if (otherUser && messages) {
        setFetched(true);
      }
    }, [otherUser, messages]);

    async function getUser() {
      const token = localStorage.getItem("token");

      const data = await fetch(
        `${backendURL}/api/conversation/${conversationId}/details`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());

      setOtherUser(data.conversation.user);
      setOtherUserProfilePic(
        data.conversation.user.profile_picture_url.replace(`"`, "")
      );
    }

    async function getMessages() {
      const token = localStorage.getItem("token");

      const data = await fetch(
        `${backendURL}/api/conversation/${conversationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());

      setMessages(data.messages.docs);
      setMessagePages(data.messages);
    }

    async function sendMessage() {
      if (messageContent != "") {
        const token = localStorage.getItem("token");

        const data = await fetch(
          `${backendURL}/api/conversation/${conversationId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message: messageContent }),
          }
        ).then((res) => res.json());

        if (data.success) {
          setMessageContent("");
        }
      }
    }

    return (
      <MobileView className="bg-black flex flex-col min-h-screen text-gray-200">
        <div className="flex-grow flex flex-col max-h-screen">
          {fetched ? (
            <div
              style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
              className="flex items-center sticky top-0 z-[999]"
            >
              <Link href="/messages" className="flex">
                <div className="flex ml-2 px-2 py-2 rounded-full hover:bg-stone-900">
                  <img
                    src="/arrow-left.svg"
                    alt="back"
                    className="self-center w-6 h-6"
                  />
                </div>
              </Link>
              <div className="flex items-center gap-2 px-4 py-2">
                <img
                  src={otherUserProfilePic}
                  alt=""
                  className="w-[32p] h-[32px] rounded-full"
                />
                <p className="font-bold">{otherUser?.username}</p>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="flex overflow-auto flex-col-reverse py-2 px-4 gap-[5px] justify-items-bottom flex-grow">
            {fetched ? (
              messages.map((message, i) => (
                <Message
                  key={i}
                  index={i}
                  message={message}
                  messages={messages}
                  userInfo={userInfo}
                  conversationId={conversationId}
                />
              ))
            ) : (
              <></>
            )}
          </div>
          <div className="px-4 pb-[4.5px] pt-2 border-t border-gray-700/75">
            <div className="flex w-full w-[44] gap-4 bg-[#202327] px-3 py-2 mb-1 rounded-xl">
              <textarea
                type="text"
                name=""
                id=""
                placeholder="Start a new message"
                style={{ height: "25px", maxHeight: "75px" }}
                ref={textRef}
                onInput={() => {
                  textRef.current.style.height = "25px";
                  textRef.current.style.height =
                    textRef.current.scrollHeight + "px";
                }}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="outline-none bg-inherit overflow-none resize-none w-full placeholder:text-[#71767B]"
              />
              <Send
                className="w-6 h-6"
                fillColor="#1d9bf0"
                messageContent={messageContent}
                sendFunc={sendMessage}
              />
            </div>
          </div>
        </div>
      </MobileView>
    );
  } else {
    return <p>a</p>;
  }
}
