import { Box } from "@mui/system";
import { Paper, useMediaQuery } from "@mui/material";
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
  totalLetters: number;
  totalDestinations: number;
  totalAuthors: number;
}) => {
  const classes = useStyles();
  const mobileLayout = useMediaQuery("(max-width:1250px)");
  const smallText = useMediaQuery("(max-width: 1610px)");
  const numSize = smallText ? 28 : 36;
  const labelSize = smallText ? 18 : 24;

  return (
    <Paper
      elevation={12}
      sx={{ p: 3, height: "100%", display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      <Box sx={{ mb: 1 }}>
        <h1 className={classes.title}>Total statistics</h1>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: mobileLayout ? "48px 1fr" : "48px 1fr 48px 1fr 48px 1fr",
            gridTemplateRows: mobileLayout ? "1fr 0.5fr 1fr 0.5fr 1fr 0.5fr" : "1fr 0.5fr",
            gridColumnGap: "1.5rem",
          }}
        >
          <Box
            gridColumn={mobileLayout ? "1" : "1"}
            gridRow={mobileLayout ? "1" : "1"}
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
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            gridColumn={mobileLayout ? "2" : "2"}
            gridRow={mobileLayout ? "1" : "1"}
          >
            <h2 className={classes.number} style={{ fontSize: numSize }}>
              {totalLetters}
            </h2>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            gridColumn={mobileLayout ? "2" : "2"}
            gridRow={mobileLayout ? "2" : "2"}
          >
            <h3 className={classes.label} style={{ fontSize: labelSize }}>
              Letters written
            </h3>
          </Box>
          <Box
            gridColumn={mobileLayout ? "1" : "3"}
            gridRow={mobileLayout ? "3" : "1"}
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
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            gridColumn={mobileLayout ? "2" : "4"}
            gridRow={mobileLayout ? "3" : "1"}
          >
            <h2 className={classes.number} style={{ fontSize: numSize }}>
              {totalAuthors}
            </h2>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            gridColumn={mobileLayout ? "2" : "4"}
            gridRow={mobileLayout ? "4" : "2"}
          >
            <h3 className={classes.label} style={{ fontSize: labelSize }}>
              Participants
            </h3>
          </Box>
          <Box
            gridColumn={mobileLayout ? "1" : "5"}
            gridRow={mobileLayout ? "5" : "1"}
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
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            gridColumn={mobileLayout ? "2" : "6"}
            gridRow={mobileLayout ? "5" : "1"}
          >
            <h2 className={classes.number} style={{ fontSize: numSize }}>
              {totalDestinations}
            </h2>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            gridColumn={mobileLayout ? "2" : "6"}
            gridRow={mobileLayout ? "6" : "2"}
          >
            <h3 className={classes.label} style={{ fontSize: labelSize }}>
              Destinations
            </h3>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
