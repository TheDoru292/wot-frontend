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
import NotLoggedInModal from "@/components/NotLoggedInModal";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Notification from "@/components/Notification";

const backendURL = `https://wot-backend-production.up.railway.app`;

export default function Search() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [tweet, setTweet] = useState(true);
  const [user, setUser] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (router.query.q) {
      setSearch(router.query.q);
      searchFunc(null, false, router.query.q);
    }
  }, [router.query.q]);

  useEffect(() => {
    if (!users) {
      setUsers([]);
    }

    if (!tweets) {
      setTweets([]);
    }
  }, [users, tweets]);

  async function searchFunc(calledFromBtn, usr, queryText) {
    if (search || queryText) {
      const query =
        search.split(" ").join("+") || queryText.split(" ").join("+");
      const link = `${backendURL}/api/search?q=${query}${
        usr || (!calledFromBtn && user) ? "&f=user" : ""
      }`;
      const token = localStorage.getItem("token");

      const body = await fetch(link, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          const body = res.json();

          if (user || (usr && calledFromBtn)) {
            setUsers(body.users);
          } else {
            setTweets(body.tweets);
          }
        })
        .catch((err) => setError(true));
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
              setError(false);
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
              setError(false);
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
      className={
        isMobile
          ? "h-[25px] w-full bg-[#202327] outline-none rounded-full px-4"
          : "h-[44px] w-full bg-[#202327] outline-none rounded-full px-4"
      }
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
            <main className="flex max-w-[575px] flex-grow flex-col border-r border-gray-700/75">
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
                  {user && !error ? (
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
                  {tweet && !error ? (
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
                  {error ? (
                    <Notification errorMessage="Failed to search." />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </main>
            <RightSidebar />
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
        </div>
        {!userInfo ? (
          <NotLoggedInModal
            loginFunc={() => setOpenLogin(true)}
            registerFunc={() => setOpenRegister(true)}
          />
        ) : (
          <></>
        )}
      </BrowserView>
      <MobileView className="bg-black min-h-screen text-white flex flex-col max-w-screen">
        <MobileTopBar children={buttons} searchBar={searchBar} />
        <main className="flex-grow">
          {user && !error ? (
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
          {tweet && !error ? (
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
          {error ? <Notification errorMessage="Failed to search." /> : <></>}
        </main>
        {userInfo ? <MobileBottomBar /> : <></>}
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
