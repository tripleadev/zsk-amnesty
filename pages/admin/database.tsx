import Axios from "axios";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { withServerSideAuth } from "../../lib/auth/withServerSideAuth";
import { SEO } from "../../components/common/SEO";
import Toast from "../../components/common/Toast";

// must match RESET_CONFIRMATION in pages/api/database.ts
const RESET_CONFIRMATION = "RESET";

const saveBlob = (blob: Blob, contentDisposition?: string) => {
  const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || "amnesty-backup.csv";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const DatabasePage = () => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const run = async (action: () => Promise<string>) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      setMessage(await action());
    } catch (err: any) {
      const data = err.response?.data;
      // error bodies arrive as Blob when responseType is "blob"
      const body = data instanceof Blob ? JSON.parse(await data.text()) : data;
      setError(body?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setStep(0);
    setConfirmText("");
  };

  const handleReset = () => {
    closeDialog();
    run(async () => {
      const res = await Axios.delete("/api/database", {
        data: { confirm: confirmText },
        responseType: "blob",
      });
      saveBlob(res.data, res.headers["content-disposition"]);
      return "Database has been reset. The backup has been downloaded.";
    });
  };

  const handleRestore = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (
      !file ||
      !window.confirm(
        `Restore from "${file.name}"? All current letters, authors and destinations will be replaced.`,
      )
    ) {
      return;
    }

    const csv = await file.text();
    run(async () => {
      const res = await Axios.post("/api/database", csv, {
        headers: { "Content-Type": "text/plain" },
      });
      return res.data.message;
    });
  };

  return (
    <Box m={5} maxWidth={700}>
      <SEO title="Database" />
      <Link href="/admin/dashboard" passHref>
        <Button sx={{ mb: 3 }}>Dashboard</Button>
      </Link>

      <Typography variant="h5" component="h1" mb={3}>
        Database
      </Typography>

      <Box mb={4}>
        <Typography variant="h6" component="h2">
          Backup
        </Typography>
        <Typography mb={1}>
          Download all letters, authors and destinations as a CSV file.
        </Typography>
        {/* eslint-disable-next-line */}
        <a href="/api/database" style={{ textDecoration: "none" }}>
          <Button variant="outlined" disabled={loading}>
            Download backup
          </Button>
        </a>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" component="h2">
          Restore from backup
        </Typography>
        <Typography mb={1}>
          Replaces all current letters, authors and destinations with the contents of a backup file.
        </Typography>
        <Button variant="outlined" component="label" disabled={loading}>
          Choose backup file
          <input hidden type="file" accept=".csv,text/csv" onChange={handleRestore} />
        </Button>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" component="h2">
          Prepare for the next marathon
        </Typography>
        <Typography mb={1}>
          Deletes all letters, authors and destinations. A backup is downloaded automatically before
          the data is removed. Admin accounts are kept.
        </Typography>
        <Button variant="contained" color="error" disabled={loading} onClick={() => setStep(1)}>
          Reset database
        </Button>
      </Box>

      <Dialog open={step === 1} onClose={closeDialog}>
        <DialogTitle>Reset the database?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All letters, authors and destinations will be permanently deleted. A CSV backup will be
            downloaded, which you can use to restore the data later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button color="error" onClick={() => setStep(2)}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={step === 2} onClose={closeDialog}>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Type <b>{RESET_CONFIRMATION}</b> to confirm.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={confirmText !== RESET_CONFIRMATION}
            onClick={handleReset}
          >
            Reset database
          </Button>
        </DialogActions>
      </Dialog>

      <Toast value={error} severity="error" />
      <Toast value={message} severity="success" />
    </Box>
  );
};

export const getServerSideProps = withServerSideAuth(async (ctx) => {
  return {
    props: {
      user: ctx.session.user,
    },
  };
});

export default DatabasePage;
