import format from "date-fns/format";
import { useEffect, useRef, useState } from "react";
import Copy from "./Icons/Copy";

const backendURL = "http://localhost:3000";

export default function Message({ message, userInfo, conversationId }) {
  const [deleted, setDeleted] = useState(message.deleted);
  const [hover, setHover] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [width, setWidth] = useState(0);
  const [clicked, setClicked] = useState(null);
  const menuRef = useRef(null);
  const messageRef = useRef();

  async function deleteMessage() {
    const token = localStorage.getItem("token");

    const data = await fetch(
      `${backendURL}/api/conversation/${conversationId}/message/${message._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    if (data.success) {
      setDeleted(true);
      setOpenMenu(false);
    }
  }

  function copyMessage() {
    navigator.clipboard.writeText(message.message);

    setOpenMenu(false);
  }

  useEffect(() => {
    const checkIfClickedOutsied = (e) => {
      if (openMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutsied);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutsied);
    };
  }, [openMenu]);

  if (message.user == userInfo._id) {
    if (!deleted) {
      return (
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="flex relative flex-col"
        >
          {openMenu ? (
            <div
              ref={menuRef}
              style={{ right: `${width - 75}px`, boxShadow: "0 0 3px #fff" }}
              className="absolute flex flex-col rounded-lg right-0 bg-black z-10"
            >
              {message.user == userInfo._id ? (
                <button
                  onClick={() => {
                    deleteMessage();
                  }}
                  className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
                >
                  <img src="/delete.svg" width={28} height={28} />
                  <p className="font-bold text-[#b81823]">Delete</p>
                </button>
              ) : (
                <></>
              )}
              <button
                onClick={() => {
                  copyMessage();
                }}
                className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
              >
                <Copy className="w-[24px] h-[24px]" fill="#fff" />
                <p>Copy Message</p>
              </button>
            </div>
          ) : (
            <></>
          )}
          <div
            style={{ maxWidth: hover ? "388px" : "360px" }}
            className="relative text-[15px] leading-5 self-end flex flex-row gap-2 items-center"
          >
            <div className="flex flex-row self-end">
              {hover ? (
                <img
                  onClick={() => {
                    setOpenMenu(true);
                    setWidth(messageRef.current.getBoundingClientRect().width);
                  }}
                  src="/dots-horizontal.svg"
                  className="w-5 self-center mr-2 h-5 cursor-pointer"
                />
              ) : (
                <></>
              )}
              <div
                ref={messageRef}
                onClick={() => (clicked ? setClicked(false) : setClicked(true))}
                className="rounded-[25px] self-end bg-sky-400/80 px-[16px] py-[8px] cursor-pointer"
              >
                {message.message}
              </div>
            </div>
          </div>
          {clicked ? (
            <p className="self-end text-secondary text-[13px] py-1">
              {format(new Date(message.timestamp), "MMM d, y, h:mm a")}
            </p>
          ) : (
            <></>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex self-end flex-col">
          <div
            onClick={() => (clicked ? setClicked(false) : setClicked(true))}
            className="rounded-full self-end bg-sky-400/80 leading-5 px-[16px] py-[8px] italic cursor-pointer"
          >
            Message deleted
          </div>
          {clicked ? (
            <p className="self-end text-secondary text-[13px] py-1">
              {format(new Date(message.timestamp), "MMM d, y, h:mm a")}
            </p>
          ) : (
            <></>
          )}
        </div>
      );
    }
  } else {
    if (!message.deleted) {
      return (
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="flex relative flex-col"
        >
          {openMenu ? (
            <div
              ref={menuRef}
              style={{ left: `${width + 10}px`, boxShadow: "0 0 3px #fff" }}
              className="absolute flex flex-col rounded-lg bg-black z-10"
            >
              {message.user == userInfo._id ? (
                <button
                  onClick={() => {
                    deleteMessage();
                  }}
                  className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
                >
                  <img src="/delete.svg" width={28} height={28} />
                  <p className="font-bold text-[#b81823]">Delete</p>
                </button>
              ) : (
                <></>
              )}
              <button
                onClick={() => {
                  copyMessage();
                }}
                className="flex gap-2 px-4 py-2 hover:bg-stone-700/20 w-full text-start"
              >
                <Copy className="w-[24px] h-[24px]" fill="#fff" />
                <p>Copy Message</p>
              </button>
            </div>
          ) : (
            <></>
          )}

          <div
            style={{ maxWidth: hover ? "388px" : "360px" }}
            className="relative text-[15px] leading-5 flex gap-2 items-center"
          >
            <div className="flex">
              <div
                ref={messageRef}
                onClick={() => (clicked ? setClicked(false) : setClicked(true))}
                className="rounded-[25px] self-end bg-[#2f3336] px-[16px] py-[8px] cursor-pointer"
              >
                {message.message}
              </div>
            </div>
            {hover ? (
              <img
                onClick={() => {
                  setOpenMenu(true);
                  setWidth(messageRef.current.getBoundingClientRect().width);
                }}
                src="/dots-horizontal.svg"
                className="w-5 self-center mr-2 h-5 cursor-pointer"
              />
            ) : (
              <></>
            )}
          </div>
          {clicked ? (
            <p className="self- text-secondary text-[13px] py-1">
              {format(new Date(message.timestamp), "MMM d, y, h:mm a")}
            </p>
          ) : (
            <></>
          )}
        </div>
      );
    } else {
      return (
        <div
          onClick={() => (clicked ? setClicked(false) : setClicked(true))}
          className="flex flex-col"
        >
          <div className="rounded-[25px] rounded-bl-[5px] self-start bg-[#2f3336] px-[16px] py-[8px] italic">
            Message deleted
          </div>
          {clicked ? (
            <p className="self-end text-secondary text-[13px] py-1">
              {format(new Date(message.timestamp), "MMM d, y, h:mm a")}
            </p>
          ) : (
            <></>
          )}
        </div>
      );
    }
  }
}
