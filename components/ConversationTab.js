import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConversationTabComponent from "./ConversationTabComponent";
import { isMobile } from "react-device-detect";

export default function ConversationTab({ setConv }) {
  const [conversations, setConversations] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

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
      ).then((res) => res.json());

      setConversations(data.conversations);
      console.log(data);
    }

    getConversations();
  }, []);

  return (
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
            <ConversationTabComponent key={i} conv={item} setConv={setConv} />
          ))}
        </div>
      </div>
    </div>
  );
}
