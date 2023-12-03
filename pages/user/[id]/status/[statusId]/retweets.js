import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MobileView, isMobile } from "react-device-detect";
import { getTweetRetweets } from "@/lib/actions";
import Head from "next/head";
import MobileBottomBar from "@/components/MobileBottomBar";
import Link from "next/link";
import User from "@/components/User";
import { useSelector } from "react-redux";

export async function getServerSideProps({ context }) {
  return {
    props: {
      loaded: true,
    },
  };
}

export default function Likes() {
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const { userInfo } = useSelector((state) => state.auth);
  const { id, statusId } = router.query;

  useEffect(() => {
    if (!isMobile) {
      router.push(`/user/${id}/status/${statusId}`);
    }

    async function getUsers() {
      const data = await getTweetRetweets(statusId);

      if (!data.error && data.success) {
        setUsers(data.retweets);
      } else {
        setError(true);
      }
    }

    getUsers();
  }, []);

  return (
    <>
      <Head>
        <title>Likes</title>
      </Head>
      <MobileView className="bg-black min-h-screen text-white flex flex-col max-w-screen">
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
          className="w-full sticky flex flex-col top-[0.1px] backdrop-blur-xl pt-1 flex gap-1"
        >
          <div className="px-4 flex gap-6">
            <Link href={`/user/${id}/status/${statusId}`} className="flex">
              <div className="flex px-2 rounded-full hover:bg-stone-900">
                <img
                  src="/arrow-left.svg"
                  alt="back"
                  className="self-center w-6 h-6"
                />
              </div>
            </Link>
            <div className="flex flex-col items-center py-2">
              <h2 className="font-bold">Retweeted by</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          {users.map((item) => {
            return (
              <User
                key={item._id}
                user={item.user}
                following={item.following}
                currentUser={userInfo}
              />
            );
          })}
          {error ? (
            <p className="font-bold text-red-400 px-4">Failed to fetch users</p>
          ) : (
            <></>
          )}
        </div>
        <MobileBottomBar />
      </MobileView>
    </>
  );
}
