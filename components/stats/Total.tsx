import { Box } from "@mui/system";
import { Paper } from "@mui/material";
import { HistoryEdu, AccessibilityNew, LocationOn } from "@mui/icons-material";

export const Total = ({
  totalLetters,
  totalDestinations,
  totalAuthors,
}: {
  totalLetters: string;
  totalDestinations: string;
  totalAuthors: string;
}) => {
  return (
    <Paper elevation={6} sx={{ p: 3 }}>
      <Box sx={{ mb: 1 }}>
        <h1
          style={{
            fontFamily: "Amnesty Trade Gothic Bold Condensed",
            margin: "0",
            textTransform: "uppercase",
            fontSize: 36,
          }}
        >
          Total statistics
        </h1>
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
          <h2 style={{ margin: "0", fontSize: 36 }}>{totalLetters}</h2>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="2" gridRow="2">
          <h3 style={{ margin: "0", fontSize: 24 }}>Letters written</h3>
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
          <h2 style={{ margin: "0", fontSize: 36 }}>{totalAuthors}</h2>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="4" gridRow="2">
          <h3 style={{ margin: "0", fontSize: 24 }}>Participants</h3>
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
          <h2 style={{ margin: "0", fontSize: 36 }}>{totalDestinations}</h2>
        </Box>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }} gridColumn="6" gridRow="2">
          <h3 style={{ margin: "0", fontSize: 24 }}>Destinations</h3>
        </Box>
      </Box>
    </Paper>
  );
};
