import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

const STATUS_COLORS = {
  bootcamp: "primary",
  present: "success",
  "on leave": "warning",
  "absent-sick": "error",
  "absent-personal": "error",
  workshop: "info",
  deployment: "info",
};

const BootcampRecords = ({ attendance = [] }) => {
  const bootcampRecords = (attendance || [])
    .filter((record) => {
      if (!record || !record.status) return false;
      return record.status.toLowerCase() === "bootcamp";
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Bootcamp Attendance Records
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {/* <TableCell>Employee Name</TableCell> */}
            <TableCell>Employee ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Check-In Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bootcampRecords.length > 0 ? (
            bootcampRecords.map((record) => (
              <TableRow
                key={record._id || `${record.employeeId}-${record.date}`}
              >
                {/* <TableCell>
                  {record.employeeName || "Unknown Employee"}
                </TableCell> */}
                <TableCell>{record.employeeId || "N/A"}</TableCell>
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
                <TableCell>
                  <Chip
                    label={record.status || "Unknown"}
                    color={
                      STATUS_COLORS[record.status?.toLowerCase()] || "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{record.notes || "No notes"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No bootcamp attendance records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BootcampRecords;
