import useSWR from "swr";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { Total } from "../components/stats/Total";
import { Classes } from "../components/stats/Classes";
import { Destinations } from "../components/stats/Destinations";
import { Authors } from "../components/stats/Authors";

type StatsResponse = Record<string, string>;

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

const useStyles = makeStyles({
  grid: {
    padding: "3rem",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridTemplateRows: "1fr 1fr 2fr",
    gridGap: "2rem",
    backgroundColor: "#aaaaaa",
  },
});

const Home = () => {
  const { data, error } = useSWR<StatsResponse>("/api/stats", fetcher, { refreshInterval: 5000 });
  const classes = useStyles();

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Box className={classes.grid}>
      <Box style={{ gridRow: "1", gridColumn: "1 / 6" }}>
        <Total
          totalLetters={data.totalLetters}
          totalDestinations={data.totalDestinations}
          totalAuthors={data.totalAuthors}
        />
      </Box>
      <Box style={{ gridRow: "1 / 3", gridColumn: "10 / 13" }}>
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
      </Box>
      <Box style={{ gridRow: "2", gridColumn: "1/6" }}>
        <Authors
          authors={Object.keys(data)
            .filter(
              (key) =>
                key.startsWith("top1Author.") ||
                key.startsWith("top2Author.") ||
                key.startsWith("top3Author."),
            )
            .map((key) => {
              return {
                name: key.replace("lettersOfAuthor.", "").replace(".", " "),
                value: data[key],
              };
            })}
        />
      </Box>
      <Box style={{ gridRow: "3", gridColumn: "1 / 13" }}>
        <Destinations
          destinations={Object.keys(data)
            .filter((key) => key.startsWith("lettersTo."))
            .map((key) => {
              return {
                name: key.replace(
                  key.startsWith("lettersTo.") ? "lettersTo." : "anonymous.lettersTo",
                  "",
                ),
                authored: parseInt(data[key]),
                anonymous: parseInt(data[`anonymous.${key}`]),
              };
            })}
        />
      </Box>
    </Box>
  );
};

export default Home;
