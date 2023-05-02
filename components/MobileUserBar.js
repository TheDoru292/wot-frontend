import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Checkmark from "./Icons/Checkmark";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function MobileUserBar({ close, openUserBar }) {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    document.querySelector("body").classList.toggle("overflow-hidden");

    return () =>
      document.querySelector("body").classList.toggle("overflow-hidden");
  }, []);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (
        menuRef.current &&
        openUserBar &&
        !menuRef.current.contains(e.target)
      ) {
        close();
      }
    });

    setInitialized(true);

    return () => {
      document.removeEventListener("click", (e) => {
        if (
          menuRef.current &&
          openUserBar &&
          !menuRef.current.contains(e.target)
        ) {
          close();
        }
      });

      setInitialized(false);
    };
  }, []);

  const list = [
    {
      name: "Profile",
      link: `/user/${userInfo?.handle}`,
      icon: "/account.svg",
      active: router.asPath == `/user/${userInfo?.handle}` ? true : false,
      activeIcon: "/account-active.svg",
      showIfNotLogged: false,
    },
    {
      name: "Bookmarks",
      link: "/bookmarks",
      icon: "/bookmark.svg",
      active: router.pathname == "/bookmarks" ? true : false,
      activeIcon: "/bookmark-active.svg",
      showIfNotLogged: false,
    },
    {
      name: "Logout",
      link: "/logout",
      icon: "/logout.svg",
      active: false,
    },
  ];

  return (
    <div className="fixed w-screen h-screen z-[20]">
      <div
        style={{
          boxShadow: "0 0 0 50vmax rgba(91, 112, 131, 0.4)",
        }}
        ref={menuRef}
        className="animate-[slideIn_2s_forwards] absolute top-0 h-full w-full max-w-[280px] bg-black"
      >
        <div className="overflow-auto max-w-[280px] flex flex-col gap-2">
          <div className="flex px-3 py-3 items-center">
            <p className="flex-grow">Account info</p>
            <Image src={"/close.svg"} width={20} height={20} onClick={close} />
          </div>
          <div className="px-3">
            <img
              src={userInfo.profile_picture_url
                .replace(`"`, "")
                .replace(",", "")}
              className="self-center bg-red-400 w-[38px] h-[38px] rounded-full"
              alt=""
            />
            <div className="flex gap-1 items-center">
              <p className="font-bold">{userInfo.username}</p>
              {userInfo.verifiedCheckmark ? (
                <Checkmark className="w-[17px] h-[17px] self-center mt-[3px]" />
              ) : (
                <></>
              )}
            </div>
            <p className="text-secondary">@{userInfo.handle}</p>
          </div>
          <div>
            {list.map((item) => {
              if (!userInfo && item.showIfNotLogged == false) {
              } else {
                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    className="flex mb-2 gap-5 px-3 py-2 hover:bg-stone-900 w-full"
                  >
                    <Image
                      alt="icon"
                      src={item.active == false ? item.icon : item.activeIcon}
                      width={6}
                      height={6}
                      className="w-8 h-8"
                    ></Image>
                    {item.active == false ? (
                      <p className="text-lg">{item.name}</p>
                    ) : (
                      <p className="text-lg font-black">{item.name}</p>
                    )}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
