import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from "@mui/material";

const STATUS_COLORS = {
  present: "success",
  "on leave": "warning",
  "absent-sick": "error",
  "absent-personal": "error",
  bootcamp: "info",
  workshop: "info",
  deployment: "info",
};

const STATUS_DISPLAY = {
  present: "Present (Office)",
  "on leave": "On Leave",
  "absent-sick": "Absent (Sick)",
  "absent-personal": "Absent (Personal)",
  bootcamp: "Bootcamp",
  workshop: "Workshop",
  deployment: "Deployment",
};

const AttendanceHistory = ({ attendance = [] }) => {
  // Safely sort and filter attendance records
  const sortedAttendance = [...(attendance || [])]
    .filter((record) => record && record.status) // Filter out undefined/null records
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Attendance History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Check-In Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedAttendance.length > 0 ? (
            sortedAttendance.map((record) => {
              const status = record.status?.toLowerCase() || "unknown";
              return (
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
                      ? new Date(record.checkInTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_DISPLAY[status] || status}
                      color={STATUS_COLORS[status] || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.notes || "No notes"}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No attendance records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceHistory;
