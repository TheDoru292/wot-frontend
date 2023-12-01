import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useRef, useState } from "react";
import Like from "./Icons/Like";
import Retweet from "./Icons/Retweet";
import Comment from "./Icons/Comment";
import Share from "./Icons/Share";
import { deleteComment } from "@/lib/actions";
import { useSelector } from "react-redux";

const backendURL = "https://wot-backend.onrender.com";

export default function CommentComp({ comment }) {
  const [liked, setLiked] = useState(comment.like);
  const [likes, setLikes] = useState(comment.likes.count);
  const [deleted, setDeleted] = useState(false);
  const [openCommentMenu, setOpenCommentMenu] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const commentRef = useRef();

  async function like() {
    const token = localStorage.getItem("token");

    const data = await fetch(
      `${backendURL}/api/tweet/${comment.comment.tweet}/comment/${comment.comment._id}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    if (data.success == true && data.status == "Comment liked.") {
      setLiked(true);
      setLikes((count) => count + 1);
    } else {
      setLiked(false);
      setLikes((count) => count - 1);
    }
  }

  async function handleDelete() {
    const data = await deleteComment(
      comment.comment.tweet,
      comment.comment._id
    );

    if (data.success == true) {
      setDeleted(true);
    }
  }

  function closeOpenMenu(e) {
    if (
      commentRef.current &&
      openCommentMenu &&
      !commentRef.current.contains(e.target)
    ) {
      setOpenCommentMenu(false);
    }
  }

  document.addEventListener("click", closeOpenMenu);

  return (
    <>
      {!deleted ? (
        <div className="relative hover:bg-gray-200/5 border-b border-gray-700/75 w-full px-4 pt-3 pb-2 flex gap-3">
          {openCommentMenu && userInfo ? (
            <div
              style={{ boxShadow: "0 0 3px #fff" }}
              className="absolute flex flex-col rounded-lg right-0 mr-4 bg-black z-10"
              ref={commentRef}
            >
              {comment.comment.user.handle == userInfo.handle ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
                >
                  <Image src="/delete.svg" width={28} height={28} />
                  <p className="font-bold text-[#b81823]">Delete</p>
                </button>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
          <Link
            href={`/user/${comment.comment.user.handle}`}
            className="w-[58px] h-[52px]"
          >
            <img
              src={comment.comment.user.profile_picture_url
                .replace(`"`, "")
                .replace(",", "")}
              alt="pfp"
              className="w-[48px] h-[48px] rounded-full"
            />
          </Link>
          <div className="w-full flex flex-col">
            <div className="flex gap-1">
              <Link
                href={`/user/${comment.comment.user.handle}`}
                className="hover:underline"
              >
                <p className="font-bold">{comment.comment.user.username}</p>
              </Link>
              <Link href={`/user/${comment.comment.user.handle}`}>
                <p className="text-secondary">@{comment.comment.user.handle}</p>
              </Link>
              <span className="text-secondary">·</span>
              <p className="text-secondary flex-grow">
                {format(new Date(comment.comment.posted_on), "MMM dd")}
              </p>
              <Image
                alt="menu"
                src="/dots-horizontal.svg"
                className="cursor-pointer"
                onClick={(e) => {
                  setOpenCommentMenu(true);
                  e.stopPropagation();
                }}
                width={19}
                height={19}
              />
            </div>
            <pre
              style={{
                fontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
              }}
            >
              {comment.comment.content}
            </pre>
            <div className="mt-3 flex">
              <div className="text-secondary hover:text-[#1d9bf0] flex-grow flex-basis flex gap-4">
                <Comment className="h-6 w-6" useCurrentColor={true} />
                <p>0</p>
              </div>
              <div className="text-secondary hover:text-[#00ba7c] flex-grow flex-basis flex gap-4">
                <Retweet
                  useCurrentColor={true}
                  className="h-7 w-7 rounded-full"
                  fill="#71767b"
                />
                <p className={""}>{0}</p>
              </div>
              <div
                onClick={like}
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
              <div className="flex-grow flex-basis">
                <Share
                  stroke="#71767b"
                  className="self-center cursor-pointer flex-grow flex-basis h-6 w-6 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
