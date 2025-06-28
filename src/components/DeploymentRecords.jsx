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

const DeploymentRecords = ({ attendance = [] }) => {
  const deploymentRecords = (attendance || [])
    .filter((record) => {
      if (!record || !record.status) return false;
      return record.status.toLowerCase() === "deployment";
    })
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Deployment Records
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Check-In Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deploymentRecords.length > 0 ? (
            deploymentRecords.map((record) => (
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
                <TableCell>
                  {record.location?.coordinates
                    ? `${(record.location.coordinates[1] || 0).toFixed(4)}, ${(
                        record.location.coordinates[0] || 0
                      ).toFixed(4)}`
                    : "Location not available"}
                </TableCell>
                <TableCell>{record.notes || "No notes provided"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No deployment records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DeploymentRecords;
