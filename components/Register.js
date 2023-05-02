import { registerUser } from "@/redux/auth/authActions";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";

export default function Register({ close }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const { userInfo, error, success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (success || userInfo) {
      router.push("/");
      document.querySelector("body").classList.toggle("overflow-hidden");
    }
  }, [success, userInfo]);

  function register(e) {
    e.preventDefault();

    const data = {
      username: username,
      password,
      handle,
      profile_picture_url: profilePictureUrl,
    };

    dispatch(registerUser(data));
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[999]">
      <div
        style={{
          boxShadow: "0 0 0 50vmax rgba(91, 112, 131, 0.4)",
          transform: "translate(-50%, -50%)",
        }}
        className={
          !isMobile
            ? "overflow-y-scroll w-[600px] max-h-[650px] h-full rounded-2xl absolute z-20 left-1/2 top-1/2 flex flex-col bg-black text-white"
            : "overflow-y-scroll max-h-[400px] w-full rounded-2xl absolute z-20 left-1/2 top-1/2 flex flex-col bg-black text-white"
        }
      >
        <div className="flex gap-5 py-3">
          <img
            onClick={() => {
              close();
              document
                .querySelector("body")
                .classList.toggle("overflow-hidden");
            }}
            src="close.svg"
            className="pl-5 h-10 w-10 cursor-pointer"
            alt="close"
          ></img>
          <p className="pt-[6px] font-bold">Create Account</p>
        </div>
        <div
          className={
            !isMobile
              ? "flex flex-col px-24 gap-6 h-full"
              : "flex flex-col px-4 gap-6 h-full"
          }
        >
          <div>
            <p className="font-bold text-2xl">Create Account</p>
          </div>
          <div className="gap-4 flex flex-col flex-grow">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-inherit rounded-sm placeholder:text-secondary border border-secondary/50 w-full h-12 p-2"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="bg-inherit rounded-sm placeholder:text-secondary border border-secondary/50 w-full h-12 p-2"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-inherit rounded-sm placeholder:text-secondary border border-secondary/50 w-full h-12 p-2"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Profile picture url"
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                className="bg-inherit rounded-sm placeholder:text-secondary border border-secondary/50 w-full h-12 p-2"
              />
            </div>
          </div>
          <div className="pb-6">
            <button
              onClick={register}
              className="w-full font-bold bg-white h-12 rounded-full text-black"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
