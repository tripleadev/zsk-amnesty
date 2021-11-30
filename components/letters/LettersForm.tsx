import { Destination } from "@prisma/client";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

type FormFields = {
  destinationId: string;
  class: string;
  registerNumber?: number;
};

export const LettersForm = () => {
  const theme = useTheme();
  const { data: destinations } = useSWR<{ allDestinations: Destination[] }>("/api/destinations");
  const { data: classes } = useSWR<{ classes: string[] }>("/api/classes");

  console.log(classes);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <FormControl
          sx={{ width: 300, marginRight: theme.spacing(1) }}
          error={!!errors.destinationId}
        >
          <InputLabel id="destinationLabel">Destination</InputLabel>
          <Select
            {...register("destinationId", { required: true })}
            label="Destination"
            labelId="destinationLabel"
          >
            {destinations?.allDestinations.map((destination) => (
              <MenuItem value={destination.id} key={destination.id}>
                {destination.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 300, marginRight: theme.spacing(1) }}>
          <Autocomplete
            {...register("class", { required: true })}
            placeholder="3C"
            options={classes?.classes || []}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Class" error={!!errors.class} />}
          />
        </FormControl>
        <FormControl sx={{ width: 300 }}>
          <TextField
            {...register("registerNumber", { min: 1 })}
            placeholder="24"
            label="Register Number"
            error={!!errors.registerNumber}
            type="number"
          />
        </FormControl>
      </Box>
      <Button type="submit" variant="contained" sx={{ marginTop: theme.spacing(1) }}>
        Submit
      </Button>
    </form>
  );
};
