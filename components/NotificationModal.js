import { useEffect } from "react";

export default function NotificationModal({ errorMessage, close }) {
  useEffect(() => {
    setTimeout(() => {
      close();
    }, 2000);
  }, []);

  return (
    <div className="rounded-lg bg-sky-600 px-4 py-2 my-2">
      <p>{errorMessage}</p>
    </div>
  );
}
