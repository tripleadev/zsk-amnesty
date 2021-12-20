import { withApiAuth } from "../../lib/auth/withApiAuth";
import { withApiMethods } from "../../lib/withApiMethods";
import { convertStatsIntoExcel } from "../../lib/exportStats/convertStatsIntoExcel";

const FILENAME = "amnesty-stats.xlsx";

export default withApiAuth(
  withApiMethods({
    GET: async (_req, res) => {
      try {
        const workbook = await convertStatsIntoExcel();

        res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1200");

        const buffer = await workbook.writeToBuffer();

        res.setHeader("Content-Length", buffer.length);
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${encodeURIComponent(
            FILENAME,
          )}"; filename*=utf-8''${encodeURIComponent(FILENAME)};`,
        );

        return res.send(buffer);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
  }),
);
