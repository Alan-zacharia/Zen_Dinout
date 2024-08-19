import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RecoilRoot } from "recoil";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";

const GoogleAPI = import.meta.env.VITE_API_CLOUD_URL;
ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GoogleAPI}>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <RecoilRoot>
   
            <App />
       
        </RecoilRoot>
      </Provider>
    </PersistGate>
  </GoogleOAuthProvider>
);
