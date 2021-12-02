import { Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const Destinations = ({
  destinations,
}: {
  destinations: { name: string; authored: number; anonymous: number }[];
}) => {
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
    <Paper elevation={12} sx={{ p: 3, width: "100%", height: "100%" }}>
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
      <BarChart
        width={1750}
        height={350}
        data={destinations}
        margin={{
          bottom: 25,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" textAnchor="end" interval={0} angle={-20} fontSize="12" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" height={36} formatter={renderColorfulLegendText} />
        <Bar dataKey="authored" stackId="a" fill="#FFFF00" />
        <Bar dataKey="anonymous" stackId="a" fill="#FFBB28" />
      </BarChart>
    </Paper>
  );
};
