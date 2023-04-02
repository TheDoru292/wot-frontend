import { postTweet } from "@/lib/actions";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function PostTweet({ changeArray }) {
  const [tweetContent, setTweetContent] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  async function post() {
    const data = await postTweet(tweetContent);

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
        },
        bookmarked: false,
        following: false,
        liked: false,
        retweeted: false,
        comments: { count: 0 },
        likes: { count: 0 },
        retweets: { count: 0 },
      };

      changeArray(obj);
      setTweetContent("");
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
        <div className="flex">
          <div className="flex flex-grow gap-2">
            <p>Image</p>
            <p>Gif</p>
            <p>Poll</p>
            <p>Location</p>
          </div>
          <button
            disabled={tweetContent.length == 0 ? true : false}
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
