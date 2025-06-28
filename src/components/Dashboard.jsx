// Dashboard.js
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProfile, getAttendance } from "../utils/api";
import { Box, Typography, Tab, Tabs } from "@mui/material";
import CheckIn from "./CheckIn";
import AttendanceHistory from "./AttendanceHistory";
import Navbar from "./Navbar";
import BootcampRecords from "./BootcampRecords";
import WorkshopRecords from "./WorkshopRecords";
import DeploymentRecords from "./DeploymentRecords";
import LeaveRecords from "./LeaveRecords";

const Dashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [attendance, setAttendance] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await getProfile();
        setEmployee(profileResponse.data);

        const attendanceResponse = await getAttendance();
        setAttendance(attendanceResponse.data);
      } catch (error) {
        toast.error("Error loading data");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Navbar employee={employee} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {employee.name}
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
          <Tab label="Check In" />
          <Tab label="Attendance History" />
          <Tab label="Bootcamp" />
          <Tab label="Workshop" />
          <Tab label="Deployment" />
          <Tab label="Leave Records" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && <CheckIn setAttendance={setAttendance} />}
          {tabValue === 1 && <AttendanceHistory attendance={attendance} />}
          {tabValue === 2 && <BootcampRecords attendance={attendance} />}
          {tabValue === 3 && <WorkshopRecords attendance={attendance} />}
          {tabValue === 4 && <DeploymentRecords attendance={attendance} />}
          {tabValue === 5 && <LeaveRecords attendance={attendance} />}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
