import { follow, unfollow } from "@/lib/actions";
import Link from "next/link";
import Checkmark from "./Icons/Checkmark";
import { useState } from "react";
import { isMobile } from "react-device-detect";

export default function User({ user, following, currentUser, notLoggedIn }) {
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
    <Link href={`/user/${user.handle}`}>
      <div className="flex px-4 py-4 pb-3 gap-3 hover:bg-white/5">
        <img
          src={user.profile_picture_url.replace(`"`, "").replace(",", "")}
          alt="profile pic"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex w-full flex-col">
          <div className="flex">
            <div className="flex-grow">
              <div className="flex gap-1 items-center">
                <p
                  className={
                    isMobile
                      ? "font-bold max-w-[120px] truncate leading-5"
                      : "font-bold truncate leading-5"
                  }
                >
                  {user.username}
                </p>
                {user.verifiedCheckmark ? (
                  <Checkmark className="w-[17px] h-[17px] self-center mt-[3px]" />
                ) : (
                  <></>
                )}
              </div>
              <p
                className={
                  isMobile
                    ? "text-secondary max-w-[120px] truncate"
                    : "text-secondary truncate"
                }
              >
                @{user.handle}
              </p>
            </div>
            {notLoggedIn || currentUser.handle == user.handle ? (
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
      </div>
    </Link>
  );
}
