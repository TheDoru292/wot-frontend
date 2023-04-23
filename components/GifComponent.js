import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager,
} from "@giphy/react-components";
import { useContext } from "react";

export default function SearchExperience({ onClick, close }) {
  return (
    <SearchContextManager apiKey="AkO9AeIcPXbtD5m61zBn0IFSqCBxuk8M">
      <Components onClick={onClick} close={close} />
    </SearchContextManager>
  );
}

function Components({ onClick, close }) {
  const { fetchGifs, searchKey } = useContext(SearchContext);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[999]">
      <div
        style={{
          boxShadow: "0 0 0 50vmax rgba(91, 122, 131, 0.4)",
          transform: "translate(-50%, -50%)",
        }}
        className="gap-2 overflow-y-auto w-[600px] max-h-[650px] h-full rounded-2xl absolute z-20 left-1/2 top-1/2 flex flex-col bg-black text-white"
      >
        <div className="flex gap-2 pt-2 items-center">
          <img
            onClick={close}
            src="/close.svg"
            className="ml-3 cursor-pointer w-6 h-6"
            alt=""
          />
          <div className="mx-3 flex-grow">
            <SearchBar />
          </div>
        </div>
        <Grid
          key={searchKey}
          columns={3}
          width={600}
          fetchGifs={fetchGifs}
          noLink={true}
          onGifClick={(e) => onClick(e.id)}
        />
        <p>Test</p>
      </div>
    </div>
  );
}
