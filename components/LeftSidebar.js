import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import Menu from "./Icons/Menu";
import Checkmark from "./Icons/Checkmark";

export default function LeftSidebar() {
  const [openMenu, setOpenMenu] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const menuRef = useRef();

  const router = useRouter();

  const list = [
    {
      name: "Home",
      link: "/",
      icon: "/home.svg",
      active: router.pathname == "/" ? true : false,
      activeIcon: "/home-active.svg",
      showIfNotLogged: false,
    },
    {
      name: "Explore",
      link: "/explore",
      icon: "/hashtag.svg",
      active:
        router.pathname == "/explore" || router.pathname == "/search"
          ? true
          : false,
      activeIcon: "/hashtag.svg",
      showIfNotLogged: true,
    },
    {
      name: "Notifications",
      link: "/notifications",
      icon: "/bell.svg",
      active: router.pathname == "/notifications" ? true : false,
      activeIcon: "/bell-active.svg",
      showIfNotLogged: false,
    },
    {
      name: "Messages",
      link: "/messages",
      icon: "/email.svg",
      active: router.pathname == "/messages" ? true : false,
      activeIcon: "/email-active.svg",
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
      name: "Profile",
      link: `/user/${userInfo?.handle}`,
      icon: "/account.svg",
      active: router.asPath == `/user/${userInfo?.handle}` ? true : false,
      activeIcon: "/account-active.svg",
      showIfNotLogged: false,
    },
  ];

  function closeOpenMenu(e) {
    if (menuRef.current && openMenu && !menuRef.current.contains(e.target)) {
      setOpenMenu(false);
    }
  }

  document.addEventListener("mousedown", closeOpenMenu);

  if (userInfo) {
    return (
      <>
        <div className="overflow-y-auto sticky top-0 h-screen justify-end flex w-[405px] border-r border-gray-700/75 max-[1300px]:w-[86px]">
          <div className="flex gap-5 flex-col w-[245px] max-[1300px]:w-full">
            <div className="flex w-full justify-start pt-3 px-[6px] max-[1300px]:p-0 max-[1300px]:pt-3 max-[1300px]:justify-center">
              <div className="self-center self-end bg-red-400 w-10 h-10 rounded-full"></div>
            </div>
            <div className="flex flex-grow items-start flex-col gap-2 mr-3 max-[1300px]:items-center max-[1300px]:mx-1">
              {list.map((item) => {
                if (!userInfo && item.showIfNotLogged == false) {
                } else {
                  return (
                    <Link
                      key={item.name}
                      href={item.link}
                      className="flex gap-5 px-3 rounded-full py-2 hover:bg-stone-900 w-max max-[1300px]:px-2"
                    >
                      <Image
                        alt="icon"
                        src={item.active == false ? item.icon : item.activeIcon}
                        width={8}
                        height={8}
                        className="w-8 h-8"
                      ></Image>
                      {item.active == false ? (
                        <p className="block text-lg max-[1300px]:hidden">
                          {item.name}
                        </p>
                      ) : (
                        <p className="block text-lg font-black max-[1300px]:hidden">
                          {item.name}
                        </p>
                      )}
                    </Link>
                  );
                }
              })}
              {!userInfo ? (
                <></>
              ) : (
                <div className="mr-14 flex w-full max-[1300px]:hidden">
                  <button
                    disabled={true}
                    title="Tweeting with this button is disabled at this time, please use the home page instead."
                    className="ml-2 py-3 rounded-full w-full bg-sky-600 disabled:bg-sky-600/50 disabled:text-white/50 hover:bg-sky-700 font-bold"
                  >
                    Tweet
                  </button>
                </div>
              )}
            </div>
            {openMenu == true ? (
              <div
                ref={menuRef}
                style={{ boxShadow: "0 0 3px #fff" }}
                className="flex rounded-lg fixed bottom-[66px] bg-black"
              >
                <Link href={"/logout"} className="w-full hover:bg-stone-700/20">
                  <button className="font-bold px-4 py-2">Logout</button>
                </Link>
              </div>
            ) : (
              <></>
            )}
            {!userInfo ? (
              <></>
            ) : (
              <div
                onClick={() => {
                  if (openMenu == false) {
                    setOpenMenu(true);
                  } else {
                    setOpenMenu(false);
                  }
                }}
                className="w-full cursor-pointer flex self-start px-[2px] pr-3 pl-2 pt-1 pb-1 gap-2 rounded-full hover:bg-stone-900 max-[1300px]:w-max max-[1300px]:mb-3 max-[1300px]:m-0 max-[1300px]:p-0 mb-3 max-[1300px]:self-center max-[1300px]:justify-center"
              >
                <img
                  src={userInfo.profile_picture_url
                    .replace(`"`, "")
                    .replace(",", "")}
                  className="bg-red-400 w-11 h-11 rounded-full"
                  alt=""
                />
                <div className="flex flex-grow flex-col max-[1300px]:hidden">
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
                <div className="self-center block hidden">
                  <Menu fill="#fff" />
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="overflow-y-auto sticky top-0 h-screen justify-end flex w-[405px] border-r border-gray-700/75 max-[1300px]:w-[86px]">
        <div className="flex gap-5 flex-col w-[245px] max-[1300px]:w-full">
          <div className="flex w-full justify-start pt-3 px-[6px] max-[1300px]:p-0 max-[1300px]:pt-3 max-[1300px]:justify-center">
            <div className="self-center self-end bg-red-400 w-10 h-10 rounded-full"></div>
          </div>
          <div className="flex flex-grow items-start flex-col gap-2 mr-3 max-[1300px]:items-center max-[1300px]:mx-1">
            {list.map((item) => {
              if (!userInfo && item.showIfNotLogged == false) {
              } else {
                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    className="flex gap-5 px-3 rounded-full py-2 hover:bg-stone-900 w-max max-[1300px]:px-2"
                  >
                    <Image
                      alt="icon"
                      src={item.active == false ? item.icon : item.activeIcon}
                      width={8}
                      height={8}
                      className="w-8 h-8"
                    ></Image>
                    {item.active == false ? (
                      <p className="block text-lg max-[1300px]:hidden">
                        {item.name}
                      </p>
                    ) : (
                      <p className="block text-lg font-black max-[1300px]:hidden">
                        {item.name}
                      </p>
                    )}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}
