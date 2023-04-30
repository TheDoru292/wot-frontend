import { editState } from "@/redux/auth/authActions";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";

export default function EditProfile({ userInfo, close }) {
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    userInfo.profile_picture_url
  );
  const [coverUrl, setCoverUrl] = useState(userInfo.cover_url || "");
  const [username, setUsername] = useState(userInfo.username);
  const [bio, setBio] = useState(userInfo.bio);
  const [handle, setHandle] = useState(userInfo.handle);
  const [pfpError, setPfpError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  function save() {
    dispatch(
      editState({ pfpLink: profilePictureUrl, coverUrl, username, bio })
    );
    close();
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
        <div
          style={{ backgroundColor: "rgb(0,0,0,0.65)" }}
          className="sticky w-full z-[999] top-0 items-center py-3 px-3 flex gap-9"
        >
          <img
            className="w-5 h-5 cursor-pointer"
            onClick={close}
            src="/close.svg"
            alt=""
          />
          <div className="flex-grow">
            <p className="font-bold text-lg">Edit Profile</p>
          </div>
          <button
            onClick={save}
            className="hover:bg-white/95 bg-white text-black px-3 py-1 rounded-full font-bold"
          >
            Save
          </button>
        </div>
        <div className="flex-grow">
          <div className="flex flex-col border-b border-gray-700/75">
            <div className="bg-stone-700 h-[200px]">
              <img
                style={{ objectFit: "cover", objectPosition: "25% 25%" }}
                src={coverUrl.replace(`"`, "").replace(",", "")}
                alt="cover"
                className="w-full h-full overflow-hidden"
                onError={() => {
                  setCoverError(true);
                }}
                onLoad={() => setCoverError(false)}
              />
            </div>
            <div>
              <img
                src={profilePictureUrl.replace(`"`, "").replace(",", "")}
                className="bg-red-400 h-[133px] w-[133px] rounded-full absolute top-[182px] ml-5 border-4 border-black"
                onError={() => {
                  setPfpError(true);
                }}
                onLoad={() => setPfpError(false)}
              ></img>
            </div>
          </div>
          <div className="h-[70px]"></div>
          <div className="px-3 pb-3 flex flex-col gap-5">
            <div>
              <p className="text-secondary pb-1">Username</p>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-inherit border w-full px-2 py-2 rounded-sm outline-none focus:border placeholder:text-secondary focus:border-sky-600 border-gray-700/75"
              />
            </div>
            <div>
              <p className="text-secondary pb-1">Bio</p>
              <textarea
                name="bio"
                id="bio"
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="resize-none bg-inherit border w-full px-2 py-2 rounded-sm outline-none focus:border placeholder:text-secondary focus:border-sky-600 border-gray-700/75"
              ></textarea>
            </div>
            <div>
              <p className="text-secondary pb-1">Profile Picture (url)</p>
              {pfpError ? (
                <p className="text-red-500 font-bold pb-1">
                  Error loading profile picture!
                </p>
              ) : (
                <></>
              )}
              <input
                type="text"
                placeholder="Profile picture"
                value={profilePictureUrl.replace(`"`, "").replace(",", "")}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                className="bg-inherit border w-full px-2 py-2 rounded-sm outline-none focus:border placeholder:text-secondary focus:border-sky-600 border-gray-700/75"
              />
            </div>
            <div>
              <p className="text-secondary pb-1">Cover (url)</p>
              {coverError && coverUrl != "" ? (
                <p className="text-red-500 font-bold pb-1">
                  Error loading profile picture!
                </p>
              ) : (
                <></>
              )}
              <input
                type="text"
                placeholder="Cover"
                value={coverUrl.replace(`"`, "").replace(",", "")}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="bg-inherit border w-full px-2 py-2 rounded-sm outline-none focus:border placeholder:text-secondary focus:border-sky-600 border-gray-700/75"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
