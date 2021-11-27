import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { generateStats } from "../../lib/stats/stats";

export default withApiMethods({
  GET: async (req, res) => {
    const stats = await prisma.stat.findMany();

    if (!stats.length || stats[0]?.updatedAt < new Date(Date.now() - 1000 * 10)) {
      const newStats = await generateStats();

      const upserts = Object.entries(newStats).map(([key, value]) =>
        prisma.stat.upsert({
          where: {
            id: key,
          },
          update: {
            value: String(value),
            updatedAt: new Date(Date.now()),
          },
          create: {
            id: key,
            value: String(value),
            updatedAt: new Date(Date.now()),
          },
        }),
      );

      await prisma.$transaction(upserts);
    }

    return res.json(Object.fromEntries(stats.map((stat) => [stat.id, stat.value])));
  },
});
