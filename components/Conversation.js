import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Send from "./Icons/Send";
import Message from "./Message";

const backendURL = `http://localhost:3000`;

export default function Conversation({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [messagePages, setMessagePages] = useState({});
  const [fetched, setFetched] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (conversation?.exists) {
      getMessages();

      const socket = io(backendURL);

      socket.emit("join", conversation.id);

      socket.on("new-message", (data) => {
        console.log("New messsage", data);

        setMessages((array) => [data, ...array]);
      });
    }
  }, [conversation]);

  async function getMessages() {
    const token = localStorage.getItem("token");

    const data = await fetch(
      `${backendURL}/api/conversation/${conversation.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    setMessages(data.messages ? data.messages.docs : []);
    setMessagePages(data.messages);
    setFetched(true);
  }

  async function sendMessage() {
    if (messageContent != "") {
      console.log(messageContent);
      const token = localStorage.getItem("token");

      const data = await fetch(
        `${backendURL}/api/conversation/${conversation.id}`,
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

  const textRef = useRef(null);

  console.log(messages);

  return (
    <>
      {conversation ? (
        <div className="relative flex-grow flex flex-col max-w-[598px] max-h-screen border-r border-gray-700/75">
          <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
            className="flex gap-2 items-center sticky top-0 z-[999] px-4 py-3"
          >
            <img
              src={conversation?.user.profile_picture_url
                .replace(`"`, "")
                .replace(",", "")}
              alt=""
              className="w-[32p] h-[32px] rounded-full"
            />
            <p className="font-bold">{conversation?.user.username}</p>
          </div>
          <div className="flex overflow-auto flex-col-reverse py-2 px-4 gap-[5px] justify-items-bottom flex-grow">
            {fetched ? (
              messages.map((message, i) => (
                <Message
                  key={i}
                  index={i}
                  message={message}
                  messages={messages}
                  userInfo={userInfo}
                  conversationId={conversation.id}
                />
              ))
            ) : (
              <></>
            )}
          </div>
          <div className="px-4 pb-[4.5px] pt-2 border-t border-gray-700/75">
            <div className="flex w-full w-[44] gap-4 bg-[#202327] px-3 py-2 rounded-xl">
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
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    e.preventDefault();
                    if (messageContent != "") {
                      sendMessage();
                    }
                  }
                }}
                onChange={(e) => setMessageContent(e.target.value)}
                className="outline-none bg-inherit overflow-none resize-none w-full placeholder:text-[#71767B]"
              />
              <Send
                className="w-6 h-6"
                fillColor="#1d9bf0"
                messageContent={messageContent}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow justify-center items-center flex flex-col max-w-[598px] border-r border-gray-700/75">
          <div>
            <p className="text-2xl font-bold">Select a message</p>
            <p className="text-secondary">
              Choose from an existing conversation.
            </p>
          </div>
        </div>
      )}{" "}
    </>
  );
}
