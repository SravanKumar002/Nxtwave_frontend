import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfile, getAttendance } from "../utils/api";
import { Box, Typography, Tab, Tabs, useMediaQuery } from "@mui/material";

import CheckIn from "./CheckIn";
import AttendanceHistory from "./AttendanceHistory";
import Navbar from "./Navbar";
import BootcampRecords from "./BootcampRecords";
import WorkshopRecords from "./WorkshopRecords";
import DeploymentRecords from "./DeploymentRecords";
import LeaveRecords from "./LeaveRecords";
// import StaticContent from "./StaticContent";
// import ResponsiveContent from "./ResponsiveContent";
// import DynamicContent from "./DynamicContent";

const Dashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [attendance, setAttendance] = useState([]);

  const isMobile = useMediaQuery("(max-width:768px)");

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

  if (!employee) return <div>Loading...</div>;

  return (
    <Box>
      <Navbar employee={employee} />

      {/* Tabs + Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100%",
        }}
      >
        {/* Tabs Section */}
        <Box
          sx={{
            width: isMobile ? "100%" : 200,
            backgroundColor: "#f5f5f5",
            boxShadow: 1,
            p: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            orientation={isMobile ? "horizontal" : "vertical"}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              borderRight: isMobile ? 0 : 1,
              borderBottom: isMobile ? 1 : 0,
              borderColor: "divider",
            }}
          >
            <Tab label="Check In" />
            <Tab label="Attendance History" />
            <Tab label="Bootcamp" />
            <Tab label="Workshop" />
            <Tab label="Deployment" />
            <Tab label="Leave Records" />
            {/* <Tab label="Static" />
            <Tab label="Responsive" />
            <Tab label="Dynamic" /> */}
          </Tabs>
        </Box>

        {/* Content Section */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Welcome, {employee.name}
          </Typography>

          {tabValue === 0 && <CheckIn setAttendance={setAttendance} />}
          {tabValue === 1 && <AttendanceHistory attendance={attendance} />}
          {tabValue === 2 && <BootcampRecords attendance={attendance} />}
          {tabValue === 3 && <WorkshopRecords attendance={attendance} />}
          {tabValue === 4 && <DeploymentRecords attendance={attendance} />}
          {tabValue === 3 && <LeaveRecords attendance={attendance} />}
          {/* {tabValue === 4 && <StaticContent />}
          {tabValue === 5 && <ResponsiveContent />}
          {tabValue === 6 && <DynamicContent />} */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
