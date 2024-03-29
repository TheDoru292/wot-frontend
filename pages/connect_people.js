import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import User from "@/components/User";
import { getConnectUsers } from "@/lib/actions";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserView, MobileView } from "react-device-detect";
import MobileBottomBar from "@/components/MobileBottomBar";
import { useRouter } from "next/router";

export default function Connect() {
  const { userInfo } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [connectError, setConnectError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      async function getUsers() {
        const data = await getConnectUsers(userInfo.handle);

        if (!data.error && data.success) {
          setUsers(data.users);
        } else {
          setConnectError(true);
        }
      }

      getUsers();
    } else {
      router.push("/explore");
    }
  }, []);

  return (
    <>
      <BrowserView>
        <div className="bg-black flex min-h-screen text-gray-200">
          <Head>
            <title>Connect / Wut</title>
          </Head>
          <LeftSidebar />
          <main className="flex max-w-[600px] flex-grow flex-col border-r border-gray-700/75">
            <div
              style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
              className="w-full sticky flex flex-col top-[0.1px] backdrop-blur-xl pt-1 flex gap-1"
            >
              <div className="px-4 py-1 flex gap-6">
                <Link href={`/`} className="flex">
                  <div className="flex px-2 py-2 rounded-full hover:bg-stone-900">
                    <img
                      src="/arrow-left.svg"
                      alt="back"
                      className="self-center w-6 h-6"
                    />
                  </div>
                </Link>
                <div className="flex py-2 flex-col">
                  <h2 className="leading-6 text-lg font-bold">Connect</h2>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              {users.map((item) => {
                return (
                  <User
                    key={item.user._id}
                    user={item.user}
                    following={item.following}
                    currentUser={userInfo}
                  />
                );
              })}
              {connectError ? (
                <p className="px-4 font-bold text-red-400">
                  Failed to fetch users.
                </p>
              ) : (
                <></>
              )}
            </div>
          </main>
          <RightSidebar />
        </div>
      </BrowserView>
      <MobileView className="bg-black min-h-screen text-white flex flex-col max-w-screen">
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
          className="w-full sticky flex flex-col top-[0.1px] backdrop-blur-xl pt-1 flex gap-1"
        >
          <div className="px-4 py-1 flex gap-6">
            <Link href={`/`} className="flex">
              <div className="flex px-2 py-2 rounded-full hover:bg-stone-900">
                <img
                  src="/arrow-left.svg"
                  alt="back"
                  className="self-center w-6 h-6"
                />
              </div>
            </Link>
            <div className="flex py-2 flex-col">
              <h2 className="leading-6 text-lg font-bold">Connect</h2>
            </div>
          </div>
        </div>
        <main className="flex-grow">
          <div className="flex flex-col">
            {users.map((item) => {
              return (
                <User
                  key={item.user._id}
                  user={item.user}
                  following={item.following}
                  currentUser={userInfo}
                />
              );
            })}
            {connectError ? (
              <p className="px-4 font-bold text-red-400">
                Failed to fetch users.
              </p>
            ) : (
              <></>
            )}
          </div>
        </main>
        <MobileBottomBar />
      </MobileView>
    </>
  );
}
