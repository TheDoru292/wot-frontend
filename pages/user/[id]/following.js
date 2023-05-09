import LeftSidebar from "@/components/LeftSidebar";
import MobileBottomBar from "@/components/MobileBottomBar";
import NotLoggedInModal from "@/components/NotLoggedInModal";
import RightSidebar from "@/components/RightSidebar";
import User from "@/components/User";
import { getUsersFollowing } from "@/lib/actions";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useSelector } from "react-redux";
import Login from "@/components/Login";
import Register from "@/components/Register";

export async function getServerSideProps({ params }) {
  const user = await fetch(
    `https://wot-backend-production.up.railway.app/api/user/${params.id}`,
    {
      headers: {
        authorization: `Bearer ${process.env.TOKEN}`,
      },
    }
  ).then((res) => res.json());

  return {
    props: {
      user,
    },
  };
}

export default function Following({ user }) {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    async function getUsers() {
      const data = await getUsersFollowing(user.user.handle);

      if (!data.error && data.success) {
        setUsers(data.following);
      } else {
        setError(true);
      }
    }

    getUsers();
  }, []);

  return (
    <>
      <Head>
        <title>Following</title>
      </Head>
      <BrowserView>
        <div className="bg-black flex min-h-screen text-gray-200">
          <LeftSidebar />
          <main className="flex max-w-[575px] flex-grow flex-col border-r border-gray-700/75">
            <div
              style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
              className="w-full sticky flex flex-col top-[0.1px] backdrop-blur-xl pt-1 flex gap-1 border-b border-gray-700/75"
            >
              <div className="px-4 flex gap-6">
                <Link href={`/user/${user.user.handle}`} className="flex">
                  <div className="flex px-2 rounded-full hover:bg-stone-900">
                    <img
                      src="/arrow-left.svg"
                      alt="back"
                      className="self-center w-6 h-6"
                    />
                  </div>
                </Link>{" "}
                <div className="flex flex-col">
                  <h2 className="leading-6 text-lg font-bold">
                    {user.user.username}
                  </h2>
                  <p className="text-sm text-secondary">@{user.user.handle}</p>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700/75">
                <Link
                  href={`/user/${user.user.handle}/followers`}
                  className="flex-grow flex-basis"
                >
                  <div className="justify-center text-secondary hover:bg-zinc-800/75 items-center flex font-bold h-full">
                    <div>
                      <p className="py-4">Followers</p>
                      <div className="h-[4.5px] w-[72px] rounded-full bg-inherit"></div>
                    </div>
                  </div>
                </Link>
                <Link
                  href={`/user/${user.user.handle}/following`}
                  className="flex-grow flex-basis"
                >
                  <div className="font-bold hover:bg-zinc-800/75 flex justify-center">
                    <div>
                      <p className="py-4">Following</p>
                      <div className="h-[4px] w-[72px] rounded-full bg-sky-400"></div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex flex-col">
              {users.map((item) => {
                return (
                  <User
                    key={item._id}
                    user={item.user.following}
                    following={item.following}
                    currentUser={userInfo}
                  />
                );
              })}
              {error ? (
                <p className="font-bold text-red-400 px-4">
                  Failed to fetch users.
                </p>
              ) : (
                <></>
              )}
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
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
          className="w-full sticky flex flex-col top-[0.1px] backdrop-blur-xl pt-1 flex gap-1 border-b border-gray-700/75"
        >
          <div className="px-4 flex gap-6">
            <Link href={`/user/${user.user.handle}`} className="flex">
              <div className="flex px-2 rounded-full hover:bg-stone-900">
                <img
                  src="/arrow-left.svg"
                  alt="back"
                  className="self-center w-6 h-6"
                />
              </div>
            </Link>{" "}
            <div className="flex flex-col">
              <h2 className="leading-6 text-lg font-bold">
                {user.user.username}
              </h2>
              <p className="text-sm text-secondary">@{user.user.handle}</p>
            </div>
          </div>
          <div className="flex w-full border-b border-gray-700/75">
            <Link
              href={`/user/${user.user.handle}/followers`}
              className="flex-grow flex-basis"
            >
              <div className="justify-center text-secondary hover:bg-zinc-800/75 items-center flex font-bold h-full">
                <div>
                  <p className="py-4">Followers</p>
                  <div className="h-[4.5px] w-[72px] rounded-full bg-inherit"></div>
                </div>
              </div>
            </Link>
            <Link
              href={`/user/${user.user.handle}/following`}
              className="flex-grow flex-basis"
            >
              <div className="font-bold hover:bg-zinc-800/75 flex justify-center">
                <div>
                  <p className="py-4">Following</p>
                  <div className="h-[4px] w-[72px] rounded-full bg-sky-400"></div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-grow flex-col">
          {users.map((item) => {
            return (
              <User
                key={item._id}
                user={item.user.following}
                following={item.following}
                currentUser={userInfo}
              />
            );
          })}
        </div>
        <MobileBottomBar />
      </MobileView>
    </>
  );
}
