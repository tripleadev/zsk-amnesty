import { withApiAuth } from "../../lib/auth/withApiAuth";
import { withApiMethods } from "../../lib/withApiMethods";
import { convertStatsIntoExcel } from "../../lib/exportStats/convertStatsIntoExcel";

export default withApiAuth(
  withApiMethods({
    GET: async (_req, res) => {
      try {
        const workbook = await convertStatsIntoExcel();
        workbook.write("zsk-amnesty.xlsx", res);
      } catch {
        res.status(500).json({ message: "Internal server error" });
      }
    },
  }),
);
