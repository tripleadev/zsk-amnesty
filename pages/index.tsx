import useSWR from "swr";
import { Box, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Image from "next/image";

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
    padding: "1rem",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridTemplateRows: "1fr 1fr 2fr",
    gridGap: "1rem",
    backgroundColor: "#eeeeee",
  },
});

const Home = () => {
  const { data, error } = useSWR<StatsResponse>("/api/stats", fetcher, { refreshInterval: 5000 });
  const classes = useStyles();

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Box className={classes.grid}>
      <Box style={{ gridRow: "1 / 3", gridColumn: "1 / 4" }}>
        <Paper
          elevation={12}
          sx={{
            p: 3,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src="/logo.png" alt="Amnesty International Logo" width={400} height={400} />
          <h1
            style={{
              fontFamily: "Amnesty Trade Gothic Bold Condensed",
              margin: "0",
              textTransform: "uppercase",
              fontSize: 36,
              textAlign: "center",
            }}
          >
            Amnesty International ZSK
          </h1>
        </Paper>
      </Box>
      <Box style={{ gridRow: "1", gridColumn: "4 / 10" }}>
        <Total
          totalLetters={data.totalLetters}
          totalDestinations={data.totalDestinations}
          totalAuthors={data.totalAuthors}
        />
      </Box>
      <Box style={{ gridRow: "2", gridColumn: "4 / 10" }}>
        <Authors
          authors={Object.keys(data)
            .filter((key) => key.startsWith("top."))
            .map((key) => {
              return {
                name: `${key.split(".")[2]} ${key.split(".")[3]}`,
                value: parseInt(data[key]),
              };
            })}
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
