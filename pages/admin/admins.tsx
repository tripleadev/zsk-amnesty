import Axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import { AdminSchemaType } from "../api/admins";
import { DataGrid, GridColDef, GridSelectionModel, GridToolbarContainer } from "@mui/x-data-grid";
import { Box, Button, FormHelperText, Input, Grid } from "@mui/material";
import Link from "next/link";
import Toast from "../../components/common/Toast";
import { useQuery, useQueryClient } from "react-query";
import { fetcher } from "../../lib/fetcher";
import DeleteIcon from "@mui/icons-material/Delete";
import { SEO } from "../../components/common/SEO";

const columnsObject: GridColDef[] = [{ field: "email", headerName: "Email Adress", width: 300 }];

const AdminsManagmentPage = () => {
  const queryClient = useQueryClient();

  // TODO: Add typings
  const { data } = useQuery("/api/admins", fetcher<any>("/api/admins"));
  const [adminsToDelete, setAdminsToDelete] = useState<GridSelectionModel>([]);

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

        queryClient.invalidateQueries("/api/admins");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });
  };

  const handleDelete = () => {
    if (adminsToDelete.length) {
      Axios.delete("/api/admins", { data: { ids: adminsToDelete } })
        .then((res) => {
          setMessage(res.data.message);

          queryClient.invalidateQueries("/api/admins");
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Something went wrong");
        });
    }
  };

  return (
    <Box m={5}>
      <SEO title="Manage Admins" />
      <Link href="/admin/dashboard" passHref>
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>
      <Box mb={5}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4} lg={2}>
              <Input
                sx={{ mr: [0, 3], mb: [2, 0], width: "100%", maxWidth: "400px" }}
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
              />
              {errors.email && <FormHelperText error>This field is required</FormHelperText>}
            </Grid>

            <Grid item xs={12} md={4} lg={2}>
              <Input
                sx={{ mr: [0, 3], mb: [2, 0], width: "100%", maxWidth: "400px" }}
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
              />
              {errors.password && <FormHelperText error>This field is required</FormHelperText>}
            </Grid>

            <Grid item md={4} lg={2}>
              <Button variant="contained" type="submit">
                Add new admin
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <div style={{ height: "50vh", width: "100%" }}>
        <DataGrid
          rows={data?.allAdmins}
          columns={columnsObject}
          autoPageSize
          checkboxSelection
          onSelectionModelChange={setAdminsToDelete}
          components={{
            Toolbar: () => (
              <GridToolbarContainer>
                <Button
                  onClick={handleDelete}
                  color="warning"
                  startIcon={<DeleteIcon />}
                  disabled={!adminsToDelete.length}
                >
                  Delete selected
                </Button>
              </GridToolbarContainer>
            ),
          }}
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
