import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import RsUser from "./RsUser";
import { isMobile } from "react-device-detect";
import Notification from "./Notification";

const backendURL = "http://localhost:3000";

export default function RightSidebar({ openCreateAccount }) {
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const sidebar = useRef(null);

  const [tagsError, setTagsError] = useState(false);
  const [usersError, setUsersError] = useState(false);

  useEffect(() => {
    async function getTags() {
      const data = await fetch(`${backendURL}/api/tag/popular`, {
        method: "GET",
      })
        .then(async (res) => {
          const data = await res.json();

          if (data.success) {
            setTags(data.tags);
          }
        })
        .catch((err) => setTagsError(true));
    }

    async function getUsers() {
      const data = await fetch(
        `${backendURL}/api/user/${userInfo.handle}/connect`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            Limit: true,
          },
        }
      )
        .then(async (res) => {
          const data = await res.json();

          if (data.success) {
            setUsers(data.users);
          }
        })
        .catch((err) => setUsersError(true));
    }

    if (userInfo) {
      getUsers();
    }

    getTags();
  }, [userInfo, userToken]);

  window.onscroll = () => {
    if (!isMobile) {
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
    }
  };

  return (
    // w-[540px]
    <div className="flex-grow basis-1 hidden lg:flex overflow-hidden min-h-screen pt-2">
      <div ref={sidebar} className="flex gap-4 flex-col ml-6 w-[360px]">
        {router.pathname == "/explore" || router.pathname == "/search" ? (
          <></>
        ) : (
          <input
            type="text"
            name="search"
            id="search"
            className="w-full py-2 px-4 bg-[#202327] rounded-full text-gray-400 placeholder:text-gray-400"
            placeholder="Search Wot"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                router.push(`/search?q=${search.split(" ").join("+")}`);
              }
            }}
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
                  <Link
                    key={item._id}
                    href={`/hashtag/${item._id.replace("#", "")}`}
                  >
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
              {tags.length == 3 ? (
                <Link href="/trends">
                  <p className="px-4 py-2 pb-4 rounded-b-xl text-sky-400 hover:bg-zinc-800/50">
                    Show more
                  </p>
                </Link>
              ) : (
                <></>
              )}
              {tagsError ? (
                <div className="px-4 pb-3">
                  <p className="font-bold text-red-400">
                    Failed to fetch tags.
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        )}
        {router.pathname == "/connect_people" || !userInfo ? (
          <></>
        ) : (
          <div className="flex flex-col pt-2 bg-[#16181c] rounded-xl">
            <h2 className="px-4 pb-2 text-lg font-bold">Who to follow</h2>
            {users.map((item) => {
              return <RsUser key={item.user._id} user={item} />;
            })}
            {users.length == 3 ? (
              <Link href="/connect_people">
                <p className="px-4 py-2 pb-4 rounded-b-xl text-sky-400 hover:bg-zinc-800/50">
                  Show more
                </p>
              </Link>
            ) : (
              <></>
            )}
            {usersError ? (
              <div className="px-4 pb-3 font-bold text-red-400">
                Failed to fetch users.
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
        {userInfo ? (
          <></>
        ) : (
          <div className="flex flex-col p-3 rounded-xl border border-gray-700/75">
            <p className="font-bold text-lg">Let&apos;s use Wot!</p>
            <p className="text-secondary pb-4">
              Sign up today to start using Wot!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  openCreateAccount();
                  document
                    .querySelector("body")
                    .classList.toggle("overflow-hidden");
                }}
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
