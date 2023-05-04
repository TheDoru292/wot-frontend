import Head from "next/head";
import Tweet from "@/components/Tweet";
import { useSelector } from "react-redux";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import { useEffect, useState } from "react";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { getRightSidebarTags } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/router";
import { BrowserView, MobileView } from "react-device-detect";
import MobileTopBar from "@/components/MobileTopBar";
import MobileBottomBar from "@/components/MobileBottomBar";
import MobileUserBar from "@/components/MobileUserBar";
import NotLoggedInModal from "@/components/NotLoggedInModal";

const backendURL = "http://localhost:3000";

export default function Explore() {
  const { userInfo } = useSelector((state) => state.auth);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [pageDetails, setPageDetails] = useState([]);
  const [tags, setTags] = useState([]);
  const [openUserBar, setOpenUserBar] = useState(false);
  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchTweets() {
      const token = localStorage.getItem("token");

      const tweets = await fetch(
        `${backendURL}/api/tweet/?page=${pageDetails.nextPage || 1}`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : null,
          },
        }
      ).then((res) => res.json());

      setPageDetails(tweets.pages);
      setTweets(tweets.tweets);
    }

    async function getTags() {
      const data = await getRightSidebarTags();

      setTags(data.tags);
    }

    fetchTweets();
    getTags();
  }, []);

  async function showMoreTweets() {
    const token = localStorage.getItem("token");

    const fetchedTweets = await fetch(
      `${backendURL}/api/tweet/?page=${pageDetails.nextPage || 1}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    setTweets([...tweets, ...fetchedTweets.tweets]);
    setPageDetails(fetchedTweets.pages);
  }

  function removeTweetFromArray(tweetId) {
    setTweets(tweets.filter((item) => item.tweet._id != tweetId));
  }

  return (
    <>
      <BrowserView>
        <div className="relative bg-black min-h-screen text-gray-200">
          <Head>
            <title>Explore</title>
          </Head>
          <div className="flex">
            <LeftSidebar />
            <main className="flex max-w-[575px] flex-grow flex-col border-r border-gray-700/75">
              <div className="sticky top-0 backdrop-blur-md z-[999] px-4 py-[5px]">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-2 px-4 bg-[#202327] rounded-full text-gray-300 placeholder:text-gray-300"
                  placeholder="Search Wot"
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      router.push(`/search?q=${search.split(" ").join("+")}`);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col border-b pt-2 border-gray-700/75">
                <h2 className="px-4 pt-2 pb-2 text-lg font-bold">
                  Trending tags
                </h2>
                {tags.map((item) => {
                  return (
                    <Link href={`/hashtag/${item._id.replace("#", "")}`}>
                      <div
                        className="px-4 py-3 hover:bg-zinc-800/50"
                        key={item._id}
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
                  <p className="px-4 py-4 pb-4 text-sky-400 hover:bg-zinc-800/50">
                    Show more
                  </p>
                </Link>
              </div>
              <div className="flex flex-col">
                <h2 className="px-4 pt-2 pb-2 text-lg font-bold">Tweets</h2>
                {tweets.map((item) => {
                  return (
                    <Tweet key={item._id} rest={item} tweet={item.tweet} />
                  );
                })}
              </div>
              {pageDetails.hasNextPage == true ? (
                <p
                  className="p-2 font-bold cursor-pointer hover:text-blue-300"
                  onClick={showMoreTweets}
                >
                  Show more
                </p>
              ) : (
                <></>
              )}
            </main>
            <RightSidebar openCreateAccount={() => setOpenRegister(true)} />
          </div>
          {!userInfo ? (
            <NotLoggedInModal
              loginFunc={() => setOpenLogin(true)}
              registerFunc={() => setOpenRegister(true)}
            />
          ) : (
            <></>
          )}

          {openLogin == true ? (
            <Login
              close={() => setOpenLogin(false)}
              register={() => {
                setOpenLogin(false);
                setOpenRegister(true);
              }}
            />
          ) : (
            <></>
          )}
          {openRegister == true ? (
            <Register close={() => setOpenRegister(false)} />
          ) : (
            <></>
          )}
        </div>
      </BrowserView>
      <MobileView className="bg-black min-h-screen text-white flex flex-col max-w-screen">
        {openUserBar ? (
          <MobileUserBar
            openUserBar={openUserBar}
            close={() => {
              setOpenUserBar(false);
            }}
          />
        ) : (
          <></>
        )}
        <MobileTopBar
          open={(e) => {
            e.stopPropagation();
            setOpenUserBar(true);
          }}
        />
        <main className="flex-grow">
          <div className="flex flex-col border-b pt-2 border-gray-700/75">
            <h2 className="px-4 text-lg font-bold">Trending tags</h2>
            {tags.map((item) => {
              return (
                <Link href={`/hashtag/${item._id.replace("#", "")}`}>
                  <div
                    className="px-4 py-3 hover:bg-zinc-800/50"
                    key={item._id}
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
              <p className="px-4 py-4 pb-4 text-sky-400 hover:bg-zinc-800/50">
                Show more
              </p>
            </Link>
          </div>
          <div className="flex flex-col">
            <h2 className="px-4 pt-2 pb-2 text-lg font-bold">Tweets</h2>
            {tweets.map((item) => {
              return <Tweet key={item._id} rest={item} tweet={item.tweet} />;
            })}
          </div>
          {pageDetails.hasNextPage == true ? (
            <p
              className="p-2 font-bold cursor-pointer hover:text-blue-300"
              onClick={showMoreTweets}
            >
              Show more
            </p>
          ) : (
            <></>
          )}
        </main>
        {userInfo ? <MobileBottomBar /> : <></>}
        {openLogin == true ? (
          <Login
            close={() => setOpenLogin(false)}
            register={() => {
              setOpenLogin(false);
              setOpenRegister(true);
            }}
          />
        ) : (
          <></>
        )}
        {openRegister == true ? (
          <Register close={() => setOpenRegister(false)} />
        ) : (
          <></>
        )}
        {!userInfo ? (
          <div className="sticky px-4 py-2 bottom-0 flex flex-col w-full bg-blue-500">
            <div className="flex pb-2 flex-col flex-grow">
              <p className="font-bold">Find out what's happening right now.</p>
              <p>
                With twitter you can quickly find out what's happening right
                now.
              </p>
            </div>
            <div className="flex">
              <div className="flex-grow">
                <button
                  onClick={() => {
                    setOpenLogin(true);
                    document
                      .querySelector("body")
                      .classList.toggle("overflow-hidden");
                  }}
                  className=" bg-inherit border rounded-full h-9 w-[76px] font-bold"
                >
                  Log in
                </button>
              </div>
              <button
                onClick={() => {
                  setOpenRegister(true);
                  document
                    .querySelector("body")
                    .classList.toggle("overflow-hidden");
                }}
                className="justify-self-end bg-white text-black font-bold border rounded-full h-9 w-[132px]"
              >
                Create account
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </MobileView>
    </>
  );
}
