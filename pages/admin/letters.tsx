import { Button } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { LettersForm } from "../../components/letters/LettersForm";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";

const DestinationsManagementPage = () => {
  return (
    <Box m={5}>
      <Link href="/admin/dashboard" passHref>
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>
      <LettersForm />
    </Box>
  );
};

export const getServerSideProps = withServerSideAuth((ctx) => {
  return {
    props: {
      user: ctx.session.user,
    },
  };
});

export default DestinationsManagementPage;
