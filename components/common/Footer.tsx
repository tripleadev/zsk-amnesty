import { Box } from "@mui/system";
import { Link, useTheme } from "@mui/material";

export const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
      }}
    >
      Copyright &copy; {new Date().getFullYear()}{" "}
      <Link href="https://github.com/tripleadev">TripleA</Link>
      <br />
      Vercel build SHA: {process.env.VERCEL_GIT_COMMIT_SHA || "development"}
      <br />
      Vercel environment: {process.env.VERCEL_ENV || "development"}
    </Box>
  );
};
