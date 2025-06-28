import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { checkIn, getProfile } from "../utils/api";
import { CHECK_IN_CONFIG } from "../config/checkInConfig";

const STATUS_OPTIONS = [
  "Office",
  "Bootcamp",
  "Workshop",
  "Deployment",
  "Absent - Sick",
  "Absent - Personal",
  "On Leave",
];

const CheckIn = ({ setAttendance }) => {
  const [status, setStatus] = useState("Office");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [distance, setDistance] = useState(null);
  const [notes, setNotes] = useState("");
  const [checkInWindow, setCheckInWindow] = useState({
    isActive: false,
    message: "Checking availability...",
  });

  const getLocation = useCallback(() => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setGettingLocation(false);
      },
      (err) => {
        console.error(err);
        toast.error("Could not get location");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Check if current time is within allowed window
  useEffect(() => {
    const checkAvailability = () => {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayOfWeek = now.getDay();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Check blackout dates first
      if (CHECK_IN_CONFIG.blackoutDates.includes(currentDate)) {
        setCheckInWindow({
          isActive: false,
          message: "Check-in is not available today.",
        });
        return;
      }

      // Check for special date configuration
      let windowConfig =
        CHECK_IN_CONFIG.specialDates[currentDate] ||
        CHECK_IN_CONFIG.dayWindows[dayOfWeek] ||
        CHECK_IN_CONFIG.defaultWindow;

      const startTotalMins =
        windowConfig.startHour * 60 + windowConfig.startMinute;
      const endTotalMins = windowConfig.endHour * 60 + windowConfig.endMinute;
      const nowTotalMins = hours * 60 + minutes;

      let newCheckInWindow;

      if (nowTotalMins < startTotalMins) {
        newCheckInWindow = {
          isActive: false,
          message: `Check-in will open at ${
            windowConfig.startHour
          }:${windowConfig.startMinute.toString().padStart(2, "0")}`,
        };
      } else if (nowTotalMins > endTotalMins) {
        newCheckInWindow = {
          isActive: false,
          message: "Check-in is not available anymore today.",
        };
      } else {
        newCheckInWindow = {
          isActive: true,
          // message: `Check-in available until ${
          //   windowConfig.endHour
          // }:${windowConfig.endMinute.toString().padStart(2, "0")}`,
        };
      }

      setCheckInWindow(newCheckInWindow);
    };

    // Check immediately
    checkAvailability();

    // Check every minute to update the state
    const interval = setInterval(checkAvailability, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.data.lastCheckIn) {
          const last = new Date(res.data.lastCheckIn);
          const today = new Date();
          if (last.toDateString() === today.toDateString()) {
            setCheckedInToday(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (status === "Office" && !location) {
      getLocation();
    }
    setDistance(null);
  }, [status, getLocation, location]);

  const handleCheckIn = async () => {
    if (status === "Office" && !location) {
      toast.error("Waiting for location...");
      return;
    }

    try {
      setLoading(true);
      let payload = {
        status:
          status === "Office"
            ? "present"
            : status.toLowerCase().replace(" - ", "-"),
        notes: notes,
      };

      if (status === "Office") {
        payload.latitude = location.latitude;
        payload.longitude = location.longitude;
      }

      const res = await checkIn(payload);
      setCheckedInToday(true);

      if (res.data.distance !== undefined) {
        setDistance(res.data.distance);
      }

      setAttendance((prev) => [res.data, ...prev]);
      toast.success("Checked in successfully!");

      if (status !== "Office") {
        setNotes("");
      }
    } catch (err) {
      console.error("Check-in error:", err);
      if (err.message === "Network Error") {
        toast.error("Network error - please check your internet connection");
      } else if (err.response) {
        toast.error(err.response.data.error || "Check-in failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h5" gutterBottom>
        Daily Check-In
      </Typography>

      {checkedInToday ? (
        <Typography color="success.main" sx={{ mt: 2 }}>
          ✅ You've already checked in today.
        </Typography>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setDistance(null);
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {status !== "Office" && (
            <TextField
              label="Notes"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2 }}
              placeholder={`Add details about your ${status.toLowerCase()}...`}
            />
          )}

          {status === "Office" && (
            <>
              {gettingLocation ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CircularProgress size={24} />
                  <Typography>Getting location…</Typography>
                </Box>
              ) : location ? (
                <>
                  {/* <Typography>
                    Location: {location.latitude.toFixed(6)},{" "}
                    {location.longitude.toFixed(6)}
                  </Typography> */}
                  {distance !== null && (
                    <Typography sx={{ mt: 2 }}>
                      Distance from office: {distance.toFixed(2)} meters
                    </Typography>
                  )}
                </>
              ) : (
                <Typography color="error" sx={{ mt: 1 }}>
                  Location unavailable. Please allow location access and try
                  again.
                </Typography>
              )}
            </>
          )}

          <Typography
            color={checkInWindow.isActive ? "success.main" : "error"}
            sx={{ mt: 2 }}
          >
            {checkInWindow.message}
          </Typography>

          {checkInWindow.isActive && (
            <Button
              variant="contained"
              onClick={handleCheckIn}
              disabled={loading || (status === "Office" && !location)}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Check In"}
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default CheckIn;
