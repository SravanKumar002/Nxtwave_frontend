import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const WorkshopRecords = ({ attendance = [] }) => {
  const workshopRecords = (attendance || [])
    .filter((record) => {
      if (!record || !record.status) return false;
      return record.status.toLowerCase() === "workshop";
    })
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Workshop Records
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Check-In Time</TableCell>
            <TableCell>Workshop Details</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workshopRecords.length > 0 ? (
            workshopRecords.map((record) => (
              <TableRow
                key={record._id || `${record.date}-${record.checkInTime}`}
              >
                <TableCell>
                  {record.date
                    ? new Date(record.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {record.checkInTime
                    ? new Date(record.checkInTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>{record.workshopName || "Workshop"}</TableCell>
                <TableCell>{record.notes || "No notes provided"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No workshop records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorkshopRecords;
