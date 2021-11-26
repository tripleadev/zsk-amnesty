import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
