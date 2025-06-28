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

const LEAVE_TYPES = {
  "on leave": "warning",
  "absent-sick": "error",
  "absent-personal": "error",
};

const LEAVE_DISPLAY = {
  "on leave": "On Leave",
  "absent-sick": "Sick Leave",
  "absent-personal": "Personal Leave",
};

const LeaveRecords = ({ attendance = [] }) => {
  const leaveRecords = (attendance || [])
    .filter((record) => {
      if (!record || !record.status) return false;
      const status = record.status.toLowerCase().replace(" - ", "-");
      return ["on leave", "absent-sick", "absent-personal"].includes(status);
    })
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Leave Records
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Leave Type</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Reason</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaveRecords.length > 0 ? (
            leaveRecords.map((record) => {
              const status = record.status.toLowerCase().replace(" - ", "-");
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
                    <Chip
                      label={LEAVE_DISPLAY[status] || status}
                      color={LEAVE_TYPES[status] || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.duration || "1 day"}</TableCell>
                  <TableCell>{record.notes || "No reason provided"}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No leave records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaveRecords;
