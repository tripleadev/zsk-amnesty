import { Paper, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from "@mui/material";

export const Destinations = ({
  destinations,
}: {
  destinations: { name: string; authored: number; anonymous: number }[];
}) => {
  const bigChart = useMediaQuery("(max-height:1115px)");
  const smallChart = useMediaQuery("(max-height:970px)");
  const textView = useMediaQuery("(max-width:600px)");
  const height = bigChart && !smallChart ? 300 : smallChart ? 200 : 350;

  const renderColorfulLegendText = (value: string) => {
    return (
      <span
        style={{
          color: "#000000",
          fontFamily: "Amnesty Trade Gothic Roman",
          textTransform: "capitalize",
        }}
      >
        {value}
      </span>
    );
  };

  return (
    <Paper
      elevation={12}
      sx={{ p: 3, width: "100%", height: "100%", display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      <h1
        style={{
          fontFamily: "Amnesty Trade Gothic Bold Condensed",
          margin: "0",
          textTransform: "uppercase",
          fontSize: 36,
        }}
      >
        Letters by Destination
      </h1>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {textView ? (
          destinations
            .sort((a, b) => b.authored + b.anonymous - (a.authored + a.anonymous))
            .map((destination) => (
              <Box key={destination.name}>
                {destination.authored + destination.anonymous} - {destination.name}
              </Box>
            ))
        ) : (
          <ResponsiveContainer height={height} width="100%">
            <BarChart
              width={1750}
              height={height}
              data={destinations}
              margin={{
                bottom: 25,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" textAnchor="end" interval={0} angle={-25} fontSize="12" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} formatter={renderColorfulLegendText} />
              <Bar dataKey="authored" stackId="a" fill="#FFFF00" />
              <Bar dataKey="anonymous" stackId="a" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};
