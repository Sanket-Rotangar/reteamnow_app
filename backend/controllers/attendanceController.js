import Attendance from "../models/attendance-model.js";
import Announcement from "../models/announcement-model.js";

// Check-in
export const checkIn = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    // Check for unread announcements that require acknowledgment
    const unreadRequiredAnnouncements = await Announcement.find({
      requiresAcknowledgment: true,
      readBy: { $ne: userId } // User has not read this announcement
    }).select('title _id');

    if (unreadRequiredAnnouncements.length > 0) {
      return res.status(403).json({
        message: "Please read all required announcements before checking in",
        code: "UNREAD_ANNOUNCEMENTS",
        unreadAnnouncements: unreadRequiredAnnouncements.map(ann => ({
          id: ann._id,
          title: ann.title
        }))
      });
    }
    
    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date();
    
    // Store time in 24-hour format for calculations
    const timeString24 = currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Display time in 12-hour format for user
    const displayTime = currentTime.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });

    // Check if user already checked in today
    const existing = await Attendance.findOne({ userId, date: today });
    if (existing && existing.checkInTime) {
      return res.status(400).json({ 
        message: "Already checked in today",
        attendance: existing
      });
    }

    let attendance;
    if (existing) {
      // Update existing record
      existing.checkInTime = timeString24;
      existing.checkInTimeDisplay = displayTime;
      existing.status = "present";
      attendance = await existing.save();
    } else {
      // Create new record
      attendance = new Attendance({
        userId,
        date: today,
        checkInTime: timeString24,
        checkInTimeDisplay: displayTime,
        status: "present"
      });
      attendance = await attendance.save();
    }

    res.json({ message: "Check-in successful", attendance });
  } catch (err) {
    console.error('Check-in error:', err);
    
    // Handle duplicate key error specifically
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Attendance record already exists for today. Please refresh and try again." 
      });
    }
    
    res.status(500).json({ error: err.message });
  }
};

// Check-out
export const checkOut = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({ userId, date: today });
    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: "No check-in found for today" });
    }
    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const currentTime = new Date();
    
    // Store checkout time in 24-hour format for calculations
    const checkOutTime24 = currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Display time in 12-hour format for user
    const displayTime = currentTime.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
    
    attendance.checkOutTime = checkOutTime24;
    attendance.checkOutTimeDisplay = displayTime;
    
    // Calculate total hours worked using 24-hour format
    try {
      const checkInTime = attendance.checkInTime; // Already in 24-hour format
      const checkOutTime = checkOutTime24;
      
      // Create Date objects for today with these times
      const checkInDateTime = new Date(`${today}T${checkInTime}`);
      const checkOutDateTime = new Date(`${today}T${checkOutTime}`);
      
      const timeDiff = checkOutDateTime - checkInDateTime;
      const hours = timeDiff / (1000 * 60 * 60);
      const minutes = timeDiff / (1000 * 60);
      
      let totalHoursDisplay;
      if (hours >= 1) {
        totalHoursDisplay = `${Math.max(0, hours).toFixed(1)}h`;
      } else if (minutes >= 1) {
        totalHoursDisplay = `${Math.floor(Math.max(0, minutes))}m`;
      } else {
        totalHoursDisplay = '0m';
      }
      
      console.log(`Check-in: ${checkInTime}, Check-out: ${checkOutTime}`);
      console.log(`Time difference (ms): ${timeDiff}`);
      console.log(`Hours: ${hours.toFixed(2)}, Minutes: ${minutes.toFixed(1)}`);
      console.log(`Display: ${totalHoursDisplay}`);
      
      attendance.totalHours = totalHoursDisplay;
      
    } catch (error) {
      console.error('Time calculation error:', error);
      attendance.totalHours = '0m';
    }
    
    await attendance.save();

    res.json({ message: "Check-out successful", attendance });
  } catch (err) {
    console.error('Check-out error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get today's attendance
export const getToday = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const today = new Date().toISOString().split("T")[0];
    const attendance = await Attendance.findOne({ userId, date: today });
    
    if (!attendance) {
      return res.json({ message: "No record for today" });
    }
    
    res.json(attendance);
  } catch (err) {
    console.error('Get today attendance error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get history
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const history = await Attendance.find({ userId })
      .sort({ date: -1 })
      .limit(30); // Limit to last 30 records
      
    res.json(history);
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: err.message });
  }
};
