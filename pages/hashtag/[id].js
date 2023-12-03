import LeftSidebar from "@/components/LeftSidebar";
import MobileBottomBar from "@/components/MobileBottomBar";
import MobileTopBar from "@/components/MobileTopBar";
import NotLoggedInModal from "@/components/NotLoggedInModal";
import RightSidebar from "@/components/RightSidebar";
import Tweet from "@/components/Tweet";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useSelector } from "react-redux";
import Login from "@/components/Login";
import Register from "@/components/Register";

export async function getServerSideProps(context) {
  return {
    props: {
      params: context.params.id,
    },
  };
}

export default function Hashtag({ params }) {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    async function getTweets() {
      const token = localStorage.getItem("token");

      const data = await fetch(
        `https://wot-backend.onrender.com/api/tag/tweets/${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());

      setTweets(data.tweets);
      setLoading(false);
    }

    getTweets();
  }, []);

  return (
    <>
      <Head>
        <title>#{params} - Tag</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BrowserView>
        <div className="bg-black flex min-h-screen text-gray-200">
          <LeftSidebar />
          <main className="flex max-w-[600px] flex-grow flex-col border-r border-gray-700/75">
            <div
              style={{ backgroundColor: "rgba(0, 0, 0, .70)" }}
              className="py-1 pl-4 sticky top-0 flex flex-col backdrop-blur-[2px] z-[3]"
            >
              <h1 className="text-lg font-bold">#{params}</h1>
              <p className="text-sm text-secondary">{tweets.length} tweets</p>
            </div>
            {loading == true ? (
              <p>Loading...</p>
            ) : (
              tweets.map((item) => {
                return (
                  <Tweet key={item.tweet._id} tweet={item.tweet} rest={item} />
                );
              })
            )}
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
        <MobileTopBar
          children={
            <div className="flex flex-col px-3 pb-2">
              <h1 className="font-bold">#{params}</h1>
              <p className="text-sm text-secondary">{tweets.length} tweets</p>
            </div>
          }
        />
        <main className="flex-grow">
          {loading == true ? (
            <p>Loading...</p>
          ) : (
            tweets.map((item) => {
              return (
                <Tweet key={item.tweet._id} tweet={item.tweet} rest={item} />
              );
            })
          )}
        </main>
        <MobileBottomBar />
      </MobileView>
    </>
  );
}
