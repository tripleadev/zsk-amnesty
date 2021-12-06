import { Paper, Box } from "@mui/material";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { LinearProgress, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";

const COLORS = ["#FFFF00", "#FFBB28", "#FF8042", "#EA4335", "#CC0000"];

const useStyles = makeStyles({
  colorPrimary: {
    backgroundColor: "#FFFF00",
  },
  barColorPrimary: {
    backgroundColor: "#FFBB28",
  },
  barTitle: {
    margin: 0,
    marginTop: "0.4rem",
    fontFamily: "Amnesty Trade Gothic Roman",
  },
});

export const Authors = ({ authors }: { authors: { name: string; value: number }[] }) => {
  const classes = useStyles();
  const smallChart = useMediaQuery("(max-height:850px)");
  const chartHeight = smallChart ? 100 : 200;

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    value,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    value: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor={"start"}
        dominantBaseline="central"
        fontSize={14}
        fontFamily="Amnesty Trade Gothic Roman"
        fontWeight="bold"
      >
        <tspan x={x - 12} y={y}>
          {authors[index].name}
        </tspan>
        <tspan x={x - 12} y={y + 16}>
          {value}
        </tspan>
      </text>
    );
  };

  return (
    <Paper
      elevation={12}
      sx={{ p: 3, width: "100%", height: "100%", display: "flex", flexDirection: "row" }}
    >
      <Box
        style={{
          display: "grid",
          gridTemplateRows: "auto auto",
          width: "100%",
          marginRight: "1.5rem",
        }}
      >
        <h1
          style={{
            fontFamily: "Amnesty Trade Gothic Bold Condensed",
            margin: "0",
            textTransform: "uppercase",
            fontSize: 36,
          }}
        >
          Top Authors
        </h1>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box>
            {authors.map((author, index) => (
              <Box key={index}>
                <h3 className={classes.barTitle}>
                  {author.name} - {author.value} letters
                </h3>
                <LinearProgress
                  variant="determinate"
                  value={
                    (author.value /
                      authors.map((item) => item.value).reduce((prev, next) => prev + next)) *
                    100
                  }
                  classes={{
                    colorPrimary: classes.colorPrimary,
                    barColorPrimary: classes.barColorPrimary,
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: chartHeight,
          height: "100%",
          p: "1rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ResponsiveContainer height={chartHeight / 1.1} width={chartHeight / 1.1}>
          <PieChart width={chartHeight} height={chartHeight}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={authors}
              labelLine={false}
              label={renderCustomizedLabel}
              cx="50%"
              cy="50%"
              outerRadius={chartHeight / 2.2}
              innerRadius={chartHeight / 5}
            >
              {authors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
