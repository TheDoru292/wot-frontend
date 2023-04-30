import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import User from "@/components/User";
import { useSelector } from "react-redux";
import Tweet from "@/components/Tweet";
import { BrowserView, MobileView, isMobile } from "react-device-detect";
import MobileBottomBar from "@/components/MobileBottomBar";
import MobileTopBar from "@/components/MobileTopBar";

const backendURL = `http://localhost:3000`;

export default function Search() {
  const [tweet, setTweet] = useState(true);
  const [user, setUser] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [tweets, setTweets] = useState([]);

  const { userInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (router.query.q) {
      setSearch(router.query.q);
      searchFunc();
    }
  }, []);

  useEffect(() => {
    if (!users) {
      setUsers([]);
    }

    if (!tweets) {
      setTweets([]);
    }
  }, [users, tweets]);

  async function searchFunc(calledFromBtn, usr) {
    if (search) {
      const query = search.split(" ").join("+");
      const link = `${backendURL}/api/search?q=${query}${
        usr || (!calledFromBtn && user) ? "&f=user" : ""
      }`;
      const token = localStorage.getItem("token");

      const body = await fetch(link, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());

      console.log(body);
      console.log(users);

      if (user || (usr && calledFromBtn)) {
        setUsers(body.users);
      } else {
        setTweets(body.tweets);
      }
    }
  }

  const buttons = (
    <div className="flex">
      <div
        className={
          isMobile
            ? "cursor-pointer font-bold flex justify-center flex-grow flex-basis"
            : "cursor-pointer font-bold hover:bg-zinc-800/75 flex justify-center flex-grow flex-basis"
        }
      >
        {tweet ? (
          <div>
            <p className="py-[13.2px]">Tweets</p>
            <div className="h-[4.5px] rounded-full bg-sky-400"></div>
          </div>
        ) : (
          <div
            onClick={() => {
              setTweet(true);
              setUser(false);
              searchFunc(true);
            }}
            className="w-full flex self-center justify-center"
          >
            <p className="text-secondary py-4">Tweets</p>
            <div className="h-[4.5px] rounded-full"></div>
          </div>
        )}
      </div>
      <div
        className={
          isMobile
            ? "cursor-pointer font-bold flex justify-center flex-grow flex-basis"
            : "cursor-pointer font-bold hover:bg-zinc-800/75 flex justify-center flex-grow flex-basis"
        }
      >
        {user ? (
          <div>
            <p className="py-[13.2px]">User</p>
            <div className="h-[4.5px] rounded-full bg-sky-400"></div>
          </div>
        ) : (
          <div
            onClick={() => {
              setUser(true);
              setTweet(false);
              searchFunc(true, true);
            }}
            className="w-full flex self-center justify-center"
          >
            <p className="text-secondary py-4">User</p>
            <div className="h-[4.5px] rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );

  const searchBar = (
    <input
      type="text"
      name=""
      id=""
      value={search}
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key == "Enter") {
          searchFunc();
        }
      }}
      className="h-[44px] w-full bg-[#202327] outline-none rounded-full px-4"
    />
  );

  return (
    <>
      <BrowserView>
        <div className="relative bg-black min-h-screen text-gray-200">
          <Head>
            <title>{search} - Wut Search</title>
          </Head>
          <div className="flex">
            <LeftSidebar />
            <main className="flex max-w-[575px] flex-grow flex-col">
              <div
                style={{ backgroundColor: "rgba(0, 0, 0, .70)" }}
                className="py-1 sticky top-0 flex flex-col backdrop-blur-md z-[3]"
              >
                <div className="flex gap-[5px] border-b border-gray-700/75 flex-col">
                  <div className="px-14">{searchBar}</div>
                  {buttons}
                </div>
              </div>
              <div className="flex flex-grow w-full">
                <div className="w-full">
                  {user ? (
                    users.length == 0 && search != "" ? (
                      <p className="text-center font-bold">
                        Unfortunately, we didn't find any users with those
                        terms.
                      </p>
                    ) : (
                      users.map((item) => {
                        if (userInfo) {
                          return (
                            <User
                              key={item.user._id}
                              user={item.user}
                              currentUser={userInfo}
                              following={item.following}
                            />
                          );
                        } else {
                          return (
                            <User
                              key={item._id}
                              user={item}
                              notLoggedIn={true}
                            />
                          );
                        }
                      })
                    )
                  ) : (
                    <></>
                  )}
                  {tweet ? (
                    tweets.length == 0 && search != "" ? (
                      <p className="text-center font-bold">
                        Unfortunatley, we didn't find any tweets with those
                        terms.
                      </p>
                    ) : (
                      tweets.map((item) => (
                        <Tweet
                          key={item.tweet._id}
                          tweet={item.tweet}
                          rest={item}
                        />
                      ))
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </main>
            <RightSidebar />
          </div>
        </div>
        {!userInfo ? (
          <div className="sticky h-[66px] text-white py-2 bottom-0 flex w-full bg-blue-500">
            <div className="w-[405px]"></div>
            <div className="flex flex-col flex-grow">
              <p className="font-bold text-lg">
                Find out what's happening right now.
              </p>
              <p>
                With twitter you can quickly find out what's happening right
                now.
              </p>
            </div>
            <div className="flex items-center gap-4 w-[540px] justify-center">
              <button
                onClick={() => {
                  setOpenLogin(true);
                  document
                    .querySelector("body")
                    .classList.toggle("overflow-hidden");
                }}
                className="bg-inherit border rounded-full h-9 w-[76px] font-bold"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setOpenRegister(true);
                  document
                    .querySelector("body")
                    .classList.toggle("overflow-hidden");
                }}
                className="bg-white text-black font-bold border rounded-full h-9 w-[132px]"
              >
                Create account
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </BrowserView>
      <MobileView className="bg-black min-h-screen text-white flex flex-col max-w-screen">
        <MobileTopBar children={buttons} searchBar={searchBar} />
        <main className="flex-grow">
          {user ? (
            users.length == 0 && search != "" ? (
              <p className="text-center font-bold">
                Unfortunately, we didn't find any users with those terms.
              </p>
            ) : (
              users.map((item) => {
                if (userInfo) {
                  return (
                    <User
                      key={item.user._id}
                      user={item.user}
                      currentUser={userInfo}
                      following={item.following}
                    />
                  );
                } else {
                  return <User key={item._id} user={item} notLoggedIn={true} />;
                }
              })
            )
          ) : (
            <></>
          )}
          {tweet ? (
            tweets.length == 0 && search != "" ? (
              <p className="text-center font-bold">
                Unfortunatley, we didn't find any tweets with those terms.
              </p>
            ) : (
              tweets.map((item) => (
                <Tweet key={item.tweet._id} tweet={item.tweet} rest={item} />
              ))
            )
          ) : (
            <></>
          )}
        </main>
        <MobileBottomBar />
      </MobileView>
    </>
  );
}
