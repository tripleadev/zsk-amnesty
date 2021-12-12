import { withApiAuth } from "../../lib/auth/withApiAuth";
import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { createExcel } from "../../lib/exportStats/createExcel";

export default withApiAuth(
  withApiMethods({
    GET: async (_req, res) => {
      try {
        const workbook = await createExcel();
        workbook.write("zsk-amnesty.xlsx", res);
      } catch {
        res.status(500).json({ message: "Internal server error" });
      }
    },
  }),
);
