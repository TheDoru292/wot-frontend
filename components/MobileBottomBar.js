import { useRouter } from "next/router";
import Link from "next/link";

export default function MobileBottomBar() {
  const router = useRouter();

  return (
    <div className="bg-black sticky px-4 py-2 bottom-0 border-t border-gray-700/75">
      <div className="flex">
        <div className="flex-grow flex justify-center flex-basis">
          <Link href={"/"}>
            <img
              src={router.asPath == "/" ? "/home-active.svg" : "/home.svg"}
              className="w-8 h-8"
            />
          </Link>
        </div>
        <div className="flex-grow flex justify-center flex-basis">
          <Link href={"/explore"}>
            <img src="/hashtag.svg" alt="" className="w-8 h-8" />
          </Link>
        </div>
        <div className="flex-grow flex justify-center flex-basis">
          <Link href={"/notifications"}>
            <img
              src={
                router.pathname == "/notifications"
                  ? "/bell-active.svg"
                  : "/bell.svg"
              }
              alt=""
              className="w-8 h-8"
            />
          </Link>
        </div>
        <div className="flex-grow flex justify-center flex-basis">
          <Link href={"/messages"}>
            <img
              src={
                router.pathname == "/messages"
                  ? "/email-active.svg"
                  : "/email.svg"
              }
              className="w-8 h-8"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
