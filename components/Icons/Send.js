export default function Send({
  fillColor,
  className,
  messageContent,
  sendFunc,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={messageContent.length == 0 ? "#1678ba" : fillColor}
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
    </svg>
  );
}
