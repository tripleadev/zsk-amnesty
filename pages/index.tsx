import { useQuery } from "react-query";
import { fetcher } from "../lib/fetcher";
import { Box, Paper, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { SEO } from "../components/common/SEO";

import { Total } from "../components/stats/Total";
import { Classes } from "../components/stats/Classes";
import { Destinations } from "../components/stats/Destinations";
import { Authors } from "../components/stats/Authors";
import { useReloadOnResize } from "../lib/hooks/useReloadOnResize";
import { InferGetStaticPropsType } from "next";
import { getStats } from "../lib/stats/stats";
import { Stats } from "../lib/stats/types";

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
  const { data } = useQuery("/api/stats", fetcher<Stats>("/api/stats"), {
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
          totalLetters={Number(data.totalLetters || 0)}
          totalDestinations={Number(data.totalDestinations || 0)}
          totalAuthors={Number(data.totalAuthors || 0)}
        />
      </Box>
      <Box style={{ gridRow: mobileLayout ? "3" : "2", gridColumn: mobileLayout ? "1" : "4 / 10" }}>
        <Authors
          authors={data.topAuthors.map((a) => ({
            name: `${a.classId} - ${a.registerNumber}`,
            value: Number(a.letters || 0),
          }))}
        />
      </Box>
      <Box
        style={{
          gridRow: mobileLayout ? "4" : "1 / 3",
          gridColumn: mobileLayout ? "1" : "10 / 13",
        }}
      >
        <Classes
          classes={data.lettersByClass.map((c) => ({
            name: c.classId || "Anonymous",
            value: Number(c.lettersCount || 0),
          }))}
        />
      </Box>
      <Box style={{ gridRow: mobileLayout ? "5" : "3", gridColumn: mobileLayout ? "1" : "1 / 13" }}>
        <Destinations
          destinations={data.lettersByDestination.map((d) => {
            const ad = data.anonymousLettersByDestination.find(
              (ad) => ad.destinationId === d.destinationId,
            );

            return {
              name: d.name,
              authored: Number(d.lettersCount || 0) - Number(ad?.anonymousLettersCount || 0),
              anonymous: Number(ad?.anonymousLettersCount || 0),
            };
          })}
        />
      </Box>
    </Box>
  );
};

export const getStaticProps = async () => {
  const initialData = await getStats();

  return {
    props: {
      initialData,
    },
    revalidate: 30,
  };
};

export default Home;
