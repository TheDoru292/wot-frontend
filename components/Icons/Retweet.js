import { useState } from "react";

export default function Retweet({
  className,
  retweeted,
  fill,
  useCurrentColor,
  onClickFunc,
}) {
  const [hover, setHover] = useState(false);
  let hoverColor = "#00ba7c";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClickFunc}
    >
      <path
        d="M6 5.75L10.25 10H7v6h6.5l2 2H7a2 2 0 01-2-2v-6H1.75L6 5.75m12 12.5L13.75 14H17V8h-6.5l-2-2H17a2 2 0 012 2v6h3.25L18 18.25z"
        fill={
          retweeted == true
            ? "#00ba7c"
            : useCurrentColor == true
            ? "currentColor"
            : hover == true
            ? hoverColor
            : fill
        }
      />
    </svg>
  );
}
