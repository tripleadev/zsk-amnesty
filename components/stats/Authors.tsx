import { Paper, Box } from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { LinearProgress } from "@mui/material";
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
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
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
        <tspan x={x - 12} y={y + 16}>{`${(percent * 100).toFixed(0)}%`}</tspan>
      </text>
    );
  };

  return (
    <Paper
      elevation={12}
      sx={{ p: 3, width: "100%", height: "100%", display: "flex", flexDirection: "row" }}
    >
      <Box style={{ width: "100%", marginRight: "1.5rem" }}>
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
        {authors.map((author, index) => (
          <Box key={index}>
            <h3 className={classes.barTitle}>{author.name}</h3>
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
      <PieChart width={200} height={200}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={authors}
          labelLine={false}
          label={renderCustomizedLabel}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={40}
        >
          {authors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Paper>
  );
};
