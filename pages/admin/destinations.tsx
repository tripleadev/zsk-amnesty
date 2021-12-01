import { InferGetServerSidePropsType } from "next";
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
  Alert,
  Snackbar,
} from "@mui/material";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { fetcher } from "../../lib/fetcher";
import type { DestinationType } from "../api/destinations";

const DestinationsManagementPage = () => {
  const { data } = useQuery("/api/destinations", fetcher("/api/destinations"));
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
      <Link href="/admin/dashboard" passHref>
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.name && <FormHelperText error>This field is required</FormHelperText>}
        <Input {...register("name", { required: true })} placeholder="destination name" />
        <Button type="submit" variant="contained" style={{ marginLeft: "10px" }}>
          Submit
        </Button>
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

      <Snackbar open={error ? true : false} autoHideDuration={3000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={message ? true : false} autoHideDuration={3000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
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
