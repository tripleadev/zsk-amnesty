import { Destination } from "@prisma/client";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  useTheme,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { Box } from "@mui/system";
import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import Axios from "axios";

type FormFields = {
  destinationId: string;
  classId: string;
  registerNumber?: number;
};

export const LettersForm = () => {
  const theme = useTheme();
  const { data: destinations } = useSWR<{ allDestinations: Destination[] }>("/api/destinations");
  const { data: classes } = useSWR<{ classes: string[] }>("/api/classes");
  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormFields> = ({ registerNumber, classId, destinationId }) => {
    Axios.post("/api/letters", {
      destinationId,
      classId,
      registerNumber: registerNumber || undefined,
    })
      .then((res) => {
        setMessage(res.data.message);
        mutate("/api/classes");
        mutate("/api/letters");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });
  };

  const classOptions = classes?.classes || [];

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
          <Controller
            render={(props) => (
              <Autocomplete
                placeholder="3C"
                options={classOptions}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Class" error={!!errors.classId} />
                )}
                {...props}
                onChange={(_e, data) => props.field.onChange(data)}
                onInputChange={(_e, data) => props.field.onChange(data)}
              />
            )}
            name="classId"
            control={control}
            rules={{ required: true }}
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

      <Snackbar open={!!error} autoHideDuration={3000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!message} autoHideDuration={3000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </form>
  );
};
