import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { Footer } from "../components/common/Footer";
import { Box } from "@mui/system";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh" }}>
        <Component {...pageProps} />
      </Box>
      <Footer />
    </QueryClientProvider>
  );
}

export default MyApp;
