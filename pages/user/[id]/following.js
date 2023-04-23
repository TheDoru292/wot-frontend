import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import User from "@/components/User";
import { getUsersFollowing } from "@/lib/actions";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export async function getServerSideProps({ params }) {
  const user = await fetch(`http://localhost:3000/api/user/${params.id}`, {
    headers: {
      authorization: `Bearer ${process.env.TOKEN}`,
    },
  }).then((res) => res.json());

  return {
    props: {
      user,
    },
  };
}

export default function Following({ user }) {
  const [users, setUsers] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    async function getUsers() {
      const data = await getUsersFollowing(user.user.handle);

      setUsers(data.following);
    }

    getUsers();
  }, []);

  return (
    <div className="bg-black flex min-h-screen text-gray-200">
      <Head>
        <title>Following</title>
      </Head>
      <LeftSidebar />
      <main className="flex max-w-[575px] flex-grow flex-col">
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
                user={item.user.following}
                following={item.following}
                currentUser={userInfo}
              />
            );
          })}
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}
