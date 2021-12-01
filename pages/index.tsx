import useSWR from "swr";
import { Grid } from "@mui/material";
import { Total } from "../components/stats/Total";
import { Classes } from "../components/stats/Classes";

type StatsResponse = Record<string, string>;

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

const Home = () => {
  const { data, error } = useSWR<StatsResponse>("/api/stats", fetcher, { refreshInterval: 5000 });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div style={{ fontFamily: "Amnesty Trade Gothic Roman" }}>
      <Grid container columns={16} spacing={4} sx={{ padding: 4, height: "100%" }}>
        <Grid item xs={7}>
          <Total
            totalLetters={data.totalLetters}
            totalDestinations={data.totalDestinations}
            totalAuthors={data.totalAuthors}
          />
        </Grid>
        <Grid item xs={7}>
          <Classes
            classes={Object.keys(data)
              .filter((key) => key.startsWith("lettersOfClass."))
              .map((key) => {
                return {
                  name: key.replace("lettersOfClass.", ""),
                  value: parseInt(data[key]),
                };
              })}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
