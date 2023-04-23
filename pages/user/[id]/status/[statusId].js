import Head from "next/head";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import Like from "@/components/Icons/Like";
import Retweet from "@/components/Icons/Retweet";
import Comment from "@/components/Icons/Comment";
import Bookmark from "@/components/Icons/Bookmark";
import Share from "@/components/Icons/Share";
import { useEffect, useRef, useState } from "react";
import {
  bookmark,
  deleteTweet,
  follow,
  like,
  removeBookmark,
  reply,
  retweet,
  unfollow,
} from "@/lib/actions";
import { useSelector } from "react-redux";
import CommentComp from "@/components/CommentComponent";
import AllLikes from "@/components/AllLikes";
import AllRetweets from "@/components/AllRetweets";
import { useRouter } from "next/router";

const backendURL = "http://localhost:3000";

export async function getServerSideProps(context) {
  const auth = `Bearer ${context.req.cookies["token"]}`;

  const data = await fetch(
    `${backendURL}/api/tweet/${context.params.statusId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  if (data.tweet.user.handle == context.params.id) {
    return {
      props: {
        tweet: data,
      },
    };
  } else {
    return {
      props: {
        notFound: true,
      },
    };
  }
}

export default function Status({ notFound, tweet }) {
  const [liked, setLiked] = useState(tweet.liked);
  const [likes, setLikes] = useState(tweet.likes);
  const [bookmarks, setBookmarks] = useState(tweet.bookmarks);
  const [retweets, setRetweets] = useState(tweet.retweets);
  const [retweeted, setRetweeted] = useState(tweet.retweeted);
  const [replyMessage, setReplyMessage] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [bookmarked, setBookmarked] = useState(tweet.bookmarked);
  const [replies, setReplies] = useState([]);
  const [following, setFollowing] = useState(tweet.following);
  const [openTweetMenu, setOpenTweetMenu] = useState(false);
  const [showLikesDiv, setShowLikesDiv] = useState(false);
  const [showRetweetDiv, setShowRetweetDiv] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dropdownMenu = useRef(null);
  const tweetMenu = useRef(null);

  const router = useRouter();

  useEffect(() => {
    async function getReplies() {
      const token = localStorage.getItem("token");

      const data = await fetch(
        `${backendURL}/api/tweet/${tweet.tweet._id}/comment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());

      console.log(data);

      setReplies(data.comments);
    }

    getReplies();
  }, []);

  async function setLike() {
    const data = await like(tweet.tweet._id);

    if (data.success == true && data.status == "Tweet liked.") {
      setLiked(true);
      setLikes((count) => count + 1);
    } else {
      setLiked(false);
      setLikes((count) => count - 1);
    }
  }

  async function handleBookmark() {
    if (bookmarked == true) {
      const data = await removeBookmark(tweet.tweet._id);

      if (data.success == true) {
        setBookmarked(false);
        setBookmarks((count) => count - 1);
      }
    } else {
      const data = await bookmark(tweet.tweet._id);

      if (data.success == true) {
        setBookmarked(true);
        setBookmarks((count) => count + 1);
      }
    }
  }

  async function handleRetweet() {
    if (retweeted == true) {
      const data = await retweet(tweet.tweet._id);

      if (data.success == true) {
        setRetweeted(false);
        setRetweets((count) => count - 1);
      }
    } else {
      const data = await retweet(tweet.tweet._id);

      if (data.success == true) {
        setRetweeted(true);
        setRetweets((count) => count + 1);
      }
    }
  }

  async function replyA() {
    const data = await reply(tweet.tweet._id, replyMessage);

    console.log(data);

    const replyObj = {
      _id: data.comment._id,
      content: replyMessage,
      posted_on: new Date(),
      tweet: tweet.tweet._id,
      user: userInfo,
    };

    setReplyMessage("");

    setReplies([...replies, replyObj]);
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
  }

  async function deleteTwt() {
    const data = await deleteTweet(tweet.tweet._id);

    if (data.success == true) {
      window.location.replace("/");
    }
  }

  async function handleFollow() {
    const data = await follow(tweet.tweet.user.handle);

    if (data.success == true) {
      setFollowing(true);
    }
  }

  async function handleUnfollow() {
    const data = await unfollow(tweet.tweet.user.handle);

    if (data.success == true) {
      setFollowing(false);
    }
  }

  document.addEventListener("mousedown", closeOpenMenu);

  return (
    <div className="bg-black flex min-h-screen text-gray-200">
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LeftSidebar />
      {showLikesDiv == true ? (
        <AllLikes
          close={() => setShowLikesDiv(false)}
          tweetId={tweet.tweet._id}
        />
      ) : (
        <></>
      )}
      {showRetweetDiv == true ? (
        <AllRetweets
          close={() => setShowRetweetDiv(false)}
          tweetId={tweet.tweet._id}
        />
      ) : (
        <></>
      )}
      <main className="flex max-w-[575px] flex-grow flex-col">
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: "100" }}
          className="sticky top-[0.1px] backdrop-blur-xl px-4 py-1 h-[52px] flex gap-6 mb-3"
        >
          {openTweetMenu == true ? (
            <div
              ref={tweetMenu}
              style={{ boxShadow: "0 0 3px #fff" }}
              className="absolute flex flex-col top-[67px] rounded-lg right-0 z-10 justify-start items-start mr-4 bg-black"
            >
              {tweet.tweet.user.handle == userInfo.handle ? (
                <button
                  onClick={deleteTwt}
                  className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
                >
                  <Image src="/delete.svg" width={28} height={28} />
                  <p className="font-bold text-[#b81823]">Delete</p>
                </button>
              ) : following == false ? (
                <button
                  onClick={handleFollow}
                  className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
                >
                  <Image src="/account-plus.svg" width={28} height={28} />
                  <p>Follow @{tweet.tweet.user.handle}</p>
                </button>
              ) : (
                <button
                  onClick={handleUnfollow}
                  className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
                >
                  <Image src="/account-remove.svg" width={28} height={28} />
                  <p>Unfollow @{tweet.tweet.user.handle}</p>
                </button>
              )}
            </div>
          ) : (
            <></>
          )}
          {openMenu == true ? (
            <div
              ref={dropdownMenu}
              style={{ boxShadow: "0 0 3px #fff", top: "246px" }}
              className="absolute flex flex-col rounded-lg right-0 z-10 justify-start items-start mr-4 bg-black"
            >
              {bookmarked == false ? (
                <button
                  onClick={handleBookmark}
                  className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
                >
                  <Image src="/bookmark-plus.svg" width={28} height={28} />
                  <p>Bookmark</p>
                </button>
              ) : (
                <button
                  onClick={handleBookmark}
                  className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
                >
                  <Image src="/bookmark-off.svg" width={28} height={28} />
                  <p>Remove Tweet from Bookmarks</p>
                </button>
              )}
            </div>
          ) : (
            <></>
          )}
          <div
            onClick={() => {
              router.push("/");
            }}
            className="flex px-2 rounded-full hover:bg-stone-900"
          >
            <img
              src="/arrow-left.svg"
              alt="back"
              className="self-center w-6 h-6"
            />
          </div>
          <div className="justify-center flex flex-col">
            <h2 className="leading-6 text-lg font-bold">Tweet</h2>
          </div>
        </div>
        <div className="flex flex-col px-4 gap-3">
          <div className="flex gap-3">
            <img
              src={tweet?.tweet.user.profile_picture_url
                .replace(`"`, "")
                .replace(",", "")}
              alt="pfp"
              className="w-[48px] h-[48px] rounded-full"
            />
            <div className="flex flex-grow">
              <div className="flex flex-col self-center">
                <Link
                  className="hover:underline"
                  href={`/user/${tweet.tweet.user.handle}/`}
                >
                  <p className="font-bold leading-4">
                    {tweet?.tweet.user.username}
                  </p>
                </Link>
                <Link href={`/user/${tweet.tweet.user.handle}`}>
                  <p className="text-secondary">@{tweet?.tweet.user.handle}</p>
                </Link>
              </div>
            </div>
            <div>
              <Image
                alt="menu"
                src="/dots-horizontal.svg"
                className="cursor-pointer"
                width={19}
                height={19}
                onClick={() => setOpenTweetMenu(true)}
              />
            </div>
          </div>
          {tweet.tweet.content != "" ? (
            <div className="flex flex-col gap-1">
              <pre
                style={{
                  fontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
                }}
                className="font-[18px]"
              >
                {tweet.tweet.content.split(" ").map((item) => {
                  if (item && item[0] == "#") {
                    return item + " ";
                  } else {
                    return (
                      <Link href={`/hashtag/${item.replace("#", "")}`}>
                        <span
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#1d9bf0] cursor-pointer hover:underline"
                        >
                          {item}
                        </span>{" "}
                      </Link>
                    );
                  }
                })}
              </pre>
              {tweet.tweet.giphyUrl ? (
                <div className="mt-2 relative">
                  <p className="absolute bottom-0 mb-2 ml-2 px-1 rounded-md font-bold bg-black w-min-content h-min-content">
                    GIF
                  </p>
                  <img src={tweet.tweet.giphyUrl} className="rounded-xl" />
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="relative">
              <p className="absolute bottom-0 mb-2 ml-2 px-1 rounded-md font-bold bg-black w-min-content h-min-content">
                GIF
              </p>
              <img src={tweet.tweet.giphyUrl} className="rounded-xl w-full" />
            </div>
          )}
          <div className="text-secondary text-[15px]">
            <p>
              {format(new Date(tweet.tweet.posted_on), "h:mm b")}{" "}
              <span className="font-bold">· </span>
              {format(new Date(tweet.tweet.posted_on), "LLL dd, yyyy")}
            </p>
          </div>
          {liked || retweets || bookmarks ? (
            <div className="flex gap-5 border-t border-gray-700/75 pt-3">
              {retweets ? (
                <p
                  onClick={() => setShowRetweetDiv(true)}
                  className="text-secondary cursor-pointer hover:underline"
                >
                  <span className="font-bold text-white">{retweets}</span>{" "}
                  Retweets
                </p>
              ) : (
                <></>
              )}
              {likes ? (
                <p
                  onClick={() => setShowLikesDiv(true)}
                  className="text-secondary cursor-pointer hover:underline"
                >
                  <span className="font-bold text-white">{likes}</span> Likes
                </p>
              ) : (
                <></>
              )}
              {bookmarks ? (
                <p
                  onClick={() => setShowBookmarkDiv(true)}
                  className="text-secondary"
                >
                  <span className="font-bold text-white">{bookmarks}</span>{" "}
                  Bookmarks
                </p>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
          <div className="flex py-2 border-t border-b border-gray-700/75">
            <Comment
              className="self-center h-6 w-6 flex-basis flex-grow"
              stroke="#71767b"
            />
            <Retweet
              className="cursor-pointer self-center h-7 w-7 rounded-full flex-basis flex-grow"
              fill="#71767b"
              retweeted={retweeted}
              onClickFunc={handleRetweet}
            />
            {liked == false ? (
              <Like
                className="self-center cursor-pointer hover:text-[#f91880] text-secondary h-6 w-6 rounded-full flex-basis flex-grow"
                useCurrentColor={true}
                onClickFunc={setLike}
              />
            ) : (
              <Like
                className={
                  "self-center cursor-pointer h-6 w-6 rounded-full flex-basis flex-grow"
                }
                liked={liked}
                stroke="#f91880"
                onClickFunc={setLike}
              />
            )}
            <Bookmark
              stroke="#71767b"
              className="cursor-pointer self-center h-6 w-6 rounded-full flex-basis flex-grow"
              bookmarked={bookmarked == true ? true : false}
              onClickFunc={handleBookmark}
            />
            <Share
              stroke="#71767b"
              className="self-center cursor-pointer flex-grow flex-basis h-6 w-6 rounded-full"
              onClickFunc={() => setOpenMenu(true)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-700/75 px-4 py-3">
          <p className="ml-[60px] text-secondary">
            Replying to{" "}
            <Link
              href={`/user/${tweet.tweet.user.handle}`}
              className="cursor-pointer text-[#1d9bf0]"
            >
              @{tweet.tweet.user.handle}
            </Link>
          </p>
          <div className="flex gap-3">
            <img
              src={userInfo.profile_picture_url
                .replace(`"`, "")
                .replace(",", "")}
              className="w-[48px] h-[48px] rounded-full"
              alt="pfp"
            />
            <div className="flex flex-col flex-grow">
              <textarea
                className="bg-inherit outline-none resize-none placeholder:text-secondary text-lg w-full"
                placeholder="Tweet your reply"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              ></textarea>
              <div className="items-center flex gap-2">
                <p>Image</p>
                <p className="flex-grow">Gif</p>
                <p>{240 - replyMessage.length}</p>
                <button
                  onClick={replyA}
                  disabled={replyMessage.length >= 3 ? false : true}
                  className="disabled:bg-sky-400/50 disabled:text-white/50 bg-sky-400/[.85] py-1 px-4 rounded-full font-bold"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          {replies.map((item) => {
            return <CommentComp comment={item} />;
          })}
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}
