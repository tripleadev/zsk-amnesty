import { Paper } from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#FFFF00", "#FFBB28", "#FF8042", "#EA4335", "#CC0000"];

export const Authors = ({ classes }: { classes: { name: string; value: number }[] }) => {
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
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={20}
        fontFamily="Amnesty Trade Gothic Roman"
        fontWeight="bold"
      >
        <tspan x={x} y={y}>
          {classes[index].name}
        </tspan>
        <tspan x={x} y={y + 20}>{`${(percent * 100).toFixed(0)}%`}</tspan>
      </text>
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
        Top Authors
      </h1>
      <PieChart width={380} height={380}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={classes}
          labelLine={false}
          label={renderCustomizedLabel}
          cx="50%"
          cy="50%"
          outerRadius={175}
        >
          {classes.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Paper>
  );
};
