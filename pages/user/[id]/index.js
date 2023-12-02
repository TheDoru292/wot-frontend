import { useSelector } from "react-redux";
import { getAllProfileUrl } from "@/lib/profile";
import Head from "next/head";
import Tweet from "@/components/Tweet";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Link from "next/link";
import { unfollow, follow } from "@/lib/actions";
import EditProfile from "@/components/EditProfile";
import Checkmark from "@/components/Icons/Checkmark";
import { useRouter } from "next/router";
import { MobileView, BrowserView, isMobile } from "react-device-detect";
import MobileBottomBar from "@/components/MobileBottomBar";
import NotLoggedInModal from "@/components/NotLoggedInModal";
import Login from "@/components/Login";
import Register from "@/components/Register";

const backendURL = "http://localhost:3000";

export default function UserProfile({ user }) {
  const [tweets, setTweets] = useState([]);
  const [tweetPageDetails, setTweetPageDetails] = useState({});
  const [replies, setReplies] = useState([]);
  const [replyPageDetails, setRepliesPageDetails] = useState({});
  const [likes, setLikes] = useState([]);
  const [likePageDetails, setLikePageDetails] = useState({});
  const [following, setFollowing] = useState(user.reqUserFollowing);
  const [followers, setFollowers] = useState(user.followers);
  const [followingHover, setFollowingHover] = useState(false);
  const [openUnfollow, setOpenUnfollow] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [selected, setSelected] = useState("tweets");
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [conversation, setConversation] = useState(user.conversation);

  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    getTweets();
  }, []);

  useEffect(() => {
    setTweets([]);
    setReplies([]);
    setLikes([]);
    setTweetPageDetails({});
    setRepliesPageDetails({});
    setLikePageDetails({});
    setFollowing(user.reqUserFollowing);
    setFollowers(user.followers);
    setSelected("tweets");
    setConversation(user.conversation);
    getTweets();
  }, [router.asPath]);

  async function getTweets() {
    const token = localStorage.getItem("token");

    const data = await fetch(
      `${backendURL}/api/user/${user.user.handle}/tweets`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    setTweets(data.tweets);
    setTweetPageDetails(data.pages);
  }

  async function showMoreTweets() {
    const token = localStorage.getItem("token");

    const fetchedTweets = await fetch(
      `${backendURL}/api/user/${user.user.handle}/tweets?page=${
        tweetPageDetails.nextPage || 1
      }`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    setTweets([...tweets, ...fetchedTweets.tweets]);
    setTweetPageDetails(fetchedTweets.pages);
  }

  async function fetchComments() {
    const token = localStorage.getItem("token");

    const fetchedComments = await fetch(
      `${backendURL}/api/user/${user.user.handle}/comments?page=${
        replyPageDetails.nextPage || 1
      }`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    setReplies([...replies, ...fetchedComments.comments]);
    setRepliesPageDetails(fetchedComments.pages);
  }

  async function fetchLikedTweets() {
    const token = localStorage.getItem("token");

    const data = await fetch(
      `${backendURL}/api/user/${user.user.handle}/tweets/liked`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    if (data.success) {
      setLikes([...likes, ...data.tweets]);
      setRepliesPageDetails(data.pages);
    }
  }

  async function handleConversation() {
    if (userInfo) {
      if (conversation) {
        router.push("/messages");
      } else {
        const token = localStorage.getItem("token");

        const data = await fetch(
          `${backendURL}/api/user/${user.user.handle}/conversation`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json());

        if (data.success) {
          // call to notification

          router.push("/messages");
        }
      }
    }
  }

  async function handleFollow() {
    if (userInfo) {
      const data = await follow(user.user.handle);

      if (data.success == true) {
        setFollowers((count) => count + 1);
        setFollowing(true);
      }
    } else {
      setOpenLogin(true);
    }
  }

  async function handleUnfollow() {
    const data = await unfollow(user.user.handle);

    if (data.success == true) {
      setOpenUnfollow(false);
      setFollowers((count) => count - 1);
      setFollowing(false);
    }
  }

  const profileHeader = (
    <div
      style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: "100" }}
      className="sticky top-[0.1px] backdrop-blur-xl px-4 py-1 flex gap-6"
    >
      <Link href="/" className="flex">
        <div className="flex px-2 rounded-full hover:bg-stone-900">
          <img
            src="/arrow-left.svg"
            alt="back"
            className="self-center w-6 h-6"
          />
        </div>
      </Link>
      <div className="flex flex-col">
        <div className="flex gap-1 items-center">
          <h2 className="leading-6 text-lg font-bold">{user.user.username}</h2>
          {user.user.verifiedCheckmark ? (
            <Checkmark className="w-[17px] h-[17px]" />
          ) : (
            <></>
          )}
        </div>
        {selected == "tweets" ? (
          tweets.length != 1 ? (
            <p className="text-sm text-secondary">{user.tweets} Tweets</p>
          ) : (
            <p className="text-sm text-secondary">{user.tweets} Tweet</p>
          )
        ) : selected == "comments" ? (
          replies.length != 1 ? (
            <p className="text-sm text-secondary">{user.replies} Replies</p>
          ) : (
            <p className="text-sm text-secondary">{user.replies} Reply</p>
          )
        ) : selected == "likes" ? (
          likes.length != 1 ? (
            <p className="text-sm text-secondary">{user.likes} Likes</p>
          ) : (
            <p className="text-sm text-secondary">{user.likes} Like</p>
          )
        ) : (
          <p>Error</p>
        )}
      </div>
    </div>
  );

  const profileDetails = (
    <div
      className={
        isMobile
          ? "flex flex-col w-full border-b border-gray-700/75"
          : "flex flex-col border-b border-gray-700/75"
      }
    >
      <div className="bg-stone-700 w-full h-[200px]">
        {user.user.cover_url ? (
          <img
            style={{ objectFit: "cover", objectPosition: "25% 25%" }}
            src={user.user.cover_url}
            alt="cover"
            className="w-full h-full overflow-hidden"
          />
        ) : (
          <></>
        )}
      </div>
      <div>
        <img
          src={user.user.profile_picture_url.replace(`"`, "").replace(",", "")}
          className="bg-red-400 h-[133px] w-[133px] rounded-full absolute top-[182px] ml-5 border-4 border-black"
        ></img>
      </div>
      <div className="px-4 pt-3 flex self-end h-[78px] gap-2">
        {userInfo && user.user._id != userInfo._id ? (
          <button
            onClick={handleConversation}
            className="px-4 h-9 rounded-full border border-secondary"
          >
            <img className="h-6 w-6" src="/email.svg"></img>
          </button>
        ) : (
          <></>
        )}
        {userInfo && user.user._id == userInfo._id ? (
          <button
            onClick={() => {
              setOpenEditProfile(true);
              document
                .querySelector("body")
                .classList.toggle("overflow-hidden");
            }}
            className="font-bold h-9 px-3 border border-secondary rounded-full"
          >
            Edit profile
          </button>
        ) : following == true ? (
          <button
            onMouseEnter={() => setFollowingHover(true)}
            onMouseLeave={() => setFollowingHover(false)}
            onClick={() => setOpenUnfollow(true)}
            className="font-bold hover:text-red-600 hover:bg-red-700/20 hover:border-red-600/40 h-9 px-4 rounded-full border border-secondary"
          >
            {followingHover == true ? (
              <span>Unfollow</span>
            ) : (
              <span>Following</span>
            )}
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="font-bold h-9 px-4 border bg-white rounded-full text-black"
          >
            Follow
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2 px-4 mb-4">
        <div>
          <div className="flex gap-1 items-center">
            <p className="leading-5 font-bold text-lg">{user.user.username}</p>
            {user.user.verifiedCheckmark ? (
              <Checkmark className="w-[17px] h-[17px] mt-[2px]" />
            ) : (
              <></>
            )}
          </div>
          <p className="text-secondary">@{user.user.handle}</p>
        </div>
        <div>
          <p>{user.user.bio}</p>
        </div>
        <div>
          <p className="text-secondary">
            Joined {format(new Date(user.user.registered_on), "MMMM yyyy")}
          </p>
        </div>
        <div className="flex gap-5">
          <Link href={`/user/${user.user.handle}/following`}>
            <p className="text-sm text-secondary">
              <span className="text-white font-bold">{user.following} </span>
              Following
            </p>
          </Link>
          <Link href={`/user/${user.user.handle}/followers`}>
            <p className="text-sm text-secondary">
              <span className="text-white font-bold">{followers} </span>
              Follower
            </p>
          </Link>
        </div>
      </div>
      <div className="flex">
        <div className="cursor-pointer justify-center hover:bg-zinc-800/75 flex font-bold self-start h-full flex-grow flex-basis">
          {selected == "tweets" ? (
            <div>
              <p className="py-[13.2px]">Tweets</p>
              <div className="h-[4.5px] w-[52px] rounded-full bg-sky-400"></div>
            </div>
          ) : (
            <div
              onClick={() => setSelected("tweets")}
              className="w-full flex self-center justify-center"
            >
              <p className="text-secondary py-4">Tweets</p>
            </div>
          )}
        </div>
        <div className="cursor-pointer font-bold hover:bg-zinc-800/75 flex justify-center flex-grow flex-basis">
          {selected == "comments" ? (
            <div>
              <p className="py-[13.2px]">Replies</p>
              <div className="h-[4.5px] w-[52px] rounded-full bg-sky-400"></div>
            </div>
          ) : (
            <div
              className="w-full flex self-center justify-center"
              onClick={() => {
                setSelected("comments");
                if (replies.length == 0) {
                  fetchComments();
                }
              }}
            >
              <p className="text-secondary py-4">Replies</p>
            </div>
          )}
        </div>
        <div className="cursor-pointer font-bold hover:bg-zinc-800/75 flex justify-center flex-grow flex-basis">
          {selected == "likes" ? (
            <div>
              <p className="py-[13.2px]">Likes</p>
              <div className="h-[4.5px] w-[39px] rounded-full bg-sky-400"></div>
            </div>
          ) : (
            <div
              className="w-full flex self-center justify-center"
              onClick={() => {
                setSelected("likes");
                if (likes.length == 0) {
                  fetchLikedTweets();
                }
              }}
            >
              <p className="text-secondary py-4">Likes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {user ? (
        <>
          {" "}
          <Head>
            <title>{user.user.username}</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <BrowserView>
            <div className="bg-black flex min-h-screen text-gray-200">
              <LeftSidebar />
              {openEditProfile == true ? (
                <EditProfile
                  userInfo={userInfo}
                  close={() => {
                    setOpenEditProfile(false);
                    document
                      .querySelector("body")
                      .classList.toggle("overflow-hidden");
                  }}
                />
              ) : (
                <></>
              )}
              {openUnfollow == true ? (
                <div className="fixed top-0 left-0 w-screen h-screen z-[1000]">
                  <div
                    style={{
                      boxShadow: "0 0 0 50vmax rgba(91, 112, 131, 0.4)",
                      transform: "translate(-50%, -50%)",
                    }}
                    className="p-7 w-[320px] max-h-[280px] h-full rounded-2xl absolute z-20 left-1/2 top-1/2 flex flex-col gap-6 bg-black text-white"
                  >
                    <div>
                      <h2 className="font-bold text-lg">
                        Unfollow @{user.user.handle}?
                      </h2>
                      <p className="text-secondary">
                        You will still be able to see their tweets, and you'll
                        be able to follow them back.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleUnfollow}
                        className="bg-white text-black py-2 rounded-full font-bold hover:bg-white/90 hover:text-black/90"
                      >
                        Unfollow
                      </button>
                      <button
                        onClick={() => setOpenUnfollow(false)}
                        className="border border-secondary py-2 rounded-full font-bold hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <main className="flex max-w-[575px] flex-grow flex-col border-r border-gray-700/75">
                <main className="flex flex-grow flex-col">
                  {profileHeader}
                  {profileDetails}
                  {selected == "tweets" ? (
                    tweets.map((item) => {
                      return (
                        <Tweet key={item._id} tweet={item.tweet} rest={item} />
                      );
                    })
                  ) : (
                    <></>
                  )}
                  {selected == "comments" ? (
                    replies.map((item) => {
                      return (
                        <>
                          <Tweet
                            key={item._id}
                            tweet={item.tweet}
                            rest={item.tweetStats}
                            bar={true}
                            reply={false}
                          />
                          <Tweet
                            key={item._id}
                            tweet={item.comment}
                            rest={item.commentStats}
                            reply={true}
                          />
                        </>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  {selected == "likes" ? (
                    likes.map((item) => {
                      return (
                        <Tweet
                          key={item.tweet._id}
                          tweet={item.tweet}
                          rest={item}
                        />
                      );
                    })
                  ) : (
                    <></>
                  )}
                  {tweetPageDetails.hasNextPage && selected == "tweets" ? (
                    <p
                      className="p-2 font-bold cursor-pointer hover:text-blue-300"
                      onClick={showMoreTweets}
                    >
                      Show more
                    </p>
                  ) : (
                    <></>
                  )}
                  {replyPageDetails.hasNextPage && selected == "comments" ? (
                    <p
                      className="p-2 font-bold cursor-pointer hover:text-blue-300"
                      onClick={fetchComments}
                    >
                      Show more
                    </p>
                  ) : (
                    <></>
                  )}
                  {likePageDetails.hasNextPage && selected == "likes" ? (
                    <p
                      className="p-2 font-bold cursor-pointer hover:text-blue-300"
                      onClick={fetchLikedTweets}
                    >
                      Show more
                    </p>
                  ) : (
                    <></>
                  )}
                </main>
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
            {profileHeader}
            <main className="flex-grow flex flex-col">
              {openEditProfile == true ? (
                <EditProfile
                  userInfo={userInfo}
                  close={() => {
                    setOpenEditProfile(false);
                    document
                      .querySelector("body")
                      .classList.toggle("overflow-hidden");
                  }}
                />
              ) : (
                <></>
              )}
              {profileDetails}{" "}
              {selected == "tweets" ? (
                tweets.map((item) => {
                  return (
                    <Tweet key={item._id} tweet={item.tweet} rest={item} />
                  );
                })
              ) : (
                <></>
              )}
              {selected == "comments" ? (
                replies.map((item) => {
                  return (
                    <>
                      <Tweet
                        key={item._id}
                        tweet={item.tweet}
                        rest={item.tweetStats}
                        bar={true}
                        reply={false}
                      />
                      <Tweet
                        key={item._id}
                        tweet={item.comment}
                        rest={item.commentStats}
                        reply={true}
                      />
                    </>
                  );
                })
              ) : (
                <></>
              )}
              {selected == "likes" ? (
                likes.map((item) => {
                  return (
                    <Tweet
                      key={item.tweet._id}
                      tweet={item.tweet}
                      rest={item}
                    />
                  );
                })
              ) : (
                <></>
              )}
              {tweetPageDetails.hasNextPage && selected == "tweets" ? (
                <p
                  className="p-2 font-bold cursor-pointer hover:text-blue-300"
                  onClick={showMoreTweets}
                >
                  Show more
                </p>
              ) : (
                <></>
              )}
              {replyPageDetails.hasNextPage && selected == "comments" ? (
                <p
                  className="p-2 font-bold cursor-pointer hover:text-blue-300"
                  onClick={fetchComments}
                >
                  Show more
                </p>
              ) : (
                <></>
              )}
              {likePageDetails.hasNextPage && selected == "likes" ? (
                <p
                  className="p-2 font-bold cursor-pointer hover:text-blue-300"
                  onClick={fetchLikedTweets}
                >
                  Show more
                </p>
              ) : (
                <></>
              )}
            </main>
            {userInfo ? <MobileBottomBar /> : <></>}
            {!userInfo ? (
              <div className="sticky px-4 py-2 bottom-0 flex flex-col w-full bg-blue-500">
                <div className="flex pb-2 flex-col flex-grow">
                  <p className="font-bold">
                    Find out what's happening right now.
                  </p>
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
      ) : (
        <p>The requested user doesn't exist.</p>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const auth = `Bearer ${context.req.cookies["token"]}`;

  const user = await fetch(
    `http://localhost:3000/api/user/${context.params.id}`,
    {
      headers: {
        Authorization: auth,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  if (user.user) {
    return {
      props: {
        user,
        fallback: true,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }
}
