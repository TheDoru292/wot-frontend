import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Tweet from "@/components/Tweet";
import Head from "next/head";
import { useEffect, useState } from "react";

export async function getServerSideProps(context) {
  return {
    props: {
      params: context.params.id,
    },
  };
}

export default function Hashtag({ params }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTweets() {
      const token = localStorage.getItem("token");

      const data = await fetch(
        `http://localhost:3000/api/tag/tweets/${params}`,
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
    <div className="bg-black flex min-h-screen text-gray-200">
      <Head>
        <title>{params} - Tag</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LeftSidebar />
      <main className="flex max-w-[575px] flex-grow flex-col">
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: "100" }}
          className="sticky top-0 backdrop-blur-xl px-4 py-1 h-[52px] flex flex-col mb-2"
        >
          <h2 className="font-bold text-lg">#{params}</h2>
          <p className="text-secondary">{tweets.length} tweets</p>
        </div>
        {loading == true ? (
          <p>Loading...</p>
        ) : (
          tweets.map((item) => {
            return <Tweet tweet={item.tweet} rest={item} />;
          })
        )}
      </main>
      <RightSidebar />
    </div>
  );
}
