import type { NextApiResponse } from "next";
import { object, string } from "yup";
import { withApiAuth } from "../../lib/auth/withApiAuth";
import { withApiMethods } from "../../lib/withApiMethods";
import { withApiValidation } from "../../lib/withApiValidation";
import { getBackupCsv, resetDatabase, restoreDatabase } from "../../lib/backup";

const RESET_CONFIRMATION = "RESET";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

const sendCsv = (res: NextApiResponse, csv: string) => {
  const filename = `amnesty-backup-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Cache-Control", "no-store");
  return res.send(csv);
};

export default withApiAuth(
  withApiMethods({
    // Download a backup
    GET: async (_req, res) => {
      try {
        return sendCsv(res, await getBackupCsv());
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    // Export + wipe letters, authors and destinations; responds with the backup CSV
    DELETE: withApiValidation(
      { body: object({ confirm: string().required().oneOf([RESET_CONFIRMATION]) }) },
      async (_req, res) => {
        try {
          return sendCsv(res, await resetDatabase());
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }
      },
    ),
    // Restore from a backup CSV (sent as text/plain)
    POST: async (req, res) => {
      if (typeof req.body !== "string" || !req.body) {
        return res.status(400).json({ message: "Backup file is required" });
      }

      try {
        const counts = await restoreDatabase(req.body);
        return res.json({
          message: `Restored ${counts.letters} letters, ${counts.authors} authors and ${counts.destinations} destinations`,
        });
      } catch (err) {
        console.error(err);
        return res
          .status(400)
          .json({ message: "Could not restore the backup - is it a valid file?" });
      }
    },
  }),
);
