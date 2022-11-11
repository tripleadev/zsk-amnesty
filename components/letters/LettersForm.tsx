import { Destination } from "@prisma/client";
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { Grid } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import Axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { fetcher } from "../../lib/fetcher";
import Toast from "../common/Toast";

type FormFields = {
  destinationId: string;
  classId: string;
  registerNumber?: number;
  batchMode?: true;
  amount?: number;
};

export const LettersForm = () => {
  const theme = useTheme();
  const { data: destinations } = useQuery(
    "/api/destinations",
    fetcher<{ allDestinations: Destination[] }>("/api/destinations"),
  );
  const { data: classes } = useQuery(
    "/api/classes",
    fetcher<{ classes: string[] }>("/api/classes"),
  );
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormFields>();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormFields> = ({
    registerNumber,
    classId,
    destinationId,
    batchMode,
    amount,
  }) => {
    Axios.post(batchMode ? "/api/letters/batch" : "/api/letters", {
      destinationId,
      classId,
      registerNumber: registerNumber || null,
      amount,
    })
      .then((res) => {
        setMessage(res.data.message);
        queryClient.invalidateQueries("/api/classes");
        queryClient.invalidateQueries("/api/letters");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
      });
  };

  const classOptions = classes?.classes || [];

  const isBatchMode = watch("batchMode");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={4}>
          <FormControl error={!!errors.destinationId} sx={{ width: "100%" }}>
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
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl sx={{ width: "100%" }}>
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
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              {...register("registerNumber")}
              placeholder="24"
              label="Register Number"
              error={!!errors.registerNumber}
              type="number"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel control={<Switch {...register("batchMode")} />} label="Batch mode" />
        </Grid>

        {isBatchMode && (
          <Grid item xs={12}>
            <FormControl sx={{ width: "100%" }}>
              <TextField
                {...register("amount")}
                placeholder="10"
                label="Amount of letters from class"
                error={!!errors.amount}
                type="number"
              />
            </FormControl>
          </Grid>
        )}
      </Grid>
      <Button type="submit" variant="contained" sx={{ marginTop: theme.spacing(1) }}>
        Submit
      </Button>

      <Toast value={error} severity="error" />
      <Toast value={message} severity="success" />
    </form>
  );
};
