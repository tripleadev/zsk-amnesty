import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { statsAreExpired, generateStats, updateStats } from "../../lib/stats/stats";

export default withApiMethods({
  GET: async (_req, res) => {
    const stats = await prisma.stat.findMany();

    if (statsAreExpired(stats)) {
      const newStats = await generateStats();

      res.json(newStats);

      updateStats(newStats);
    } else {
      res.json(Object.fromEntries(stats.map((stat) => [stat.id, stat.value])));
    }
  },
});
