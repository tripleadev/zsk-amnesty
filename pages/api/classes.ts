import { withApiAuth } from "../../lib/auth/withApiAuth";
import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";

export default withApiAuth(
  withApiMethods({
    GET: async (_req, res) => {
      try {
        const classes = (await prisma.$queryRaw`SELECT DISTINCT "classId" FROM "Author"`) as {
          classId: string;
        }[];

        res.json({ classes: classes.map((c) => c.classId) });
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    },
  }),
);
