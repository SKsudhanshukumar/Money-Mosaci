import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./state/api";
import { csvApi } from "./state/csvApi";

export const store = configureStore({
  reducer: { 
    [api.reducerPath]: api.reducer,
    [csvApi.reducerPath]: csvApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware, csvApi.middleware),
});
setupListeners(store.dispatch);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
