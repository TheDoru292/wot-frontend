export default function NotLoggedInModal({ loginFunc, registerFunc }) {
  return (
    <div className="text-white sticky md:gap-0 gap-1 py-2 bottom-0 flex md:flex-row flex-col items-center md:items-start md:justify-start bg-blue-500">
      <div className="lg:w-[200px] 2xl:w-[405px]"></div>
      <div className="px-2 word-wrap flex flex-col w-full">
        <p className="font-bold text-lg">
          Find out what's happening right now.
        </p>
        <p>With twitter you can quickly find out what's happening right now.</p>
      </div>
      <div className="flex w-full h-full items-center gap-4 w-[540px] justify-center">
        <button
          onClick={loginFunc}
          className="bg-inherit border rounded-full h-9 w-[76px] font-bold"
        >
          Log in
        </button>
        <button
          onClick={registerFunc}
          className="bg-white text-black font-bold border rounded-full h-9 w-[132px]"
        >
          Create account
        </button>
      </div>
    </div>
  );
}
