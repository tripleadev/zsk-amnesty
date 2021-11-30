import { Button, Input } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const LettersForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name", { required: true })}
        placeholder="destination name"
        error={errors.name}
      />
      <Button type="submit" variant="contained" style={{ marginLeft: "10px" }}>
        Submit
      </Button>
    </form>
  );
};
