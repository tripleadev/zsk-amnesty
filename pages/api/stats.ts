import { withApiMethods } from "../../lib/withApiMethods";
import * as stats from "../../lib/stats/stats";

export default withApiMethods({
  GET: async (req, res) => {
    const newStats = await stats.update();

    return res.json(newStats);
  },
});
