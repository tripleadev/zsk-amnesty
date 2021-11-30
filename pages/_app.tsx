import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { Footer } from "../components/common/Footer";
import { Box } from "@mui/system";
import { SWRConfig } from "swr";
import Axios from 'axios';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => Axios.get(url).then((res) => res.data),
      }}
    >
      <CssBaseline />
      <Box sx={{ minHeight: "100vh" }}>
        <Component {...pageProps} />
      </Box>
      <Footer />
    </SWRConfig>
  );
}

export default MyApp;
