import { userLogin } from "@/redux/auth/authActions";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function Login({ close, register }) {
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");

  const { userInfo, userToken, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      window.location.replace("/");
    }
  }, [userInfo]);

  function login(e) {
    e.preventDefault();

    dispatch(userLogin({ handle, password }));
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50">
      <div
        style={{
          boxShadow: "0 0 0 50vmax rgba(91, 112, 131, 0.4)",
          transform: "translate(-50%, -50%)",
        }}
        className="w-[600px] max-h-[650px] h-full rounded-2xl absolute z-20 left-1/2 top-1/2 flex flex flex-col gap-3 bg-black text-white"
      >
        <div className="flex justify-center py-3 px-5">
          <img
            src="close.svg"
            className="fixed left-0 pl-5 h-10 w-10 cursor-pointer"
            alt="close"
            onClick={close}
          ></img>
          <div className="bg-red-400 rounded-full h-10 w-10"></div>
        </div>
        <div className="max-w-[348px] w-full px-[32px] justify-center self-center">
          <div className="flex flex-col gap-8">
            <p className="font-bold text-2xl">Log in Wut</p>
            <button className="mb-2 bg-white font-bold text-black w-full py-[6.5px] rounded-full">
              Guest Login
            </button>
          </div>
          <div className="flex gap-2 mb-2">
            <div className="flex-basis flex-grow flex">
              <div className="w-full h-[1px] bg-secondary/50 self-center"></div>
            </div>
            <div style={{ flexBasis: "auto" }}>
              <p>or</p>
            </div>
            <div className="flex-basis flex-grow flex">
              <div className="w-full h-[1px] bg-secondary/50 self-center"></div>
            </div>
          </div>
          <div className="flex flex-col gap-3 mb-6">
            <div>
              <input
                type="text"
                placeholder="Handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="bg-inherit rounded-sm placeholder:text-secondary border border-secondary/50 w-full h-10 p-2"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-inherit rounded-sm placeholder:text-secondary border border-secondary/50 w-full h-10 p-2"
              />
            </div>
          </div>
          <div className="mb-12">
            <button
              onClick={login}
              disabled={handle != "" && password != "" ? false : true}
              className="py-[6.5px] bg-white w-full font-bold text-black rounded-full disabled:bg-white/75"
            >
              Log in
            </button>
          </div>
          <div>
            <p className="text-secondary">
              Or in the case you don't have an account, you can{" "}
              <span className="text-blue-400 cursor-pointer" onClick={register}>
                register
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
