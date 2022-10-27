import { useQuery } from "react-query";
import { fetcher } from "../lib/fetcher";
import { Box, Paper, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { extractFilters } from "../lib/stats/format";
import { SEO } from "../components/common/SEO";

import { Total } from "../components/stats/Total";
import { Classes } from "../components/stats/Classes";
import { Destinations } from "../components/stats/Destinations";
import { Authors } from "../components/stats/Authors";
import { useReloadOnResize } from "../lib/hooks/useReloadOnResize";
import { InferGetStaticPropsType } from "next";
import { generateStats } from "../lib/stats/stats";

const useStyles = makeStyles({
  grid: {
    padding: "1rem",
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridTemplateRows: "1fr 1fr auto",
    gridGap: "1rem",
    backgroundColor: "#eeeeee",
  },
});

const Home = ({ initialData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data } = useQuery("/api/stats", fetcher("/api/stats"), {
    refetchInterval: 30000,
    initialData,
  });
  const classes = useStyles();
  const mobileLayout = useMediaQuery("(max-width:1250px)");

  // Fix to make recharts charts responsive
  useReloadOnResize();

  if (!data) return <div>loading...</div>;

  return (
    <Box
      className={classes.grid}
      style={
        mobileLayout
          ? { gridTemplateColumns: "auto", gridTemplateRows: "repeat(5, auto)", minHeight: "100vh" }
          : { minHeight: "100vh" }
      }
    >
      <SEO />
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
          authors={extractFilters(data, "top.").map((key) => {
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
          classes={extractFilters(data, "lettersOfClass.").map((key) => {
            return {
              name: key.replace("lettersOfClass.", ""),
              value: parseInt(data[key]),
            };
          })}
        />
      </Box>
      <Box style={{ gridRow: mobileLayout ? "5" : "3", gridColumn: mobileLayout ? "1" : "1 / 13" }}>
        <Destinations
          destinations={extractFilters(data, "lettersTo.").map((key) => {
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

export const getStaticProps = async () => {
  const initialData = await generateStats();

  return {
    props: {
      initialData,
    },
    revalidate: 30,
  };
};

export default Home;
