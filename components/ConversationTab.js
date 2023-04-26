import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConversationTabComponent from "./ConversationTabComponent";

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
    <div className="w-[388px] flex flex-col min-h-screen border-r border-gray-700/75">
      <div className="flex flex-col gap-4">
        <div className="px-4 py-2">
          <p className="text-lg font-bold">Messages</p>
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
