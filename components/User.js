import { follow, unfollow } from "@/lib/actions";
import { useState } from "react";

export default function User({ user, following, currentUser }) {
  const [followingHover, setFollowingHover] = useState(false);
  const [isFollowing, setIsFollowing] = useState(following);

  async function handleFollow() {
    if (isFollowing == true) {
      const data = await unfollow(user.handle);

      if (data.success == true) {
        setIsFollowing(false);
      }
    } else {
      const data = await follow(user.handle);

      if (data.success == true) {
        setIsFollowing(true);
      }
    }
  }

  return (
    <div className="flex px-4 py-4 pb-3 gap-3 hover:bg-white/5">
      <img
        src={user.profile_picture_url.replace(`"`, "").replace(",", "")}
        alt="profile pic"
        className="w-12 h-12 rounded-full"
      />
      <div className="flex w-full">
        <div className="flex-grow">
          <p className="font-bold leading-5">{user.username}</p>
          <p className="text-secondary">@{user.handle}</p>
        </div>
        {currentUser.handle == user.handle ? (
          <></>
        ) : isFollowing == true ? (
          <button
            onMouseEnter={() => setFollowingHover(true)}
            onMouseLeave={() => setFollowingHover(false)}
            onClick={handleFollow}
            className="font-bold h-[32px] hover:text-red-600 hover:bg-red-700/20 hover:border-red-600/40 my-1 px-4 rounded-full border border-secondary"
          >
            {followingHover == true ? (
              <span>Unfollow</span>
            ) : (
              <span>Following</span>
            )}
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="bg-white text-black font-bold my-1 px-4 rounded-full h-[32px]"
          >
            Follow
          </button>
        )}
      </div>
      <p className="text-gray-200">{user.bio}</p>
    </div>
  );
}
