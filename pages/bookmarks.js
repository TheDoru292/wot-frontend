import Head from "next/head";
import Tweet from "@/components/Tweet";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserView, MobileView } from "react-device-detect";
import MobileBottomBar from "@/components/MobileBottomBar";
import { useRouter } from "next/router";

const backendURL = "https://wot-backend.onrender.com";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      async function getBookmarks() {
        const token = localStorage.getItem("token");

        const data = await fetch(`${backendURL}/api/bookmark`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(async (res) => {
            const data = await res.json();

            if (data.success) {
              setBookmarks(data.bookmarks);
            } else {
              setError(true);
            }
          })
          .catch((err) => setError(true));
      }

      getBookmarks();
    } else {
      router.push("/explore");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Bookmarks</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BrowserView>
        <div className="bg-black flex min-h-screen text-gray-200">
          <LeftSidebar />
          <main className="flex max-w-[600px] flex-grow flex-col border-r border-gray-700/75">
            <div className="py-1 pl-4 sticky top-[0.1px] flex flex-col backdrop-blur-md">
              <h1 className="text-lg font-bold">Bookmarks</h1>
              <p className="text-sm text-secondary">@{userInfo.handle}</p>
            </div>
            {bookmarks.map((item) => {
              return <Tweet key={item._id} tweet={item.tweet} rest={item} />;
            })}
            {!error & (bookmarks.length == 0) ? (
              <p className="px-4">You don't have any tweets bookmarked!</p>
            ) : (
              <></>
            )}
            {error ? (
              <p className="text-red-400 font-bold px-4">
                Failed to fetch bookmarks
              </p>
            ) : (
              <></>
            )}
          </main>
          <RightSidebar />
        </div>
      </BrowserView>
      <MobileView className="bg-black min-h-screen text-white flex flex-col max-w-screen">
        <div className="py-1 pl-4 sticky top-[0.1px] flex flex-col backdrop-blur-md">
          <h1 className="text-lg font-bold">Bookmarks</h1>
          <p className="text-sm text-secondary">@{userInfo.handle}</p>
        </div>
        <main className="flex-grow">
          {bookmarks.map((item) => {
            return <Tweet key={item._id} tweet={item.tweet} rest={item} />;
          })}
          {error ? (
            <p className="text-red-400 font-bold px-4">
              Failed to fetch bookmarks
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
