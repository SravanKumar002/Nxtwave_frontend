import React, { useState } from "react";
import topics from "../Topics/topics_responsive";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";

export default function ResponsiveContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState(
    topics.map((topic) => ({
      topic,
      checked: false,
      startTime: "",
      endTime: "",
    }))
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCheckbox = (index) => {
    const updated = [...data];
    updated[index].checked = !updated[index].checked;
    setData(updated);
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleRowSave = (index) => {
    const row = data[index];
    console.log("Saved Row:", row);
    alert(`Saved: "${row.topic}"`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsToDisplay = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        All Responsive Topics
      </Typography>

      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Topic</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rowsToDisplay.map((row, index) => {
              const globalIndex = page * rowsPerPage + index;
              return (
                <TableRow
                  key={globalIndex}
                  sx={{
                    backgroundColor: globalIndex % 2 === 0 ? "#fafafa" : "#fff",
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={row.checked}
                      onChange={() => handleCheckbox(globalIndex)}
                      size={isMobile ? "small" : "medium"}
                    />
                  </TableCell>

                  <TableCell sx={{ maxWidth: isMobile ? 100 : 300 }}>
                    <Typography variant={isMobile ? "body2" : "body1"} noWrap>
                      {row.topic}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="time"
                      size="small"
                      value={row.startTime}
                      onChange={(e) =>
                        handleTimeChange(
                          globalIndex,
                          "startTime",
                          e.target.value
                        )
                      }
                      inputProps={{ step: 300 }}
                      fullWidth
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="time"
                      size="small"
                      value={row.endTime}
                      onChange={(e) =>
                        handleTimeChange(globalIndex, "endTime", e.target.value)
                      }
                      inputProps={{ step: 300 }}
                      fullWidth
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleRowSave(globalIndex)}
                      fullWidth={isMobile}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
