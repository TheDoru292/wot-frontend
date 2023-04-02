import { useState } from "react";

export default function Bookmark({
  className,
  bookmarked,
  stroke,
  fill,
  useCurrentColor,
  onClickFunc,
}) {
  const [hover, setHover] = useState(false);
  let color = "#1d9bf0";

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
        d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"
        stroke={
          bookmarked == true
            ? color
            : useCurrentColor == true
            ? "currentColor"
            : hover == true
            ? color
            : stroke
        }
        fill={bookmarked == true ? color : fill}
      />
    </svg>
  );
}
