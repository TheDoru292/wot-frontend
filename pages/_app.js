import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const persistor = persistStore(store);

  return getLayout(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<p>Loading...</p>}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
