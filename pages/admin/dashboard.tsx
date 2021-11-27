import { InferGetServerSidePropsType } from "next";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import Link from "next/link";
import { Button, Box, Typography } from "@mui/material";

const AdminPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Box m={5} textAlign="center">
      <Typography variant="h4" component="h1">
        Maraton Pisana Listów<br/>
        Admin Panel
      </Typography>
      <Typography my={3} variant="h5" component="h2">
        Hello { user.email }!
      </Typography>
      <Link href="/admin/admins">
        <Button>Lista adminów</Button>
      </Link>
      <Link href="/admin/logout" prefetch={false} passHref>
        <Button>Logout</Button>
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
