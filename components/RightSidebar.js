import { getRightSidebarTags, getRightSidebarUsers } from "@/lib/actions";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import RsUser from "./RsUser";

export default function RightSidebar({ openCreateAccount }) {
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);
  const sidebar = useRef(null);

  useEffect(() => {
    async function getTags() {
      const data = await getRightSidebarTags();

      setTags(data.tags);
    }

    async function getUsers() {
      const data = await getRightSidebarUsers(userInfo.handle);

      console.log(data);
      setUsers(data.users);
    }

    if (userInfo) {
      getUsers();
    }

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
        {router.pathname == "/explore" || router.pathname == "/search" ? (
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
            <div className="flex flex-col pt-2 bg-[#16181c] rounded-xl">
              <h2 className="px-4 pb-2 text-lg font-bold">Trending</h2>
              {tags.map((item) => {
                return (
                  <Link href={`/hashtag/${item._id.replace("#", "")}`}>
                    <div
                      key={item._id}
                      className="px-4 py-3 hover:bg-zinc-800/50"
                    >
                      <p className="font-bold">{item._id}</p>
                      <p className="text-sm text-secondary">
                        {item.number} tweets
                      </p>
                    </div>
                  </Link>
                );
              })}
              <Link href="/trends">
                <p className="px-4 py-2 pb-4 rounded-b-xl text-sky-400 hover:bg-zinc-800/50">
                  Show more
                </p>
              </Link>
            </div>
          </>
        )}
        {router.pathname == "/connect_people" || !userInfo ? (
          <></>
        ) : (
          <div className="flex flex-col pt-2 bg-[#16181c] rounded-xl">
            <h2 className="px-4 pb-2 text-lg font-bold">Who to follow</h2>
            {users.map((item) => {
              return <RsUser user={item} />;
            })}
            <Link href="/connect_people">
              <p className="px-4 py-2 pb-4 rounded-b-xl text-sky-400 hover:bg-zinc-800/50">
                Show more
              </p>
            </Link>
          </div>
        )}
        {userInfo ? (
          <></>
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
