import { getTweetLikes } from "@/lib/actions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import User from "./User";

export default function AllLikes({ close, tweetId }) {
  const [users, setUsers] = useState([]);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    async function getUsers() {
      const data = await getTweetLikes(tweetId);

      setUsers(data.likes);
    }

    getUsers();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[300]">
      <div
        style={{
          boxShadow: "0 0 0 50vmax rgba(91, 112, 131, 0.4)",
          transform: "translate(-50%, -50%)",
        }}
        className="w-[600px] max-h-[650px] h-full rounded-2xl absolute left-1/2 top-1/2 flex flex flex-col gap-1 bg-black text-white"
      >
        <div className="flex sticky top-[0.1px] backdrop-blur-xl rounded-t-2xl gap-5 pt-3 pb-1">
          <img
            onClick={close}
            src="/close.svg"
            className="pl-5 h-10 w-10 cursor-pointer"
            alt="close"
          ></img>
          <p className="pt-[6px] font-bold text-lg">Liked by</p>
        </div>
        <div className="flex flex-col h-full">
          {users.map((item) => {
            return (
              <User
                key={item._id}
                user={item.user}
                following={item.following}
                currentUser={userInfo}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
