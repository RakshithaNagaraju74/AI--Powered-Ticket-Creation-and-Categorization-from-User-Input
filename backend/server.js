const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
const io = new Server(server, { 
  cors: { 
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  } 
});


const authRoutes = require('./routes/auth');
const Ticket = require('./models/Ticket'); 
const User = require('./models/User');
// Make sure you're importing and using the auth routes correctly
app.use('/api/auth', authRoutes);
const Notification = require('./models/Notification');




// MongoDB connection
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/nexus_support')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));



// --- LEADERBOARD API ---
app.get('/api/agents/leaderboard', async (req, res) => {
  try {
    const board = await Ticket.aggregate([
      { $match: { status: "resolved", assignedTo: { $ne: null } } },
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(board);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// --- TICKET GENERATION API ---
// --- TICKET GENERATION API ---
app.post('/api/tickets/generate', async (req, res) => {
  try {
    console.log("Received ticket generation request:", req.body);
    const { title, description, userId } = req.body;
    
    if (!title || !description || !userId) {
      return res.status(400).json({ 
        error: "Title, description, and user ID are required",
        received: { title, description, userId }
      });
    }

    // First, get user details
    let user;
    try {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (userError) {
      console.error("User lookup error:", userError);
      return res.status(404).json({ error: "User not found" });
    }

    // Call AI service for classification
    let aiResponse;
    try {
      console.log("Calling AI service at http://localhost:8000/classify");
      aiResponse = await axios.post('http://localhost:8000/classify', {
        title,
        description
      }, { 
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("AI Service Response:", aiResponse.data);
      
      if (!aiResponse.data) {
        throw new Error("AI service returned empty response");
      }
      
    } catch (aiError) {
      console.error("AI service error:", aiError.message);
      console.error("AI error details:", aiError.response?.data || aiError);
      return res.status(500).json({ 
        error: "AI classification service failed",
        details: aiError.message,
        suggestion: "Please ensure the AI service is running on http://localhost:8000"
      });
    }

    // Create ticket with AI response
    const ticketData = {
      title: title,
      description: description,
      userEmail: user.email, // Use the actual email from user document
      category: aiResponse.data.category || "General",
      priority: aiResponse.data.priority || "Medium",
      status: "open",
      created_at: aiResponse.data.created_at || new Date().toISOString(),
      category_confidence: aiResponse.data.category_confidence || 0,
      priority_confidence: aiResponse.data.priority_confidence || 0,
      entities: aiResponse.data.entities || { devices: [], usernames: [], error_codes: [] }
    };

    console.log("Creating ticket with data:", ticketData);

    const ticket = new Ticket(ticketData);
    await ticket.save();
    
    // Create notification for new ticket
    const notification = new Notification({
      userEmail: user.email,
      type: 'ticket_created',
      title: 'Ticket Created',
      message: `Your ticket "${title.substring(0, 50)}..." has been created`,
      data: {
        ticketId: ticket._id,
        title: title,
        category: ticket.category,
        priority: ticket.priority
      },
      read: false
    });
    await notification.save();
    
    // Emit socket event
    io.emit('ticket_created', {
      ticketId: ticket._id,
      userEmail: user.email,
      category: ticket.category,
      priority: ticket.priority,
      timestamp: new Date()
    });
    
    console.log("Ticket created successfully:", ticket._id);
    res.json(ticket);
    
  } catch (err) {
    console.error('Ticket creation failed:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: "Ticket creation failed", 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});
// Add this endpoint to your server.js
app.get('/api/stats/support-team', async (req, res) => {
  try {
    // Count users with role 'agent'
    const supportTeamCount = await User.countDocuments({ role: 'agent' });
    
    // Get list of active support agents
    const supportTeam = await User.find({ role: 'agent' })
      .select('name email department position')
      .limit(10);
    
    res.json({
      count: supportTeamCount,
      team: supportTeam,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Error fetching support team:', err);
    res.status(500).json({ error: "Failed to fetch support team data" });
  }
});
// --- DYNAMIC LIVE STATS API ---
// server.js - Update the Live Stats endpoint
// Update the live stats endpoint in server.js
app.get('/api/stats/live', async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const last30Days = new Date(todayStart);
    last30Days.setDate(last30Days.getDate() - 30);

    // 1. Count total support team members (users with role 'agent')
    const supportTeamMembers = await User.countDocuments({ role: 'agent' });

    // 2. DYNAMIC AGENT COUNT: Get from the Socket Map
    const onlineAgentsCount = Array.from(activeUsers.values())
      .filter(u => u.role === 'agent').length;

    // 3. Fetch Ticket counts
    const ticketsToday = await Ticket.countDocuments({ 
      created_at: { $gte: todayStart } 
    });
    
    const resolvedToday = await Ticket.countDocuments({ 
      status: 'resolved', 
      updatedAt: { $gte: todayStart } 
    });
    
    const activeTickets = await Ticket.countDocuments({ 
      status: { $in: ['open', 'in_progress'] } 
    });

    // 4. Calculate DYNAMIC average response time (in minutes)
    // Get all resolved tickets from last 30 days for accurate calculation
    const recentResolvedTickets = await Ticket.find({
      status: 'resolved',
      updatedAt: { $gte: last30Days },
      created_at: { $exists: true },
      updatedAt: { $exists: true }
    }).select('created_at updatedAt');

    let totalResponseTimeMinutes = 0;
    let responseTimeCount = 0;
    
    recentResolvedTickets.forEach(ticket => {
      if (ticket.created_at && ticket.updatedAt) {
        const created = new Date(ticket.created_at);
        const resolved = new Date(ticket.updatedAt);
        const responseTimeMs = resolved - created;
        const responseTimeMinutes = Math.floor(responseTimeMs / (1000 * 60));
        
        // Only count reasonable response times (less than 7 days)
        if (responseTimeMinutes > 0 && responseTimeMinutes < 10080) {
          totalResponseTimeMinutes += responseTimeMinutes;
          responseTimeCount++;
        }
      }
    });

    // Calculate average response time
    let avgResponseMinutes = responseTimeCount > 0 ? 
      Math.round(totalResponseTimeMinutes / responseTimeCount) : 30; // Default 30 minutes
    
    let avgResponseTime;
    if (avgResponseMinutes < 60) {
      avgResponseTime = `${avgResponseMinutes}m`;
    } else if (avgResponseMinutes < 1440) {
      const hours = Math.floor(avgResponseMinutes / 60);
      const minutes = avgResponseMinutes % 60;
      avgResponseTime = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else {
      const days = Math.floor(avgResponseMinutes / 1440);
      const hours = Math.floor((avgResponseMinutes % 1440) / 60);
      avgResponseTime = hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }

    // 5. Calculate DYNAMIC satisfaction rate from feedback
    // Get all tickets with feedback from last 30 days
    const feedbackTickets = await Ticket.find({
      feedbackSubmitted: true,
      feedbackRating: { $exists: true, $gte: 1, $lte: 5 },
      feedbackDate: { $gte: last30Days }
    }).select('feedbackRating');

    let satisfactionRate = 'N/A';
    if (feedbackTickets.length > 0) {
      const totalRating = feedbackTickets.reduce((sum, ticket) => 
        sum + (ticket.feedbackRating || 0), 0
      );
      const averageRating = totalRating / feedbackTickets.length;
      
      // Convert 1-5 star rating to percentage (1 star = 20%, 5 stars = 100%)
      const percentage = Math.round((averageRating / 5) * 100);
      satisfactionRate = `${percentage}%`;
    }

    // 6. Calculate resolution rate for today
    const resolutionRateToday = ticketsToday > 0 ? 
      Math.round((resolvedToday / ticketsToday) * 100) : 0;

    // 7. Calculate overall resolution rate (last 30 days)
    const totalTicketsLast30Days = await Ticket.countDocuments({
      created_at: { $gte: last30Days }
    });
    
    const resolvedTicketsLast30Days = await Ticket.countDocuments({
      status: 'resolved',
      updatedAt: { $gte: last30Days }
    });
    
    const overallResolutionRate = totalTicketsLast30Days > 0 ? 
      Math.round((resolvedTicketsLast30Days / totalTicketsLast30Days) * 100) : 0;

    // 8. Calculate today's vs yesterday comparison for trend
    const ticketsYesterday = await Ticket.countDocuments({
      created_at: { 
        $gte: yesterdayStart,
        $lt: todayStart
      }
    });
    
    const resolvedYesterday = await Ticket.countDocuments({
      status: 'resolved',
      updatedAt: { 
        $gte: yesterdayStart,
        $lt: todayStart
      }
    });

    // Determine trend based on comparison
    let ticketsTrend = 'stable';
    if (ticketsToday > ticketsYesterday && ticketsYesterday > 0) {
      ticketsTrend = 'up';
    } else if (ticketsToday < ticketsYesterday && ticketsToday > 0) {
      ticketsTrend = 'down';
    }

    let resolvedTrend = 'stable';
    if (resolvedToday > resolvedYesterday && resolvedYesterday > 0) {
      resolvedTrend = 'up';
    } else if (resolvedToday < resolvedYesterday && resolvedToday > 0) {
      resolvedTrend = 'down';
    }

    res.json({
      // Team stats
      supportTeamMembers: supportTeamMembers,
      activeAgents: onlineAgentsCount,
      
      // Ticket stats
      ticketsToday: ticketsToday,
      resolvedToday: resolvedToday,
      activeTickets: activeTickets,
      ticketsTrend: ticketsTrend,
      resolvedTrend: resolvedTrend,
      
      // Performance metrics
      satisfactionRate: satisfactionRate,
      avgResponseTime: avgResponseTime,
      avgResponseMinutes: avgResponseMinutes,
      
      // Resolution rates
      resolutionRate: resolutionRateToday,
      overallResolutionRate: overallResolutionRate,
      
      // Additional info
      feedbackCount: feedbackTickets.length,
      totalTickets: totalTicketsLast30Days,
      resolvedTickets: resolvedTicketsLast30Days,
      
      // Timestamp
      lastUpdated: new Date()
    });
  } catch (err) {
    console.error('Error fetching live stats:', err);
    res.status(500).json({ 
      error: "Stats failure",
      message: err.message 
    });
  }
});
// --- GET TICKETS API ---
// --- GET TICKETS API ---
app.get('/api/tickets', async (req, res) => {
  try {
    const { userEmail, userId } = req.query;
    let query = {};
    
    if (userEmail) {
      query.userEmail = userEmail;
    } else if (userId) {
      const user = await User.findById(userId);
      if (user) {
        query.userEmail = user.email;
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    }
    
    const tickets = await Ticket.find(query).sort({ created_at: -1 });
    res.json(tickets);
  } catch (err) { 
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: "Failed to fetch tickets" }); 
  }
});

// --- UPDATE TICKET STATUS API ---
app.patch('/api/tickets/:id/status', async (req, res) => {
  try {
    const { status, agentEmail } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id, 
      { 
        status: status, 
        assignedTo: agentEmail,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    
    // Create notification for status update
    const notification = new Notification({
      userEmail: ticket.userEmail,
      type: 'status_updated',
      title: 'Ticket Status Updated',
      message: `Your ticket #${ticket._id.toString().slice(-8).toUpperCase()} has been ${status}`,
      data: {
        ticketId: ticket._id,
        status: status,
        assignedTo: agentEmail
      },
      read: false
    });
    await notification.save();
    
    // Emit socket event
    io.emit('ticket_updated', {
      ticketId: ticket._id,
      status: status,
      userEmail: ticket.userEmail,
      timestamp: new Date()
    });
    
    res.json(ticket);
  } catch (err) { 
    console.error('Error updating ticket:', err);
    res.status(500).json({ error: "Update failed" }); 
  }
});

// --- NOTIFICATIONS API ---
// --- NOTIFICATIONS API ---
app.get('/api/notifications', async (req, res) => {
  try {
    const { userEmail, userId } = req.query;
    
    if (!userEmail && !userId) {
      return res.status(400).json({ error: "User email or ID is required" });
    }
    
    let query = {};
    if (userEmail) {
      query.userEmail = userEmail;
    } else if (userId) {
      // If you're using userId, you need to fetch user to get email first
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      query.userEmail = user.email;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notification as read
// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userEmail: user.email 
      },
      { 
        read: true, 
        readAt: new Date() 
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found or unauthorized" });
    }
    
    res.json(notification);
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: "Failed to update notification" });
  }
});
// --- PROFILE API ENDPOINTS ---

// Get user profile by ID
app.get('/api/auth/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      success: true,
      user: user
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update user profile
app.put('/api/auth/profile/:id', async (req, res) => {
  try {
    const { name, phone, department, position, notifications, newsletter } = req.body;
    const userId = req.params.id;
    
    // Find user and update
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: name,
          phone: phone,
          department: department,
          position: position,
          notificationsEnabled: notifications,
          newsletterSubscribed: newsletter,
          updatedAt: new Date()
        }
      },
      { new: true, select: '-password -__v' }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Change password
app.put('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // In a real application, you should verify current password
    // For now, we'll assume validation is done by authentication middleware
    
    // Update password
    user.password = newPassword; // Note: In production, you should hash this
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Export user data
app.get('/api/user/export-data', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    // Find user
    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Get user's tickets
    const tickets = await Ticket.find({ userEmail: user.email })
      .select('-__v')
      .sort({ created_at: -1 });
    
    // Get user's notifications
    const notifications = await Notification.find({ userEmail: user.email })
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Get user's feedback
    const feedbackTickets = tickets.filter(ticket => 
      ticket.feedbackSubmitted && ticket.feedbackRating
    );
    
    const exportData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || 'Not provided',
        department: user.department || 'Not provided',
        position: user.position || 'Not provided',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      stats: {
        totalTickets: tickets.length,
        resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        openTickets: tickets.filter(t => !['resolved', 'closed'].includes(t.status)).length,
        feedbackProvided: feedbackTickets.length,
        averageRating: feedbackTickets.length > 0 ? 
          (feedbackTickets.reduce((sum, ticket) => sum + ticket.feedbackRating, 0) / feedbackTickets.length).toFixed(2) : 0,
        favoriteCategory: tickets.length > 0 ? 
          Object.entries(
            tickets.reduce((acc, ticket) => {
              acc[ticket.category] = (acc[ticket.category] || 0) + 1;
              return acc;
            }, {})
          ).sort((a, b) => b[1] - a[1])[0]?.[0] : 'No tickets'
      },
      tickets: tickets,
      notifications: notifications,
      feedback: feedbackTickets.map(ticket => ({
        ticketId: ticket._id,
        ticketTitle: ticket.title,
        rating: ticket.feedbackRating,
        comment: ticket.feedbackComment,
        date: ticket.feedbackDate
      })),
      exportInfo: {
        exportedAt: new Date().toISOString(),
        dataVersion: '1.0',
        totalRecords: tickets.length + notifications.length + 1
      }
    };
    
    res.json(exportData);
  } catch (err) {
    console.error('Error exporting data:', err);
    res.status(500).json({ error: "Failed to export user data" });
  }
});
// --- LIVE STATS API ---
app.get('/api/stats/live', async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    // Get all tickets
    const allTickets = await Ticket.find({});
    
    // Calculate active agents (agents with tickets assigned in last 4 hours)
    const fourHoursAgo = new Date(now.getTime() - (4 * 60 * 60 * 1000));
    const activeAgents = [...new Set(allTickets
      .filter(t => t.assignedTo && t.updatedAt > fourHoursAgo)
      .map(t => t.assignedTo))].length;

    // Calculate tickets created today
    const ticketsToday = allTickets.filter(ticket => 
      new Date(ticket.created_at) >= todayStart
    ).length;

    // Calculate resolved tickets today
    const resolvedToday = allTickets.filter(ticket => 
      ticket.status === 'resolved' && 
      new Date(ticket.updatedAt) >= todayStart
    ).length;

    // Calculate active tickets (not resolved or closed)
    const activeTickets = allTickets.filter(ticket => 
      !['resolved', 'closed'].includes(ticket.status)
    ).length;

    // Calculate average response time
    let totalResponseTime = 0;
    let responseCount = 0;
    
    allTickets.forEach(ticket => {
      if (ticket.status === 'resolved' && ticket.updatedAt && ticket.created_at) {
        const responseTime = (new Date(ticket.updatedAt) - new Date(ticket.created_at)) / (1000 * 60); // minutes
        totalResponseTime += responseTime;
        responseCount++;
      }
    });
    
    let avgResponseMinutes = responseCount > 0 ? totalResponseTime / responseCount : 5;
    const avgResponseTime = `${Math.floor(avgResponseMinutes)}m ${Math.round((avgResponseMinutes % 1) * 60)}s`;

    // Calculate satisfaction rate from feedback
    const feedbackTickets = allTickets.filter(ticket => 
      ticket.feedbackSubmitted && ticket.feedbackRating
    );
    
    let satisfactionRate = '95%';
    if (feedbackTickets.length > 0) {
      const avgRating = feedbackTickets.reduce((sum, ticket) => 
        sum + ticket.feedbackRating, 0
      ) / feedbackTickets.length;
      
      const percentage = Math.round((avgRating / 5) * 100);
      satisfactionRate = `${percentage}%`;
    }

    res.json({
      activeAgents: activeAgents || 0,
      avgResponseTime: avgResponseTime || '5m 0s',
      satisfactionRate: satisfactionRate || '95%',
      ticketsToday: ticketsToday || 0,
      resolvedToday: resolvedToday || 0,
      activeTickets: activeTickets || 0,
      totalTickets: allTickets.length,
      resolutionRate: allTickets.length > 0 ? 
        Math.round((allTickets.filter(t => t.status === 'resolved').length / allTickets.length) * 100) : 0
    });
  } catch (err) {
    console.error('Error fetching live stats:', err);
    res.status(500).json({ 
      error: "Failed to fetch live stats",
      details: err.message 
    });
  }
});

// --- FEEDBACK API ---
// --- FEEDBACK API ---
app.post('/api/feedback', async (req, res) => {
  try {
    const { ticketId, rating, comment, userId } = req.body;
    
    if (!ticketId || !rating || !userId) {
      return res.status(400).json({ 
        error: "Ticket ID, rating, and user ID are required" 
      });
    }
    
    // Get user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Find the ticket first
    const ticket = await Ticket.findById(ticketId);
    
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    
    if (ticket.userEmail !== user.email) {
      return res.status(403).json({ error: "Unauthorized to provide feedback for this ticket" });
    }
    
    if (ticket.feedbackSubmitted) {
      return res.status(400).json({ error: "Feedback already submitted for this ticket" });
    }
    
    if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
      return res.status(400).json({ error: "Can only provide feedback for resolved tickets" });
    }
    
    // Update the ticket with feedback
    ticket.feedbackSubmitted = true;
    ticket.feedbackRating = rating;
    ticket.feedbackComment = comment;
    ticket.feedbackDate = new Date();
    ticket.updatedAt = new Date();
    await ticket.save();
    
    // Create a notification for the user
    const userNotification = new Notification({
      userEmail: user.email,
      type: 'feedback_submitted',
      title: 'Feedback Submitted',
      message: `Thank you for your ${rating}-star feedback`,
      data: {
        ticketId: ticketId,
        rating: rating,
        comment: comment,
        ticketTitle: ticket.title
      },
      read: false
    });
    await userNotification.save();
    
    // Emit socket event for system-wide updates
    io.emit('feedback_added', {
      ticketId,
      rating,
      userEmail: user.email,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message: "Feedback submitted successfully",
      ticket: {
        _id: ticket._id,
        feedbackSubmitted: ticket.feedbackSubmitted,
        feedbackRating: ticket.feedbackRating,
        feedbackDate: ticket.feedbackDate
      }
    });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ 
      error: "Failed to submit feedback",
      message: err.message 
    });
  }
});

// --- HEALTH CHECK API ---
// In your server.js, update the health check function:

// --- HEALTH CHECK API ---
app.get('/api/health', async (req, res) => {
  try {
    // Try to connect to AI service
    let aiHealth;
    try {
      const response = await axios.get('http://localhost:8000/health', { 
        timeout: 5000 
      });
      aiHealth = {
        status: 'healthy',
        message: response.data?.status || 'AI service responding',
        details: response.data
      };
    } catch (aiError) {
      aiHealth = {
        status: 'unhealthy',
        error: aiError.message,
        details: aiError.response?.data || 'No response from AI service'
      };
    }
    
    res.json({
      status: 'healthy',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      ai_service: aiHealth,
      backend: 'running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// --- TEST AI CONNECTION API ---
app.get('/api/test-ai', async (req, res) => {
  try {
    const testData = {
      title: "Test Network Issue",
      description: "Cannot connect to office WiFi network. Need urgent help."
    };
    
    console.log("Testing AI connection with data:", testData);
    
    const response = await axios.post('http://localhost:8000/classify', testData, { 
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json({
      success: true,
      message: "AI service is responding correctly",
      testData: testData,
      aiResponse: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("AI test failed:", error.message);
    console.error("Error details:", error.response?.data || error);
    
    res.status(500).json({
      success: false,
      message: "AI service connection failed",
      error: error.message,
      details: error.response?.data || 'No response from AI service',
      suggestion: "Make sure the AI service is running on http://localhost:8000",
      timestamp: new Date().toISOString()
    });
  }
});
// Add these routes BEFORE app.use('/api/auth', authRoutes);

// Get user by ID
app.get('/api/auth/user/:id', async (req, res) => {
  try {
    console.log('Dashboard: Fetching user for ID:', req.params.id);
    
    // Only return essential fields for dashboard
    const user = await User.findById(req.params.id).select('name email role'); 
    if (!user) return res.status(404).json({ error: "User not found" });
    
    console.log('Dashboard: User found:', { id: user._id, name: user.name, email: user.email });
    
    res.json({ 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('Error fetching user for dashboard:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user profile (same as above but with different path)
app.get('/api/auth/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Change password
app.put('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    if (!userId || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // In production, you should verify currentPassword first
    // For now, we'll just update the password
    user.password = newPassword; // Note: You should hash this password
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: "Failed to change password" });
  }
});
// --- SOCKET.IO FOR REAL-TIME UPDATES ---
// --- DYNAMIC AGENT TRACKING ---
// server.js
// --- DYNAMIC AGENT TRACKING ---
const activeUsers = new Map(); 

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_user_room', (data) => {
    // Correctly handle both string and object data from frontend
    const email = typeof data === 'string' ? data : data.email;
    const role = data.role || 'user'; 

    socket.join(`user-${email}`);
    activeUsers.set(socket.id, { email, role });

    console.log(`User ${email} (${role}) joined. Total connections: ${activeUsers.size}`);

    // Calculate count of users with 'agent' role
    const onlineAgents = Array.from(activeUsers.values()).filter(u => u.role === 'agent').length;
    
    // Broadcast to ALL connected clients
    io.emit('update_online_counts', { agentsOnline: onlineAgents });
  });

  socket.on('disconnect', () => {
    if (activeUsers.has(socket.id)) {
      const user = activeUsers.get(socket.id);
      activeUsers.delete(socket.id);
      console.log(`User ${user.email} disconnected.`);
    }

    // Broadcast updated counts after disconnect
    const onlineAgents = Array.from(activeUsers.values()).filter(u => u.role === 'agent').length;
    io.emit('update_online_counts', { agentsOnline: onlineAgents });
    console.log('Client disconnected:', socket.id);
  });
});
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Test AI connection: http://localhost:${PORT}/api/test-ai`);
});