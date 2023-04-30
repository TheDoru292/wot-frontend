import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function MobileTopBar({ children, searchBar }) {
  const [search, setSearch] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, .60)" }}
      className="z-[10] sticky top-0 flex flex-col gap-1 backdrop-blur-md border-b border-gray-700/75"
    >
      <div className="flex w-full px-3 pt-2">
        <div
          className={
            router.pathname == "/index"
              ? "flex-grow flex-basis w-[30px] h-[30px]"
              : "w-[30px] h-[30px]"
          }
        >
          <img
            src={userInfo.profile_picture_url.replace(`"`, "").replace(",", "")}
            className="bg-red-400 w-[30px] h-[30px] rounded-full"
          />
        </div>
        {router.pathname == "/" ? (
          <>
            <div className="bg-red-400 w-[30px] h-[30px] rounded-full" />
            <div className="flex-basis flex-grow flex w-[30px] h-[30px]"></div>
          </>
        ) : router.asPath == "/search" ? (
          searchBar
        ) : (
          <div className="flex-grow flex px-2">
            <input
              type="text"
              name="search"
              id="search"
              className="w-full self-center py-2 px-4 h-[25px] bg-[#202327] rounded-full text-gray-400 placeholder:text-gray-400"
              placeholder="Search Wot"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  router.push(`/search?q=${search.split(" ").join("+")}`);
                }
              }}
            />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
