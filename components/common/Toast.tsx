import { Alert, AlertColor, Snackbar } from "@mui/material";

function Toast({ value, severity }: { value: string | null; severity: AlertColor }) {
  return (
    <Snackbar open={!!value} autoHideDuration={3000}>
      <Alert severity={severity} sx={{ width: "100%" }}>
        {value}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
