export const CHECK_IN_CONFIG = {
  defaultWindow: {
    startHour: 8,
    startMinute: 30,
    endHour: 9,
    endMinute: 10,
  },

  dayWindows: {
    5: { startHour: 9, startMinute: 0, endHour: 9, endMinute: 30 }, // Friday
    6: { startHour: 10, startMinute: 0, endHour: 12, endMinute: 40 }, // Saturday
  },

  blackoutDates: ["2023-12-25", "2024-01-01"],

  specialDates: {
    "2023-12-24": {
      startHour: 10,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
    },
  },
};
