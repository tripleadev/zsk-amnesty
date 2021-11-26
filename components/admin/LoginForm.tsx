import { Box, Typography, Input, Button, FormHelperText } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5" component="div" gutterBottom>
          ZSK Amnesty Admin
        </Typography>
        <Box sx={{ m: 2 }}>
          <Input placeholder="E-Mail" {...register("email", { required: true })} />
          {errors.email && <FormHelperText error>This field is required</FormHelperText>}
        </Box>
        <Box sx={{ m: 2 }}>
          <Input placeholder="Password" {...register("password", { required: true })} />
          {errors.password && <FormHelperText error>This field is required</FormHelperText>}
        </Box>

        <Box sx={{ m: 2 }}>
          <Button variant="contained" type="submit">
            Log In
          </Button>
        </Box>
      </Box>
    </form>
  );
};
