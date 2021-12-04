import { useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { Box, Link, Button, Input, FormHelperText } from "@mui/material";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import { ChangePasswordType } from "../api/changePassword";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import Axios from "axios";
import Toast from "../../components/common/Toast";

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
        if (res.data.message) {
          setMessage(res.data.message);
        }
        if (res.data.errorMessage) {
          setError(res.data.errorMessage);
        }

        queryClient.invalidateQueries("/api/changePassword");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });

    reset();
  };

  return (
    <Box m={5}>
      <Link href="/admin/dashboard">
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.name && <FormHelperText error>All fields are required</FormHelperText>}
        <Input
          {...register("oldPassword", { required: true })}
          placeholder="Old Password"
          type="password"
        />
        <Input
          {...register("newPassword", { required: true })}
          placeholder="New Password"
          type="password"
        />
        <Button type="submit" variant="contained" style={{ marginLeft: "10px" }}>
          Submit
        </Button>
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
