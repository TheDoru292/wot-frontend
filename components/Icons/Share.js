import { useState } from "react";

export default function Share({
  className,
  stroke,
  useCurrentColor,
  onClickFunc,
}) {
  const [hover, setHover] = useState(false);
  let hoverColor = "#1d9bf0";

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
        d="M21,12L14,5V9C7,10 4,15 3,20C5.5,16.5 9,14.9 14,14.9V19L21,12Z"
        stroke={
          useCurrentColor == true
            ? "currentColor"
            : hover == true
            ? hoverColor
            : stroke
        }
      />
    </svg>
  );
}
