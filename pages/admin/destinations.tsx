import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormHelperText,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
  Grid,
} from "@mui/material";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Toast from "../../components/common/Toast";
import { useQuery, useQueryClient } from "react-query";
import { fetcher } from "../../lib/fetcher";
import type { DestinationType } from "../api/destinations";
import { SEO } from "../../components/common/SEO";

const DestinationsManagementPage = () => {
  // TODO: Add typings
  const { data } = useQuery("/api/destinations", fetcher<any>("/api/destinations"));
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<DestinationType> = (data) => {
    axios
      .post("/api/destinations", data)
      .then((res) => {
        setMessage(res.data.message);
        queryClient.invalidateQueries("/api/destinations");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });
  };

  return (
    <Box m={5}>
      <SEO title="Destinations" />
      <Link href="/admin/dashboard" passHref>
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          {errors.name && <FormHelperText error>This field is required</FormHelperText>}
          <Grid item xs={8} md={10} lg={3}>
            <Input
              style={{ width: "100%" }}
              {...register("name", { required: true })}
              placeholder="destination name"
            />
          </Grid>
          <Grid item xs lg={1} justifySelf={"start"}>
            <Button type="submit" variant="contained" style={{ marginLeft: "10px", width: "100%" }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box mt={3}>
        <TableContainer>
          <Table>
            <TableBody>
              {data?.allDestinations?.map(({ name, id }: { name: string; id: string }) => (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Toast value={error} severity="error" />
      <Toast value={message} severity="success" />
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

export default DestinationsManagementPage;
