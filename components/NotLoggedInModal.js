export default function NotLoggedInModal({ loginFunc, registerFunc }) {
  return (
    <div className="text-white sticky md:gap-0 gap-1 py-2 bottom-0 flex md:flex-row flex-col md:items-start md:justify-start bg-blue-500">
      <div className="lg:w-[200px] 2xl:w-[405px] flex-grow"></div>
      <div className="2xl:ml-[398px] lg:ml-[200px] px-2 word-wrap flex flex-col w-full">
        <p className="font-bold text-lg">
          Find out what's happening right now.
        </p>
        <p>With twitter you can quickly find out what's happening right now.</p>
      </div>
      <div className="flex h-full lg:w-full md:h-[52px] items-center gap-4 md:items-center justify-center">
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
