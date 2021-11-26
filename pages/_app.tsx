import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { Footer } from "../components/common/Footer";
import { Box } from "@mui/system";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh" }}>
        <Component {...pageProps} />
      </Box>
      <Footer />
    </>
  );
}

export default MyApp;
