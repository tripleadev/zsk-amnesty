import Axios from "axios";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferGetServerSidePropsType } from "next";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import { AdminSchemaType } from "../api/admins";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, FormHelperText, Input } from "@mui/material";
import Link from "next/link";
import Toast from "../../components/common/Toast";

const columnsObject: GridColDef[] = [{ field: "email", headerName: "Email Adress", width: 300 }];

const AdminsManagmentPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { mutate } = useSWRConfig();
  const { data } = useSWR("/api/admins");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSchemaType>();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<AdminSchemaType> = (data) => {
    Axios.post("/api/admins", data)
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });

    mutate("/api/admins");
  };

  return (
    <Box m={5}>
      <Link href="/admin/dashboard" passHref>
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>
      <Box mb={5}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            sx={{ mr: [0, 3], mb: [2, 0] }}
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
          />
          {errors.email && <FormHelperText error>This field is required</FormHelperText>}

          <Input
            sx={{ mr: [0, 3], mb: [2, 0] }}
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && <FormHelperText error>This field is required</FormHelperText>}

          <Button variant="contained" type="submit">
            Add new admin
          </Button>
        </form>
      </Box>
      <div style={{ height: "50vh", width: "100%" }}>
        <DataGrid
          rows={data?.allAdmins}
          columns={columnsObject}
          autoPageSize
          disableSelectionOnClick
        />
      </div>

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

export default AdminsManagmentPage;
