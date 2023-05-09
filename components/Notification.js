export default function Notification({ errorMessage }) {
  return (
    <div className="flex justify-center">
      <p className="text-red-400 font-bold">{errorMessage}</p>
    </div>
  );
}
