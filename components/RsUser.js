import { useState } from "react";
import { follow, unfollow } from "@/lib/actions";
import Link from "next/link";

export default function RsUser({ user }) {
  const [following, setFollowing] = useState(user.following);
  const [followingHover, setFollowingHover] = useState(false);

  async function handleFollow() {
    const data = await follow(user.user.handle);

    if (data.success == true) {
      setFollowing(true);
    }
  }

  async function handleUnfollow() {
    const data = await unfollow(user.user.handle);

    if (data.success == true) {
      setFollowing(false);
    }
  }

  return (
    <Link href={`/user/${user.user.handle}`}>
      <div className="items-center gap-3 flex px-4 py-3 hover:bg-zinc-800/50">
        <img
          src={user.user.profile_picture_url.replace(`"`, "").replace(",", "")}
          className="w-12 h-12 bg-red-400 rounded-full"
          alt=""
        />
        <div className="flex-grow">
          <p>{user.user.username}</p>
          <p className="text-secondary">@{user.user.handle}</p>
        </div>
        {following == false ? (
          <button
            onClick={handleFollow}
            className="font-bold px-3 py-1 font-bold hover:bg-white/80 border bg-white rounded-full text-black"
          >
            Follow
          </button>
        ) : (
          <button
            onMouseEnter={() => setFollowingHover(true)}
            onMouseLeave={() => setFollowingHover(false)}
            onClick={handleUnfollow}
            className="font-bold hover:text-red-600 hover:bg-red-700/20 hover:border-red-600/40 h-9 px-4 rounded-full border border-secondary"
          >
            {followingHover == true ? (
              <span>Unfollow</span>
            ) : (
              <span>Following</span>
            )}
          </button>
        )}
      </div>
    </Link>
  );
}
