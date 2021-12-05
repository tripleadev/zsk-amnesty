import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { statsAreExpired, generateStats, updateStats } from "../../lib/stats/stats";

export default withApiMethods({
  GET: async (_req, res) => {
    try {
      const stats = await prisma.stats.findFirst({});

      if (statsAreExpired(stats)) {
        const newStats = await generateStats();

        await updateStats(newStats);

        return res.json(newStats);
      } else {
        return res.json(stats?.stats);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
});
