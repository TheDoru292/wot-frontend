import { postTweet } from "@/lib/actions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GiphyFetch } from "@giphy/js-fetch-api";
import Gif from "./Icons/Gif";

export default function PostTweet({
  changeArray,
  setGifMenu,
  gifId,
  setGifId,
}) {
  const [tweetContent, setTweetContent] = useState("");
  const [gif, setGif] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  const gf = new GiphyFetch("AkO9AeIcPXbtD5m61zBn0IFSqCBxuk8M");

  async function getGif() {
    if (gifId) {
      const { data } = await gf.gif(gifId);

      setGif(data);

      console.log(gif);
    }
  }

  useEffect(() => {
    getGif();
  }, [gifId]);

  async function post() {
    const data = await postTweet(tweetContent, gif.images.original.url);

    if (data.success == true) {
      const obj = {
        tweet: {
          _id: data.tweet._id,
          content: data.tweet.content,
          posted_on: data.tweet.posted_on,
          user: {
            username: userInfo.username,
            handle: userInfo.handle,
            profile_picture_url: userInfo.profile_picture_url,
            verifiedCheckmark: userInfo.verifiedCheckmark,
            bio: userInfo.bio,
          },
          giphyUrl: gif.images.original.url,
        },
        bookmarked: false,
        following: false,
        liked: false,
        retweeted: false,
        comments: 0,
        likes: 0,
        retweets: 0,
      };

      changeArray(obj);
      setTweetContent("");
      setGif({});
      setGifId(null);
    }
  }

  return (
    <div className="flex py-3 pb-2 px-4 gap-4 border-b border-gray-700/75">
      <img
        src={userInfo?.profile_picture_url.replace(`"`, "").replace(",", "")}
        className="bg-red-400 w-12 h-12 rounded-full"
        alt=""
      />
      <div className="flex flex-col flex-grow">
        <textarea
          name="tweet"
          id="tweet"
          className="bg-inherit text-lg placeholder:text-secondary resize-none outline-none"
          placeholder="What's happening?"
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
        />
        {gif && gif.images ? (
          <div className="relative pb-2">
            <button
              style={{
                backgroundColor: "rgba(15, 20, 25, 0.75)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => {
                setGifId(null);
                setGif(null);
              }}
              className="absolute mt-2 ml-2 p-1 hover:bg-white cursor-pointer bg-black rounded-full"
            >
              <img src="/close.svg" className="w-6 h-6" />
            </button>
            <p className="absolute bottom-0 mb-4 ml-2 px-1 rounded-md font-bold bg-black w-min-content h-min-content">
              GIF
            </p>
            <img src={gif.images.original.url} className="w-full rounded-xl" />
          </div>
        ) : (
          <></>
        )}
        <div className="flex">
          <div className="flex flex-grow gap-2">
            <p>Image</p>
            <Gif
              className={!gif ? "w-8 h-8 cursor-pointer" : "w-8 h-8"}
              onClick={() => {
                if (!gif) {
                  setGifMenu(true);
                }
              }}
              stroke={!gif ? "#38bdf8" : "#2786b0"}
            />
            <p>Poll</p>
            <p>Location</p>
          </div>
          <button
            disabled={tweetContent.length >= 3 || gif ? false : true}
            onClick={post}
            className="disabled:bg-sky-400/50 disabled:text-white/50 bg-sky-400/[.85] py-[5px] px-4 rounded-full font-bold"
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}
