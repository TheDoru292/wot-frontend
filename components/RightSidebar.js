import { getRightSidebarTags } from "@/lib/actions";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import store from "../redux/store";

const whoToFollow = [
  { _id: 59, username: "TheDoru", handle: "@thedoru", profile_picture_url: "" },
  { _id: 32, username: "Testing", handle: "@test" },
  { _id: 1, username: "Sei", handle: "@seiryuu" },
];

export default function RightSidebar({ openCreateAccount }) {
  const [tags, setTags] = useState([]);
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);
  const sidebar = useRef(null);

  useEffect(() => {
    async function getTags() {
      const data = await getRightSidebarTags();

      setTags(data.tags);
    }

    console.log(tags);

    getTags();
  }, []);

  window.onscroll = () => {
    let scrollTop = window.scrollY;
    let viewportHeight = window.innerHeight;
    let contentHeight = sidebar.current.getBoundingClientRect().height;

    if (tags.length <= 3) {
      sidebar.current.style.position = "fixed";
    } else {
      if (scrollTop >= 105) {
        sidebar.current.style.position = "fixed";
        sidebar.current.style.transform = `translateY(-${
          contentHeight - viewportHeight + 20
        }px)`;
      } else {
        sidebar.current.style.position = "";
        sidebar.current.style.transform = "";
      }
    }
  };

  return (
    <div className="overflow-hidden min-h-screen flex w-[540px] pt-2 border-l border-gray-700/75">
      <div ref={sidebar} className="flex gap-4 flex-col ml-6 w-[360px]">
        {router.pathname == "/explore" ? (
          <></>
        ) : (
          <input
            type="text"
            name="search"
            id="search"
            className="py-2 px-4 bg-stone-800 rounded-full text-gray-400"
            placeholder="Search Wot"
          />
        )}
        {router.pathname == "/explore" || router.pathname == "/trends" ? (
          <></>
        ) : (
          <>
            <div className="flex flex-col pt-2 bg-secondary-bg rounded-xl">
              <h2 className="px-4 pb-2 text-lg font-bold">Trending</h2>
              {tags.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="px-4 py-3 hover:bg-zinc-800/50"
                  >
                    <p className="font-bold">{item._id}</p>
                    <p className="text-sm text-secondary">
                      {item.number} tweets
                    </p>
                  </div>
                );
              })}
              <p className="px-4 py-2 pb-4 rounded-b-xl text-sky-400 hover:bg-zinc-800/50">
                Show more
              </p>
            </div>
          </>
        )}
        {userInfo ? (
          <div className="flex flex-col pt-2 bg-secondary-bg rounded-xl">
            <h2 className="px-4 pb-2 text-lg font-bold">Who to follow</h2>
            {whoToFollow.map((item) => {
              return (
                <div
                  key={item._id}
                  className="items-center gap-3 flex px-4 py-3 hover:bg-zinc-800/50"
                >
                  <div className="w-12 h-12 bg-red-400 rounded-full"></div>
                  <div className="flex-grow">
                    <p>{item.username}</p>
                    <p className="text-secondary">{item.handle}</p>
                  </div>
                  <p className="bg-white hover:bg-white/75 text-black font-bold py-1 px-3 rounded-full">
                    Follow
                  </p>
                </div>
              );
            })}
            <p className="px-4 py-2 pb-4 rounded-b-xl text-sky-400 hover:bg-zinc-800/50">
              Show more
            </p>
          </div>
        ) : (
          <div className="flex flex-col p-3 rounded-xl border border-gray-700/75">
            <p className="font-bold text-lg">Let's use Wot!</p>
            <p className="text-secondary pb-4">
              Sign up today to start using Wot!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={openCreateAccount}
                className="text-black bg-white py-[6.5px] font-bold rounded-full"
              >
                Create account
              </button>
              <button className="text-black bg-white py-[6.5px] font-bold rounded-full">
                Guest sign-up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
