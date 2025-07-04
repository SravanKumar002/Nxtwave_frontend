import { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [metrics, setMetrics] = useState({
    presentCount: 0,
    leaveCount: 0,
    lateCount: 0,
    attendancePercentage: 0,
    totalEmployees: 0,
    presentEmployees: [],
    leaveEmployees: [],
    lateArrivals: [],
  });
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log(token);
        const res = await axios.get(
          `http://localhost:3000/api/admin/attendance?date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const todayRecords = res.data;

        setRecords(todayRecords);
        calculateMetrics(todayRecords);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch attendance data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const calculateMetrics = (attendanceRecords) => {
    const totalRecords = attendanceRecords.length;
    const presentEmployees = attendanceRecords.filter(
      (r) => r.status.toLowerCase() === "present"
    );

    const leaveEmployees = attendanceRecords.filter((r) =>
      ["leave", "absent"].some((term) => r.status.toLowerCase().includes(term))
    );

    const lateArrivals = presentEmployees.filter((r) => {
      const checkInTime = new Date(r.checkInTime);
      return (
        checkInTime.getHours() > 9 ||
        (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 10)
      );
    });

    const attendancePercentage =
      totalRecords > 0
        ? ((presentEmployees.length / totalRecords) * 100).toFixed(1)
        : 0;

    setMetrics({
      presentCount: presentEmployees.length,
      leaveCount: leaveEmployees.length,
      lateCount: lateArrivals.length,
      attendancePercentage,
      totalEmployees: new Set(attendanceRecords.map((r) => r.employeeId)).size,
      presentEmployees,
      leaveEmployees,
      lateArrivals,
    });
  };

  const getAttendanceChartData = () => ({
    labels: ["Present", "On Leave", "Late Arrivals"],
    datasets: [
      {
        data: [metrics.presentCount, metrics.leaveCount, metrics.lateCount],
        backgroundColor: ["#4CAF50", "#FFA500", "#F44336"],
        borderColor: ["#388E3C", "#E65100", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTable = (data, showLateMinutes = false) => {
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Check-in Time</TableCell>
              <TableCell>Status</TableCell>
              {showLateMinutes && <TableCell>Minutes Late</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record) => {
              const checkInTime = new Date(record.checkInTime);
              const lateMinutes = showLateMinutes
                ? (checkInTime.getHours() - 9) * 60 +
                  (checkInTime.getMinutes() - 10)
                : 0;

              return (
                <TableRow key={record._id}>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.employeeId}</TableCell>
                  <TableCell>
                    {checkInTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      size="small"
                      color={
                        record.status.toLowerCase() === "present"
                          ? "success"
                          : record.status.toLowerCase().includes("leave")
                          ? "warning"
                          : "default"
                      }
                    />
                  </TableCell>
                  {showLateMinutes && (
                    <TableCell>
                      {lateMinutes > 0 && (
                        <Chip
                          label={`${lateMinutes} mins`}
                          size="small"
                          color="error"
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#333" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="https://nxtwave-website-media-files.s3.ap-south-1.amazonaws.com/ccbp-website/Nxtwave_Colored.svg"
              alt="Nxtwave Logo"
              style={{ height: 40 }}
            />
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
          >
            User Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Date picker */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Date:
          </Typography>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            inputProps={{ max: new Date().toISOString().slice(0, 10) }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Key Metrics Section */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6" color="textSecondary">
                        Attendance
                      </Typography>
                      <Chip
                        label={`${metrics.attendancePercentage}%`}
                        color="success"
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {metrics.presentCount} present of {metrics.totalEmployees}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary">
                      Present
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {metrics.presentCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary">
                      On Leave
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {metrics.leaveCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary">
                      Late Arrivals
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {metrics.lateCount}
                    </Typography>
                    <Typography variant="caption">(After 9:10 AM)</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Visualization Section */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Attendance Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <Pie
                      data={getAttendanceChartData()}
                      options={{
                        plugins: {
                          legend: { position: "bottom" },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const total = context.dataset.data.reduce(
                                  (a, b) => a + b,
                                  0
                                );
                                const value = context.raw;
                                const percentage = Math.round(
                                  (value / total) * 100
                                );
                                return `${context.label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Attendance
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {records.slice(0, 5).map((rec) => (
                          <TableRow key={rec._id}>
                            <TableCell>{rec.employeeName}</TableCell>
                            <TableCell>
                              {new Date(rec.checkInTime).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={rec.status}
                                size="small"
                                color={
                                  rec.status.toLowerCase() === "present"
                                    ? "success"
                                    : rec.status.toLowerCase().includes("leave")
                                    ? "warning"
                                    : "default"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Detailed Tables Section */}
            <Paper sx={{ p: 2, mt: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label={`Present (${metrics.presentCount})`} />
                <Tab label={`On Leave (${metrics.leaveCount})`} />
                <Tab label={`Late Arrivals (${metrics.lateCount})`} />
              </Tabs>
              <Divider />

              {tabValue === 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Present Employees
                  </Typography>
                  {metrics.presentCount > 0 ? (
                    renderTable(metrics.presentEmployees)
                  ) : (
                    <Typography sx={{ p: 2 }}>
                      No present employees found
                    </Typography>
                  )}
                </Box>
              )}

              {tabValue === 1 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Employees On Leave
                  </Typography>
                  {metrics.leaveCount > 0 ? (
                    renderTable(metrics.leaveEmployees)
                  ) : (
                    <Typography sx={{ p: 2 }}>No employees on leave</Typography>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Late Arrivals (After 9:10 AM)
                  </Typography>
                  {metrics.lateCount > 0 ? (
                    renderTable(metrics.lateArrivals, true)
                  ) : (
                    <Typography sx={{ p: 2 }}>
                      No late arrivals today
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </>
        )}
      </Container>
    </>
  );
};

export default AdminDashboard;
