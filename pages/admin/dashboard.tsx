import { InferGetServerSidePropsType } from "next";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import Link from "next/link";
import { Button, Box, Typography, useTheme } from "@mui/material";
import { SEO } from "../../components/common/SEO";

const AdminPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const theme = useTheme();

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
        <a href="/api/exportStats" style={{ textDecoration: "none" }}>
          <Button variant="outlined" sx={{ marginInline: theme.spacing(1) }}>
            Download stats
          </Button>
        </a>
        {/* Here we'll be adding links to the other pages */}
      </Box>
      <Link href="/admin/logout" prefetch={false} passHref>
        <Button>Log out</Button>
      </Link>
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
