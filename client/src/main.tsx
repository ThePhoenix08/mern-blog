import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ThemeProvider from "@/components/feature/core/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import store from "@/redux/store.ts";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
