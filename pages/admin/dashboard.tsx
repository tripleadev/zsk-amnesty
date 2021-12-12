import { InferGetServerSidePropsType } from "next";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import Link from "next/link";
import { Button, Box, Typography, useTheme } from "@mui/material";
import { SEO } from "../../components/common/SEO";
import axios from "axios";
import { useState } from "react";
import Toast from "../../components/common/Toast";
import fileDownload from "js-file-download";

const AdminPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const theme = useTheme();
  const [error, setError] = useState("");
  const downloadStats = () => {
    axios({
      url: "/api/exportStats",
      method: "GET",
      responseType: "blob",
    })
      .then((response) => fileDownload(response.data, `zsk-amnesty.xlsx`))
      .catch((err) => setError(err));
  };

  return (
    <Box m={5} textAlign="center">
      <SEO title="Dashboard" />

      <Typography variant="h4" component="h1">
        Maraton Pisana Listów
        <br />
        Admin Panel
      </Typography>
      <Typography my={3} variant="h5" component="h2">
        Hello {user.email}!
      </Typography>
      <Box my={5}>
        <Link href="/admin/letters" passHref>
          <Button variant="contained" sx={{ marginInline: theme.spacing(1) }}>
            Letters
          </Button>
        </Link>
        <Link href="/admin/destinations" passHref>
          <Button variant="outlined" sx={{ marginInline: theme.spacing(1) }}>
            Destinations
          </Button>
        </Link>
        <Link href="/admin/admins" passHref>
          <Button variant="outlined" sx={{ marginInline: theme.spacing(1) }}>
            Admins
          </Button>
        </Link>
        <Link href="/admin/changePassword" passHref>
          <Button variant="outlined" sx={{ marginInline: theme.spacing(1) }}>
            Change password
          </Button>
        </Link>
        <Button variant="outlined" onClick={downloadStats} sx={{ marginInline: theme.spacing(1) }}>
          Download stats
        </Button>
        {/* Here we'll be adding links to the other pages */}
      </Box>
      <Link href="/admin/logout" prefetch={false} passHref>
        <Button>Log out</Button>
      </Link>

      <Toast value={error} severity="error" />
    </Box>
  );
};

export const getServerSideProps = withServerSideAuth(async (ctx) => {
  return {
    props: {
      user: ctx.session.user,
    },
  };
});

export default AdminPage;
