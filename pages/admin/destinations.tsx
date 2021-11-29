import { InferGetServerSidePropsType } from "next";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { DestinationType } from "../api/destinations";

const fetcher = (url: string) => Axios.get(url).then((res) => res.data);

const Destinations = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = useSWR("/api/destinations", fetcher);

  return (
    <>
      <Box m={5}>
        <Link href="/admin/dashboard" passHref>
          <Button sx={{ mb: 3 }}>Dashboard</Button>
        </Link>
        <Box mb={3}>
          {data?.allDestinations?.map((destination: DestinationType) => (
            <p key={destination.id}>{destination.name}</p>
          ))}
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps = withServerSideAuth(async (ctx) => {
  return {
    props: {
      user: ctx.session.user,
    },
  };
});

export default Destinations;
