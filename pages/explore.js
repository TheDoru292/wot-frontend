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

const backendURL = "http://localhost:3000";

export default function Explore() {
  const { userInfo } = useSelector((state) => state.auth);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [pageDetails, setPageDetails] = useState([]);
  const [tags, setTags] = useState([]);
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
    <div className="relative bg-black min-h-screen text-gray-200">
      <Head>
        <title>Explore</title>
      </Head>
      <div className="flex">
        <LeftSidebar />
        <main className="flex max-w-[575px] flex-grow flex-col">
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
            <h2 className="px-4 pt-2 pb-2 text-lg font-bold">Trending tags</h2>
            {tags.map((item) => {
              return (
                <div className="px-4 py-3 hover:bg-zinc-800/50" key={item._id}>
                  <p className="font-bold">{item._id}</p>
                  <p className="text-sm text-secondary">{item.number} tweets</p>
                </div>
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
        <RightSidebar openCreateAccount={() => setOpenRegister(true)} />
      </div>
      {!userInfo ? (
        <div className="sticky h-[66px] py-2 bottom-0 flex w-full bg-blue-500">
          <div className="w-[405px]"></div>
          <div className="flex flex-col flex-grow">
            <p className="font-bold text-lg">
              Find out what's happening right now.
            </p>
            <p>
              With twitter you can quickly find out what's happening right now.
            </p>
          </div>
          <div className="flex items-center gap-4 w-[540px] justify-center">
            <button
              onClick={() => setOpenLogin(true)}
              className="bg-inherit border rounded-full h-9 w-[76px] font-bold"
            >
              Log in
            </button>
            <button
              onClick={() => setOpenRegister(true)}
              className="bg-white text-black font-bold border rounded-full h-9 w-[132px]"
            >
              Create account
            </button>
          </div>
        </div>
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
  );
}
