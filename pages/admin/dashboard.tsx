import { InferGetServerSidePropsType } from "next";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import Link from "next/link";
import { Button } from "@mui/material";

const AdminPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      hello, {user.email}
      <Link href="/admin/destinations" passHref>
        <Button>Destinations</Button>
      </Link>
      <Link href="/admin/logout" prefetch={false} passHref>
        <Button>Logout</Button>
      </Link>
    </div>
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
