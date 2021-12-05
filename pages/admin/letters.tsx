import { Button } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { LettersForm } from "../../components/letters/LettersForm";
import { LettersTable } from "../../components/letters/LettersTable";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import { SEO } from "../../components/common/SEO";

const DestinationsManagementPage = () => {
  return (
    <Box m={5}>
      <SEO title="Letters" />
      <Link href="/admin/dashboard" passHref>
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>
      <LettersForm />
      <LettersTable />
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
