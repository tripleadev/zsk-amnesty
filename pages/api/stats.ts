import { withApiMethods } from "../../lib/withApiMethods";
import { generateStats } from "../../lib/stats/stats";

export default withApiMethods({
  GET: async (_req, res) => {
    try {
      const stats = await generateStats();

      res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
      return res.json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
});
