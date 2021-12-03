import useSWR from "swr";
import { Box, Paper, useMediaQuery } from "@mui/material";
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
  const mobileLayout = useMediaQuery("(max-width:1250px)");

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Box
      className={classes.grid}
      style={
        mobileLayout
          ? { gridTemplateColumns: "auto", gridTemplateRows: "repeat(5, auto)", minHeight: "100vh" }
          : { height: "100vh" }
      }
    >
      <Box
        style={{ gridRow: mobileLayout ? "1" : "1 / 3", gridColumn: mobileLayout ? "1" : "1 / 4" }}
      >
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
          <Image
            src="/logo.png"
            alt="Amnesty International Logo"
            width={mobileLayout ? 200 : 400}
            height={mobileLayout ? 200 : 400}
          />
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
      <Box style={{ gridRow: mobileLayout ? "2" : "1", gridColumn: mobileLayout ? "1" : "4 / 10" }}>
        <Total
          totalLetters={data.totalLetters}
          totalDestinations={data.totalDestinations}
          totalAuthors={data.totalAuthors}
        />
      </Box>
      <Box style={{ gridRow: mobileLayout ? "3" : "2", gridColumn: mobileLayout ? "1" : "4 / 10" }}>
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
      <Box
        style={{
          gridRow: mobileLayout ? "4" : "1 / 3",
          gridColumn: mobileLayout ? "1" : "10 / 13",
        }}
      >
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
      <Box style={{ gridRow: mobileLayout ? "5" : "3", gridColumn: mobileLayout ? "1" : "1 / 13" }}>
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
