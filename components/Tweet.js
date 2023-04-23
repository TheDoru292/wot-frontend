import { format, formatDistance } from "date-fns";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Like from "./Icons/Like";
import { useRouter } from "next/router";
import {
  bookmark,
  follow,
  like,
  removeBookmark,
  retweet,
  unfollow,
} from "@/lib/actions";
import Retweet from "./Icons/Retweet";
import Comment from "./Icons/Comment";
import { useSelector } from "react-redux";
import { deleteTweet } from "@/lib/actions";
import Checkmark from "./Icons/Checkmark";
import uniqid from "uniqid";

const backendURL = "http://localhost:3000";

export default function Tweet({
  tweet,
  rest,
  removeTweet,
  bar,
  reply = false,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [bookmarked, setBookmarked] = useState(rest.bookmarked || false);
  const [likes, setLikes] = useState(rest.likes);
  const [liked, setLiked] = useState(rest.liked || false);
  const [tweetContent, setTweetContent] = useState([]);
  const [retweets, setRetweets] = useState(rest.retweets || 0);
  const [retweeted, setRetweeted] = useState(rest.retweeted || false);
  const [openTweetMenu, setOpenTweetMenu] = useState(false);
  const [following, setFollowing] = useState(rest.following);

  const { userInfo } = useSelector((state) => state.auth);

  const dropdownMenu = useRef(null);
  const tweetMenu = useRef(null);
  const tweetRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    handleTweet();
  }, []);

  function handleTweet() {
    const tweetContent = tweet.content.split(" ");

    setTweetContent(
      tweetContent.map((item) => {
        if (item[0] == "#") {
          return { type: "hashtag", content: item };
        }

        return { content: item };
      })
    );
  }

  function closeOpenMenu(e) {
    if (
      dropdownMenu.current &&
      openMenu &&
      !dropdownMenu.current.contains(e.target)
    ) {
      setOpenMenu(false);
    }

    if (
      tweetMenu.current &&
      openTweetMenu &&
      !tweetMenu.current.contains(e.target)
    ) {
      setOpenTweetMenu(false);
    }

    if (tweetRef.current && tweetRef.current.contains(e.target)) {
      if (!reply) {
        router.push(`/user/${tweet.user.handle}/status/${tweet._id}`);
      }
    }
  }

  function copyLink() {
    const link = `http://localhost:3002/user/${tweet.user.handle}/status/${tweet._id}`;

    navigator.clipboard.writeText(link);

    setOpenMenu(false);
  }

  async function addBookmark() {
    if (!reply) {
      const data = await bookmark(tweet._id);

      if (data.success == true) {
        setBookmarked(true);
        setOpenMenu(false);
      }
    }
  }

  async function removeBookmarkA() {
    if (!reply) {
      const data = await removeBookmark(tweet._id);

      if (data.success == true) {
        setBookmarked(false);
        setOpenMenu(false);
      }
    }
  }

  async function likeA(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!reply && userInfo) {
      const data = await like(tweet._id);

      if (data.success == true && data.status == "Tweet liked.") {
        setLiked(true);
        setLikes((count) => count + 1);
      } else {
        setLiked(false);
        setLikes((count) => count - 1);
      }
    } else {
      handleReplyLike();
    }
  }

  async function handleReplyLike() {
    if (userInfo) {
      const token = localStorage.getItem("token");

      const data = await fetch(
        `${backendURL}/api/tweet/${tweet.tweet}/comment/${tweet._id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());

      if (data.success && data.status == "Comment liked.") {
        setLiked(true);
        setLikes((count) => count + 1);
      } else {
        setLiked(false);
        setLikes((count) => count - 1);
      }
    }
  }

  async function handleRetweet(e) {
    e.stopPropagation();

    if (!reply && userInfo) {
      if (retweeted) {
        const data = await retweet(tweet._id);

        if (data.success) {
          setRetweeted(false);
          setRetweets((count) => count - 1);
        }
      } else {
        const data = await retweet(tweet._id);

        if (data.success) {
          setRetweeted(true);
          setRetweets((count) => count + 1);
        }
      }
    }
  }

  async function deleteTwt() {
    const data = await deleteTweet(tweet._id);

    if (data.success == true) {
      removeTweet(tweet._id);
    }
  }

  async function handleFollow() {
    const data = await follow(tweet.user.handle);

    if (data.success == true) {
      setFollowing(true);
    }
  }

  async function handleUnfollow() {
    const data = await unfollow(tweet.user.handle);

    if (data.success == true) {
      setFollowing(false);
    }
  }

  function stop(e) {
    e.stopPropagation();
  }

  window.addEventListener("click", closeOpenMenu);

  return (
    <div
      ref={tweetRef}
      className={
        !bar
          ? "hover:bg-gray-200/5 relative border-b border-gray-700/75 w-full px-4 pt-3 pb-2 flex gap-3"
          : reply
          ? "hover:bg-gray-200/5 relative border-b border-gray-700/75 w-full px-4 pt-3 flex gap-3"
          : "hover:bg-gray-200/5 relative flex gap-3 px-4 pt-3"
      }
    >
      {reply ? (
        <div className="top-0 left-[39px] h-[12px] absolute w-[1.5px] bg-[#333639]"></div>
      ) : (
        <></>
      )}
      {openTweetMenu && userInfo ? (
        <div
          style={{ boxShadow: "0 0 3px #fff" }}
          className="absolute flex flex-col rounded-lg right-0 mr-4 bg-black z-10"
          ref={tweetMenu}
        >
          {tweet.user.handle == userInfo.handle ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTwt();
              }}
              className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
            >
              <Image src="/delete.svg" width={28} height={28} />
              <p className="font-bold text-[#b81823]">Delete</p>
            </button>
          ) : following == false ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollow();
              }}
              className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
            >
              <Image src="/account-plus.svg" width={28} height={28} />
              <p>Follow @{tweet.user.handle}</p>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUnfollow();
              }}
              className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
            >
              <Image src="/account-remove.svg" width={28} height={28} />
              <p>Unfollow @{tweet.user.handle}</p>
            </button>
          )}
        </div>
      ) : (
        <></>
      )}
      {openMenu && !reply ? (
        <div
          ref={dropdownMenu}
          style={{ boxShadow: "0 0 3px #fff" }}
          className="absolute flex flex-col rounded-lg top-20 right-0 z-10 justify-start items-start mr-4 bg-black"
        >
          <button
            onClick={copyLink}
            className="flex px-4 py-2 w-full hover:bg-stone-700/20 gap-2"
          >
            <Image src="/link-variant.svg" width={28} height={28} />
            <p className="font-bold">Copy link to Tweet</p>
          </button>
          {!bookmarked && userInfo ? (
            <button
              onClick={addBookmark}
              className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
            >
              <Image src="/bookmark-plus.svg" width={28} height={28} />
              <p>Bookmark</p>
            </button>
          ) : bookmarked && userInfo ? (
            <button
              onClick={removeBookmarkA}
              className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
            >
              <Image src="/bookmark-off.svg" width={28} height={28} />
              <p>Remove Tweet from Bookmarks</p>
            </button>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-col justify-self-center">
        <Link
          onClick={stop}
          href={`/user/${tweet?.user.handle}`}
          className="w-[48px] h-[48px]"
        >
          <img
            src={tweet?.user.profile_picture_url
              .replace(`"`, "")
              .replace(",", "")}
            alt="pfp"
            className="w-[48px] h-[48px] rounded-full"
          />
        </Link>
        {bar ? (
          <div className="w-[1.5px] bg-[#333639] h-full self-center"></div>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full flex flex-col">
        <div className="flex gap-1">
          <Link
            onClick={stop}
            href={`/user/${tweet?.user.handle}`}
            className="hover:underline"
          >
            <p className="font-bold">{tweet.user.username}</p>
          </Link>
          {tweet.user.verifiedCheckmark ? (
            <Checkmark className="w-[17px] h-[17px] self-center mt-[3px]" />
          ) : (
            <></>
          )}
          <Link onClick={stop} href={`/user/${tweet?.user.handle}`}>
            <p className="text-secondary">@{tweet.user.handle}</p>
          </Link>
          <span className="text-secondary">·</span>
          <p className="text-secondary flex-grow">
            {format(new Date(tweet.posted_on), "MMM dd")}
          </p>
          <Image
            alt="menu"
            src="/dots-horizontal.svg"
            className="cursor-pointer"
            onClick={(e) => {
              setOpenTweetMenu(true);
              e.stopPropagation();
            }}
            width={19}
            height={19}
          />
        </div>
        {tweet.content != "" ? (
          <>
            <pre
              style={{
                fontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
              }}
            >
              {tweetContent.map((item) => {
                if (!item.type) {
                  return <span key={uniqid()}>{item.content + " "}</span>;
                } else {
                  return (
                    <Link
                      key={uniqid()}
                      href={`/hashtag/${item.content.replace("#", "")}`}
                    >
                      <span
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#1d9bf0] cursor-pointer hover:underline"
                      >
                        {item.content}
                      </span>{" "}
                    </Link>
                  );
                }
              })}
            </pre>
            {tweet.giphyUrl ? (
              <div className="mt-2 relative">
                <p className="absolute bottom-0 mb-2 ml-2 px-1 rounded-md font-bold bg-black w-min-content h-min-content">
                  GIF
                </p>
                <img src={tweet.giphyUrl} className="rounded-xl" />
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className="mt-2 relative">
            <p className="absolute bottom-0 mb-2 ml-2 px-1 rounded-md font-bold bg-black w-min-content h-min-content">
              GIF
            </p>
            <img src={tweet.giphyUrl} className="rounded-xl" />
          </div>
        )}
        <div className={bar ? "mt-3 flex pb-2" : "mt-3 flex"}>
          <div className="text-secondary hover:text-[#1d9bf0] flex-grow flex-basis flex gap-4">
            <Comment className="h-6 w-6" useCurrentColor={true} />
            <p>{rest.comments ? rest.comments : 0}</p>
          </div>
          <div
            onClick={handleRetweet}
            className="cursor-pointer text-secondary hover:text-[#00ba7c] flex-grow flex-basis flex gap-4"
          >
            <Retweet
              useCurrentColor={true}
              className="h-7 w-7 rounded-full"
              retweeted={retweeted}
              fill="#71767b"
            />
            <p className={retweeted == true ? "text-[#00ba7c]" : ""}>
              {retweets}
            </p>
          </div>
          <div
            onClick={likeA}
            className="text-secondary hover:text-[#f91880] cursor-pointer flex-grow flex-basis flex gap-4"
          >
            {liked == false ? (
              <Like
                className={"h-6 w-6 rounded-full"}
                useCurrentColor={true}
                stroke="#71767b"
              />
            ) : (
              <Like
                className={"h-6 w-6 rounded-full"}
                stroke="#f91880"
                fill={"#f91880"}
              />
            )}
            {liked == false ? (
              <p>{likes}</p>
            ) : (
              <p className="text-[#f91880]">{likes}</p>
            )}
          </div>
          <Image
            alt="share"
            src="/share.svg"
            height={12}
            width={12}
            onClick={(e) => {
              e.stopPropagation();
              openMenu == false ? setOpenMenu(true) : setOpenMenu(false);
            }}
            className="cursor-pointer flex-grow flex-basis h-6 w-6 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
