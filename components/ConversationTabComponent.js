import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";

export default function ConversationTabComponent({
  setConv,
  conv,
  setActiveItem,
}) {
  const { userInfo } = useSelector((state) => state.auth);
  const [user, setUser] = useState({ profile_picture_url: "" });

  useEffect(() => {
    conv.users.map((user) => {
      if (user.handle != userInfo.handle) {
        setUser(user);
      }
    });
  }, []);

  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (!isMobile) {
          setConv({
            id: conv._id,
            user,
            exists: true,
          });
        } else {
          router.push(`/messages/${conv.latestMessage.conversation}`);
        }
        setActiveItem(conv._id);
      }}
      className={
        conv.active
          ? "flex p-4 gap-3 bg-gray-100/5 hover:bg-gray-100/10 cursor-pointer"
          : "flex p-4 gap-3 hover:bg-gray-200/5 cursor-pointer"
      }
    >
      <img
        src={user?.profile_picture_url.replace(`"`, "").replace(",", "")}
        className="w-[48px] h-[48px] rounded-full"
      ></img>
      <div className="flex flex-col">
        <p className="text-[15px]">
          <span className="font-bold">{user?.username} </span>
          <span className="text-secondary">@{user?.handle} · </span>
          <span className="text-secondary">
            {conv.latestMessage
              ? formatDistanceToNow(new Date(conv.latestMessage.timestamp), {
                  addSuffix: false,
                })
              : "-"}
          </span>
        </p>
        {conv.latestMessage ? (
          <p>
            {conv.latestMessage.message != "" ? (
              conv.latestMessage.message
            ) : (
              <span className="text-secondary">Message deleted</span>
            )}
          </p>
        ) : (
          <p className="text-secondary">No message yet</p>
        )}
      </div>
    </div>
  );
}
