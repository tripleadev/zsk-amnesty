import { InferGetServerSidePropsType } from "next";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import Link from "next/link";
import { Button, Box, Typography } from "@mui/material";

const AdminPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Box m={5} textAlign="center">
      <Typography variant="h4" component="h1">
        Maraton Pisana Listów
        <br />
        Admin Panel
      </Typography>
      <Typography my={3} variant="h5" component="h2">
        Hello {user.email}!
      </Typography>
      <Box my={5}>
        <Link href="/admin/admins" passHref>
          <Button>Administratorzy</Button>
        </Link>
        <Link href="/admin/destinations" passHref>
          <Button>Adresaci</Button>
        </Link>
        <Link href="/admin/letters" passHref>
          <Button>Listy</Button>
        </Link>
        {/* Here we'll be adding links to the other pages */}
      </Box>
      <Link href="/admin/logout" prefetch={false} passHref>
        <Button variant="contained">Wyloguj się</Button>
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
