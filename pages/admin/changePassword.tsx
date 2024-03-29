import { useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { Box, Link, Button, Input, FormHelperText, Grid } from "@mui/material";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import { ChangePasswordType } from "../api/changePassword";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import Axios from "axios";
import Toast from "../../components/common/Toast";
import { SEO } from "../../components/common/SEO";

function ChangePassword({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<ChangePasswordType> = (data) => {
    data.id = user.id;
    data.hashedOldPassword = user.password;

    Axios.post("/api/changePassword", data)
      .then((res) => {
        setMessage(res.data.message);

        queryClient.invalidateQueries("/api/changePassword");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });

    reset();
  };

  return (
    <Box m={5}>
      <SEO title="Change Password" />

      <Link href="/admin/dashboard">
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container gap={1}>
          {errors.name && <FormHelperText error>All fields are required</FormHelperText>}

          <Grid item xs={12} md={4} lg={2}>
            <Input
              style={{ width: "100%", maxWidth: "300px" }}
              {...register("oldPassword", { required: true })}
              placeholder="Old Password"
              type="password"
            />
          </Grid>

          <Grid item xs={12} md={4} lg={2}>
            <Input
              style={{ width: "100%", maxWidth: "300px" }}
              {...register("newPassword", { required: true })}
              placeholder="New Password"
              type="password"
            />
          </Grid>

          <Grid item xs={12} md>
            <Button type="submit" variant="contained" style={{ width: "100%", maxWidth: "250px" }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      <Toast value={error} severity="error" />
      <Toast value={message} severity="success" />
    </Box>
  );
}

export const getServerSideProps = withServerSideAuth(async (ctx) => {
  return {
    props: {
      user: ctx.session.user,
    },
  };
});

export default ChangePassword;
