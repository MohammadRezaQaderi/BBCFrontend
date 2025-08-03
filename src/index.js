import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
const lang = document.querySelector("html").getAttribute("lang");
const root = ReactDOM.createRoot(document.getElementById("root"));
const cacheRtl = createCache(
  lang === "fn"
    ? { key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] }
    : { key: "muiltr", stylisPlugins: [] }
);
const theme = createTheme(
  lang === "fn" ? { direction: "rtl" } : { direction: "ltr" }
);
root.render(
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </CacheProvider>
);
