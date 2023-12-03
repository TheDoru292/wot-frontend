import Head from "next/head";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format, formatDistance } from "date-fns";
import { BrowserView, MobileView } from "react-device-detect";
import MobileBottomBar from "@/components/MobileBottomBar";
import MobileUserBar from "@/components/MobileUserBar";
import Notification from "@/components/Notification";
import Checkmark from "@/components/Icons/Checkmark";
import { useRouter } from "next/router";
import Link from "next/link";

const backendURL = "https://wot-backend.onrender.com";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [openUserBar, setOpenUserBar] = useState(false);
  const [error, setError] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      async function getNotifcations() {
        const token = localStorage.getItem("token");

        const data = await fetch(
          `${backendURL}/api/user/${userInfo.handle}/notifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then(async (res) => {
            const data = await res.json();

            setNotifications(data.notifications);
            setFilteredNotifications(data.notifications);
          })
          .catch((err) => setError(true));
      }

      getNotifcations();
    } else {
      router.push("/explore");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Notifications</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BrowserView>
        <div className="bg-black flex min-h-screen text-gray-200">
          <LeftSidebar />
          <main className="flex max-w-[600px] flex-grow flex-col border-r border-gray-700/75">
            <div className="sticky top-[0.1px] flex flex-col backdrop-blur-md">
              <h1 className="py-3 pl-4 text-lg font-bold">Notifications</h1>
            </div>
            <div className="flex flex-col">
              {filteredNotifications.map((item, i) => {
                if (item.action == "comment") {
                  return (
                    <div key={i} className="px-4 py-3 hover:bg-white/5"></div>
                  );
                }
                if (item.action == "follow") {
                  return (
                    <div
                      key={i}
                      className="px-3 py-3 hover:bg-white/5 border-b border-stone-700/75"
                    >
                      <div className="flex gap-3">
                        <Link href={`/user/${item.user.handle}`}>
                          <img
                            src={item.user.profile_picture_url
                              .replace(`"`, "")
                              .replace(",", "")}
                            alt=""
                            className="w-12 h-12 rounded-full"
                          />
                        </Link>
                        <div className="flex flex-col">
                          <p className="flex gap-1 font-bold">
                            <div className="flex gap-0.5 items-center">
                              <Link href={`/user/${item.user.handle}`}>
                                <span className="hover:underline cursor-pointer">
                                  {item.user.username}
                                </span>
                              </Link>
                              {item.user.verifiedCheckmark ? (
                                <Checkmark className="w-[17px] h-[17px] self-center" />
                              ) : (
                                <></>
                              )}
                            </div>
                            <Link href={`/user/${item.user.handle}`}>
                              <span className="cursor-pointer text-secondary font-normal">
                                @{item.user.handle} {"·"}
                              </span>
                            </Link>
                            <span className="text-secondary font-normal">
                              {formatDistance(new Date(item.date), new Date(), {
                                addSuffix: true,
                              })}
                            </span>
                          </p>
                          <p>
                            <span className="hover:text-sky-500 cursor-pointer">
                              {item.user.username}
                            </span>{" "}
                            is now following you!
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            {error ? (
              <Notification errorMessage="Failed to fetch notifications." />
            ) : (
              <></>
            )}
          </main>
          <RightSidebar />
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
        <div className="sticky top-[0.1px] gap-2 flex items-center px-2 backdrop-blur-md">
          <img
            onClick={(e) => {
              e.stopPropagation();
              setOpenUserBar(true);
            }}
            src={userInfo.profile_picture_url.replace(`"`, "").replace(",", "")}
            className="bg-red-400 w-[30px] h-[30px] rounded-full"
          />
          <h1 className="py-3 text-lg font-bold">Notifications</h1>
        </div>
        <main className="flex flex-grow flex-col">
          {filteredNotifications.map((item, i) => {
            if (item.action == "comment") {
              return <div key={i} className="px-4 py-3 hover:bg-white/5"></div>;
            }
            if (item.action == "follow") {
              return (
                <div
                  key={i}
                  className="px-3 py-3 hover:bg-white/5 border-b border-stone-700/75"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.user.profile_picture_url
                        .replace(`"`, "")
                        .replace(",", "")}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">
                        <span className="hover:underline cursor-pointer">
                          {item.user.username}
                        </span>{" "}
                        <span className="cursor-pointer text-secondary font-normal">
                          @{item.user.handle} {" · "}
                        </span>
                        <span className="text-secondary font-normal">
                          {formatDistance(new Date(item.date), new Date())}
                        </span>
                      </p>
                      <p>
                        <span className="hover:text-sky-500 cursor-pointer">
                          {item.user.username}
                        </span>{" "}
                        is now following you!
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
          {error ? (
            <Notification errorMessage="Failed to fetch notifications." />
          ) : (
            <></>
          )}
        </main>
        <MobileBottomBar />
      </MobileView>
    </>
  );
}
