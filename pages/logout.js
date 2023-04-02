import { logout } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

export default function Signout() {
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("token");

    dispatch(logout());

    window.location.replace("/");

    Cookies.remove("token");
  });

  return <p>Logging out...</p>;
}
