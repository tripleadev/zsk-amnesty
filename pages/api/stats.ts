import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { statsAreExpired, generateStats, updateStats } from "../../lib/stats/stats";

export default withApiMethods({
  GET: async (req, res) => {
    const stats = await prisma.stat.findMany();

    if (statsAreExpired(stats)) {
      const newStats = await generateStats();
      await updateStats(newStats);
      return res.json(newStats);
    }

    return res.json(Object.fromEntries(stats.map((stat) => [stat.id, stat.value])));
  },
});
