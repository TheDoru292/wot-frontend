import PostTweet from "@/components/PostTweet";
import Head from "next/head";
import Image from "next/image";
import Tweet from "@/components/Tweet";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { useRouter } from "next/router";
import SearchExperience from "@/components/GifComponent";
import { BrowserView, MobileView } from "react-device-detect";
import Link from "next/link";
import MobileBottomBar from "@/components/MobileBottomBar";
import MobileTopBar from "@/components/MobileTopBar";
import MobileUserBar from "@/components/MobileUserBar";
import Notification from "@/components/Notification";

const backendURL = "https://wot-backend.onrender.com";

export default function Home() {
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const [tweets, setTweets] = useState([]);
  const [pageDetails, setPageDetails] = useState({});
  const [gifMenu, setGifMenu] = useState(false);
  const [gifId, setGifId] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("forYou");
  const [openUserBar, setOpenUserBar] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  async function fetchTweets() {
    const token = localStorage.getItem("token");

    const tweets = await fetch(
      `${backendURL}/api/tweet/?page=${pageDetails.nextPage || 1}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
        const tweets = await res.json();

        if (tweets.success) {
          setPageDetails(tweets.pages);
          setTweets(tweets.tweets);
        } else {
          setError(true);
        }
      })
      .catch((err) => setError(true));
  }

  async function showMoreTweets() {
    if (selected == "forYou") {
      const token = localStorage.getItem("token");

      const fetchedTweets = await fetch(
        `${backendURL}/api/tweet/?page=${pageDetails.nextPage || 1}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (res) => {
          const fetchedTweets = res.json();

          if (fetchedTweets.success) {
            setTweets([...tweets, ...fetchedTweets.tweets]);
            setPageDetails(fetchedTweets.pages);
          } else {
            setError(true);
          }
        })
        .catch((err) => setError(true));
    } else {
      const token = localStorage.getItem("token");

      const fetchedTweets = await fetch(
        `${backendURL}/api/user/${userInfo.hande}/following/tweet?page=${
          pageDetails.nextPage || 1
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (res) => {
          const fetchedTweets = res.json();

          if (fetchedTweets.success) {
            setTweets([...tweets, ...fetchedTweets.tweets]);
            setPageDetails(fetchedTweets.pages);
          } else {
            setError(true);
          }
        })
        .catch((err) => setError(true));
    }
  }

  function removeTweetFromArray(tweetId) {
    setTweets(tweets.filter((item) => item.tweet._id != tweetId));
  }

  function addToArray(obj) {
    setTweets([obj, ...tweets]);
  }

  async function getFollowingTweets() {
    const token = localStorage.getItem("token");

    const fetchedTweets = await fetch(
      `${backendURL}/api/user/${userInfo.handle}/following/tweet`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
        const fetchedTweets = await res.json();

        try {
          if (fetchedTweets.tweets) {
            setTweets(fetchedTweets.tweets);
            setPageDetails(fetchedTweets.pages);
          }
        } catch {
          setError(true);
        }
      })
      .catch((err) => setError(true));
  }

  useEffect(() => {
    if (!userInfo) {
      router.push("/explore");
    } else {
      fetchTweets();
    }
  }, [userInfo]);

  const selectButtons = (
    <div className="flex">
      {selected == "forYou" ? (
        <div className="cursor-pointer justify-center flex font-bold self-start h-full flex-grow flex-basis">
          <div>
            <p className="py-[13.2px]">For you</p>
            <div className="h-[4.5px] w-[56px] rounded-full bg-sky-400"></div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setSelected("forYou");
            setTweets([]);
            fetchTweets();
          }}
          className="cursor-pointer text-secondary font-bold flex justify-center flex-grow flex-basis"
        >
          <p className="py-4">For You</p>
        </div>
      )}
      {selected == "following" ? (
        <div className="cursor-pointer justify-center flex font-bold self-start h-full flex-grow flex-basis">
          <div>
            <p className="py-[13.2px]">Following</p>
            <div className="h-[4.5px] w-[72px] rounded-full bg-sky-400"></div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setSelected("following");
            setTweets([]);
            getFollowingTweets();
          }}
          className="cursor-pointer text-secondary font-bold flex justify-center flex-grow flex-basis"
        >
          <p className="py-4">Following</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <BrowserView>
        <div className="bg-black flex min-h-screen text-gray-200">
          <Head>
            <title>Home</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <LeftSidebar />
          {gifMenu == true ? (
            <SearchExperience
              onClick={(id) => {
                setGifId(id);

                console.log(id);

                setGifMenu(false);
              }}
              close={() => setGifMenu(false)}
            />
          ) : (
            <></>
          )}
          <main className="flex max-w-[600px] flex-grow flex-col border-r border-gray-700/75">
            <div
              style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: "100" }}
              className="sticky top-[0.1px] flex flex-col backdrop-blur-md border-b border-gray-700/75"
            >
              <h1 className="py-3 pl-4 text-lg font-bold">Home</h1>
              <div className="flex">
                {selected == "forYou" ? (
                  <div className="cursor-pointer justify-center hover:bg-zinc-500/10 flex font-bold self-start h-full flex-grow flex-basis">
                    <div>
                      <p className="py-[13.2px]">For you</p>
                      <div className="h-[4.5px] w-[56px] rounded-full bg-sky-400"></div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setSelected("forYou");
                      setError(false);
                      setTweets([]);
                      fetchTweets();
                    }}
                    className="cursor-pointer text-secondary font-bold hover:bg-zinc-500/10 flex justify-center flex-grow flex-basis"
                  >
                    <p className="py-4">For You</p>
                  </div>
                )}
                {selected == "following" ? (
                  <div className="cursor-pointer justify-center hover:bg-zinc-500/10 flex font-bold self-start h-full flex-grow flex-basis">
                    <div>
                      <p className="py-[13.2px]">Following</p>
                      <div className="h-[4.5px] w-[72px] rounded-full bg-sky-400"></div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setSelected("following");
                      setTweets([]);
                      getFollowingTweets();
                      setError(false);
                    }}
                    className="cursor-pointer text-secondary font-bold hover:bg-zinc-500/10 flex justify-center flex-grow flex-basis"
                  >
                    <p className="py-4">Following</p>
                  </div>
                )}
              </div>
            </div>
            <PostTweet
              changeArray={addToArray}
              setGifMenu={setGifMenu}
              gifId={gifId}
              setGifId={setGifId}
            />
            {tweets.map((item) => {
              return (
                <Tweet
                  key={item.tweet._id}
                  tweet={item.tweet}
                  rest={item}
                  removeTweet={removeTweetFromArray}
                />
              );
            })}
            {error ? (
              <div className="mt-2">
                <Notification errorMessage="Failed to fetch tweets" />
              </div>
            ) : (
              <></>
            )}
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
          <RightSidebar />
        </div>
      </BrowserView>
      <MobileView className="relative bg-black min-h-screen text-white flex flex-col max-w-screen">
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
          children={selectButtons}
          open={(e) => {
            e.stopPropagation();
            setOpenUserBar(true);
          }}
        />
        <main className="flex-grow">
          <PostTweet
            changeArray={addToArray}
            setGifMenu={setGifMenu}
            gifId={gifId}
            setGifId={setGifId}
          />
          {tweets.map((item) => {
            return (
              <Tweet
                key={item.tweet._id}
                tweet={item.tweet}
                rest={item}
                removeTweet={removeTweetFromArray}
              />
            );
          })}
          {error ? (
            <div className="mt-2">
              <Notification errorMessage="Failed to fetch tweets" />
            </div>
          ) : (
            <></>
          )}
          {pageDetails.hasNextPage ? (
            <p onClick={showMoreTweets} className="text-center py-2">
              Show more tweets
            </p>
          ) : (
            <></>
          )}
        </main>
        <MobileBottomBar />
      </MobileView>
    </>
  );
}
