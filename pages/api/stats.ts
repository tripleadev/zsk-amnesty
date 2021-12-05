import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { statsAreExpired, generateStats, updateStats } from "../../lib/stats/stats";

export default withApiMethods({
  GET: async (_req, res) => {
    const stats = await prisma.stats.findFirst();

    if (statsAreExpired(stats)) {
      const newStats = await generateStats();

      await updateStats(newStats);

      return res.json(newStats);
    } else {
      return res.json(stats?.stats);
    }
  },
});
