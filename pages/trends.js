import Head from "next/head";
import Link from "next/link";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { useEffect, useState } from "react";
import { getTagsFromBackend } from "@/lib/actions";
import { BrowserView, MobileView } from "react-device-detect";
import MobileBottomBar from "@/components/MobileBottomBar";
import NotLoggedInModal from "@/components/NotLoggedInModal";
import { useSelector } from "react-redux";
import Notification from "@/components/Notification";

export default function Trends() {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    async function getTags() {
      const data = await getTagsFromBackend();

      if (data.success) {
        setTags(data.tags);
      }

      if (data.error) {
        setError(true);
        setErrorMessage("Failed to get tags.");
      }
    }

    getTags();
  }, []);

  return (
    <>
      <BrowserView>
        <div className="bg-black flex min-h-screen text-gray-200">
          <Head>
            <title>Trends</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <LeftSidebar />
          <main className="flex max-w-[600px] flex-grow flex-col border-r border-gray-700/75">
            <div className="sticky top-[0.1px] flex px-4 py-1 gap-6 backdrop-blur-md">
              <Link href="/" className="flex">
                <div className="flex px-2 rounded-full hover:bg-stone-900">
                  <img
                    src="/arrow-left.svg"
                    alt="back"
                    className="self-center w-6 h-6"
                  />
                </div>
              </Link>
              <h1 className="py-2 text-lg font-bold">Trends</h1>
            </div>
            <div className="flex flex-col">
              {tags.map((item) => {
                return (
                  <Link href={`/hashtag/${item._id.replace("#", "")}`}>
                    <div key={item._id} className="px-4 py-2 hover:bg-white/5">
                      <p className="text-secondary text-sm">Trending</p>
                      <p className="font-bold">{item._id}</p>
                      <p className="text-secondary text-sm">
                        {item.number} tweets
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            {error ? <Notification errorMessage={errorMessage} /> : <></>}
          </main>
          <RightSidebar />
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
        <div className="sticky top-[0.1px] flex px-4 py-1 gap-6 backdrop-blur-md">
          <Link href="/" className="flex">
            <div className="flex px-2 rounded-full hover:bg-stone-900">
              <img
                src="/arrow-left.svg"
                alt="back"
                className="self-center w-6 h-6"
              />
            </div>
          </Link>
          <h1 className="py-2 text-lg font-bold">Trends</h1>
        </div>
        <div className="flex flex-grow flex-col">
          {tags.map((item) => {
            return (
              <Link href={`/hashtag/${item._id.replace("#", "")}`}>
                <div key={item._id} className="px-4 py-2 hover:bg-white/5">
                  <p className="text-secondary text-sm">Trending</p>
                  <p className="font-bold">{item._id}</p>
                  <p className="text-secondary text-sm">{item.number} tweets</p>
                </div>
              </Link>
            );
          })}
          {error ? <Notification errorMessage={errorMessage} /> : <></>}
        </div>
        <MobileBottomBar />
      </MobileView>
    </>
  );
}
