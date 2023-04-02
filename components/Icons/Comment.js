import { useState } from "react";

export default function Comment({ className, stroke, useCurrentColor }) {
  const [hover, setHover] = useState(false);
  let hoverColor = "#1d9bf0";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <path
        d="M9 22a1 1 0 01-1-1v-3H4a2 2 0 01-2-2V4a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6.1l-3.7 3.71c-.2.19-.45.29-.7.29v0H9z"
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
