import { Box, Typography, Input, FormHelperText } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginSchemaType } from "../../pages/api/login";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchemaType> = (data) => {
    setLoading(true);
    Axios.post("/api/login", data)
      .then((res) => {
        if (res.data.user) {
          return router.push("/admin/dashboard");
        }
        throw new Error("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response?.data?.message || "Something went wrong");
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5" component="div" gutterBottom>
          ZSK Amnesty Admin
        </Typography>
        <Box sx={{ m: 2 }}>
          <Input placeholder="E-Mail" {...register("email", { required: true })} type="email" />
          {errors.email && <FormHelperText error>This field is required</FormHelperText>}
        </Box>
        <Box sx={{ m: 2 }}>
          <Input
            placeholder="Password"
            {...register("password", { required: true })}
            type="password"
          />
          {errors.password && <FormHelperText error>This field is required</FormHelperText>}
        </Box>
        {error && <FormHelperText error>{error}</FormHelperText>}

        <Box sx={{ m: 2 }}>
          <LoadingButton loading={loading} variant="contained" type="submit">
            Login
          </LoadingButton>
        </Box>
      </Box>
    </form>
  );
};
