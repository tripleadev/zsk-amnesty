import { Paper, Box } from "@mui/material";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useMediaQuery } from "@mui/material";

const COLORS = ["#FFFF00", "#FFBB28", "#FF8042", "#EA4335", "#CC0000"];

export const Classes = ({ classes }: { classes: { name: string; value: number }[] }) => {
  const smallChart = useMediaQuery("(max-width:1660px)");
  const width = smallChart ? 250 : 350;

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

    if (percent * 100 > 10) {
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
          <tspan x={x} y={y + 20}>
            {value}
          </tspan>
        </text>
      );
    } else return null;
  };

  return (
    <Paper
      elevation={12}
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr",
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
        Letters by Class
      </h1>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <ResponsiveContainer height={width} width="100%">
          <PieChart width={width} height={width}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={classes}
              labelLine={false}
              label={renderCustomizedLabel}
              cx="50%"
              cy="50%"
              outerRadius={width / 2}
            >
              {classes.map((entry, index) => (
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
