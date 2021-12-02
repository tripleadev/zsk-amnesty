import { Box } from "@mui/system";
import { Paper } from "@mui/material";
import { HistoryEdu, AccessibilityNew, LocationOn } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  title: {
    fontFamily: "Amnesty Trade Gothic Bold Condensed",
    margin: "0",
    textTransform: "uppercase",
    fontSize: 36,
  },
  number: {
    fontFamily: "Amnesty Trade Gothic Roman",
    margin: "0",
    fontSize: 36,
  },
  label: {
    fontFamily: "Amnesty Trade Gothic Roman",
    margin: "0",
    fontSize: 24,
    color: "rgba(0, 0, 0, 0.6)",
  },
});

export const Total = ({
  totalLetters,
  totalDestinations,
  totalAuthors,
}: {
  totalLetters: string;
  totalDestinations: string;
  totalAuthors: string;
}) => {
  const classes = useStyles();

  return (
    <Paper elevation={12} sx={{ p: 3 }}>
      <Box sx={{ mb: 1 }}>
        <h1 className={classes.title}>Total statistics</h1>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="48px 1fr 48px 1fr 48px 1fr"
        gridTemplateRows="1fr 0.5fr"
      >
        <Box
          gridColumn="1"
          gridRow="1"
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Box
            sx={{ p: 1, width: 48, height: 48, borderRadius: "50%", backgroundColor: "#ffff00" }}
          >
            <Box sx={{ height: 30 }}>
              <HistoryEdu sx={{ fontSize: 30 }} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="2" gridRow="1">
          <h2 className={classes.number}>{totalLetters}</h2>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="2" gridRow="2">
          <h3 className={classes.label}>Letters written</h3>
        </Box>
        <Box
          gridColumn="3"
          gridRow="1"
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Box
            sx={{ p: 1, width: 48, height: 48, borderRadius: "50%", backgroundColor: "#ffff00" }}
          >
            <Box sx={{ height: 30 }}>
              <AccessibilityNew sx={{ fontSize: 30 }} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="4" gridRow="1">
          <h2 className={classes.number}>{totalAuthors}</h2>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="4" gridRow="2">
          <h3 className={classes.label}>Participants</h3>
        </Box>
        <Box
          gridColumn="5"
          gridRow="1"
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Box
            sx={{ p: 1, width: 48, height: 48, borderRadius: "50%", backgroundColor: "#ffff00" }}
          >
            <Box sx={{ height: 30 }}>
              <LocationOn sx={{ fontSize: 30 }} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="6" gridRow="1">
          <h2 className={classes.number}>{totalDestinations}</h2>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="6" gridRow="2">
          <h3 className={classes.label}>Destinations</h3>
        </Box>
      </Box>
    </Paper>
  );
};
