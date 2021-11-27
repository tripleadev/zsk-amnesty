import { Box, Typography, Input, Button, FormHelperText } from "@mui/material";
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
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchemaType> = (data) => {
    Axios.post("/api/login", data)
      .then((res) => {
        if (res.data.user) {
          return router.push("/admin/dashboard");
        }
        throw new Error("");
      })
      .catch((err) => {
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
          <Button variant="contained" type="submit">
            Log In
          </Button>
        </Box>
      </Box>
    </form>
  );
};
