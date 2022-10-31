import { withApiMethods } from "../../lib/withApiMethods";
import { getStats } from "../../lib/stats/stats";
import superjson from "superjson";

export default withApiMethods({
  GET: async (_req, res) => {
    try {
      const stats = await getStats();

      res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
      return res.json(superjson.stringify(stats));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
});
