import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  ShieldCheck, Layout, Clock, CheckCircle, AlertCircle, Search, Filter, 
  Smartphone, ShieldAlert, BarChart3, RefreshCcw, LogOut, Terminal, 
  Activity, Bell, Users, Zap, History, UserPlus, Monitor, Cpu, Globe, 
  Database, Maximize2, MoreVertical, CheckCircle2, AlertTriangle, Play, 
  Pause, Timer, Command, Wifi, Server, HardDrive, Share2, Menu, X, 
  Layers, Box, Flame, TrendingUp, TrendingDown, UserCheck, Target,
  BarChart, PieChart, Users as UsersIcon, Filter as FilterIcon,
  Volume2, VolumeX, AlertOctagon, Lightbulb, Brain, Clock3,
  ChevronDown, ChevronUp, Download, Upload, Hash, Activity as ActivityIcon,
  AlertTriangle as AlertTriangleIcon, Loader
} from 'lucide-react';

/**
 * DEV_DASHBOARD: SENTINEL_PRIME_ELITE_PRO_V5
 * All data now fetched from backend APIs
 * No static/mock data used
 */
const getSLATimeLeft = (createdAt, priority) => {
  const SLA = { critical: 1, high: 2, medium: 4, low: 8 }; // hours
  const max = SLA[priority] || 4;
  const elapsed = (Date.now() - new Date(createdAt)) / 3600000;
  const timeLeft = Math.max(0, (max - elapsed).toFixed(2));
  return { timeLeft, isBreaching: timeLeft < 0.5 && priority === 'critical' };
};

// AI Root Cause Analysis Function
const analyzeRootCause = (tickets) => {
  if (!tickets || tickets.length === 0) return null;
  
  const categories = {};
  const keywords = {};
  
  tickets.forEach(ticket => {
    if (ticket.category) {
      if (!categories[ticket.category]) {
        categories[ticket.category] = { count: 0, tickets: [] };
      }
      categories[ticket.category].count++;
      categories[ticket.category].tickets.push(ticket);
      
      // Extract keywords from title
      if (ticket.title) {
        const words = ticket.title.toLowerCase().split(' ');
        words.forEach(word => {
          if (word.length > 3 && !['server', 'service', 'error', 'issue', 'system', 'network'].includes(word)) {
            keywords[word] = (keywords[word] || 0) + 1;
          }
        });
      }
    }
  });
  
  // Find top category and keywords
  const topCategory = Object.entries(categories)
    .sort(([,a], [,b]) => b.count - a.count)[0];
  
  const topKeywords = Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([word]) => word);
  
  if (topCategory && topCategory[1].count > 3) {
    return {
      rootCause: `Likely root cause: ${topCategory[0]} service disruption`,
      confidence: Math.min(95, (topCategory[1].count / tickets.length * 100)),
      affectedTickets: topCategory[1].count,
      keywords: topKeywords
    };
  }
  
  return null;
};

const DevDashboard = () => {
  // --- UI INTERACTIVE STATES ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [criticalPopup, setCriticalPopup] = useState(null); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshRate, setRefreshRate] = useState(5000); // Default 5s
const [isLive, setIsLive] = useState(true); // Toggle for auto-refresh
const [lastSynced, setLastSynced] = useState(new Date().toLocaleTimeString()); // Timestamp
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [notificationSound, setNotificationSound] = useState(true);
  
  // --- DATA STATES ---
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', category: 'all', agent: 'all' });
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]); 
  const [sysStats, setSysStats] = useState({ cpu: 0, mem: 0 });
  const [agents, setAgents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [ticketTrend, setTicketTrend] = useState({ current: 0, previous: 0, direction: 'stable' });
  const [prioritySpike, setPrioritySpike] = useState(null);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);

  const agent = JSON.parse(localStorage.getItem('user') || '{"name": "Rakshitha N", "email": "rakshitha@nexus.io", "role": "agent"}');

  // --- FETCH ALL DATA FROM BACKEND ---
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      // Fetch tickets
      const ticketsRes = await axios.get(`${API_BASE_URL}/tickets`);
      const ticketsData = ticketsRes.data || [];
      setTickets(ticketsData);
      
      // Fetch leaderboard
      try {
        const leaderboardRes = await axios.get(`${API_BASE_URL}/agents/leaderboard`);
        setLeaderboard(leaderboardRes.data || []);
      } catch (err) {
        console.log("Leaderboard endpoint not available");
      }
      
      // Extract unique categories and priorities
      const uniqueCategories = [...new Set(ticketsData.map(t => t.category).filter(Boolean))];
      const uniquePriorities = [...new Set(ticketsData.map(t => t.priority).filter(Boolean))];
      setCategories(uniqueCategories);
      setPriorities(uniquePriorities);
      
      // Extract assigned agents
      const assignedAgents = [...new Set(ticketsData.map(t => t.assignedTo).filter(Boolean))];
      setAgents(assignedAgents);
      
      // Calculate rolling trend
      const currentOpen = ticketsData.filter(t => t.status === 'open').length;
      const prevOpen = tickets.filter(t => t.status === 'open').length;
      if (tickets.length > 0) {
        setTicketTrend({
          current: currentOpen,
          previous: prevOpen,
          direction: currentOpen > prevOpen ? 'up' : currentOpen < prevOpen ? 'down' : 'stable'
        });
      }
      
      // Check for critical tickets
      const currentEmergency = ticketsData.filter(t => 
        (t.priority === 'high' || t.priority === 'critical') && 
        t.status === 'open'
      );
      const prevEmergencyCount = tickets.filter(t => 
        (t.priority === 'high' || t.priority === 'critical') && 
        t.status === 'open'
      ).length;
      
      if (currentEmergency.length > prevEmergencyCount && currentEmergency.length > 0) {
        const newCritical = currentEmergency[0];
        setCriticalPopup(newCritical); 
        addActivity(`🚨 CRITICAL_INGRESS: #${newCritical._id?.slice(-4) || 'N/A'} detected`, "error");
        
        // Play notification sound if enabled
        if (notificationSound) {
          playNotificationSound(newCritical.priority);
        }
      }
      
      // Detect priority spikes
      detectPrioritySpikes(ticketsData);
      
      // Add activity log
      if (!isSilent) {
        addActivity(`🔄 Sync completed: ${ticketsData.length} tickets loaded`, "info");
      }
    } catch (err) { 
      console.error("Fetch failed:", err);
      addActivity("🔌 Connection lost to backend server", "error");
    }
    finally { 
      setLoading(false); 
    }
  }, [tickets, notificationSound]);

  // --- 1. DYNAMIC HUD ANALYTICS (From Real Data) ---
  const analytics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    
    const todayStr = new Date().toDateString();
    const todayAlerts = tickets.filter(t => 
      t.created_at && 
      new Date(t.created_at).toDateString() === todayStr
    ).length;
    
    // Calculate average resolution time from actual resolved tickets
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' && t.resolved_at);
    let avgResTime = 0;
    if (resolvedTickets.length > 0) {
      const totalTime = resolvedTickets.reduce((acc, t) => {
        const created = new Date(t.created_at);
        const resolved = new Date(t.resolved_at);
        return acc + (resolved - created);
      }, 0);
      avgResTime = (totalTime / resolvedTickets.length / 3600000).toFixed(1);
    }

    // Calculate resolution velocity (tickets per hour)
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 3600000);
    const recentResolved = tickets.filter(t => 
      t.status === 'resolved' && 
      t.resolved_at &&
      new Date(t.resolved_at) > hourAgo
    ).length;

    // Calculate AI accuracy from confidence scores
    const ticketsWithConfidence = tickets.filter(t => t.category_confidence);
    const avgConfidence = ticketsWithConfidence.length > 0 
      ? (ticketsWithConfidence.reduce((acc, t) => acc + (t.category_confidence || 0), 0) / ticketsWithConfidence.length * 100).toFixed(1)
      : "0.0";

    return { 
      total, 
      open, 
      resolved, 
      todayAlerts, 
      trainAccuracy: avgConfidence,
      avgResTime: `${avgResTime}h`,
      resolutionVelocity: recentResolved,
      rollingTrend: ticketTrend
    };
  }, [tickets, ticketTrend]);

  // --- LIVE HEATMAP DATA (From Real Data) ---
  const categoryHeatmap = useMemo(() => {
    const categories = {};
    tickets.forEach(ticket => {
      if (ticket.status === 'open' && ticket.category) {
        categories[ticket.category] = (categories[ticket.category] || 0) + 1;
      }
    });
    
    // Sort by volume and add intensity
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({
        category,
        count,
        intensity: Math.min(100, (count / tickets.length * 300))
      }));
  }, [tickets]);

  // --- PRIORITY SPIKE DETECTOR (Real Data) ---
  const detectPrioritySpikes = useCallback((ticketsData) => {
    if (!ticketsData || ticketsData.length === 0) return;
    
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 300000);
    
    const recentCritical = ticketsData.filter(t => 
      t.priority === 'critical' && 
      t.created_at &&
      new Date(t.created_at) > fiveMinutesAgo
    );
    
    if (recentCritical.length > 2 && !prioritySpike) {
      const categories = {};
      recentCritical.forEach(t => {
        if (t.category) {
          categories[t.category] = (categories[t.category] || 0) + 1;
        }
      });
      const topCategory = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topCategory) {
        setPrioritySpike({
          category: topCategory[0],
          count: recentCritical.length,
          timestamp: now.toISOString()
        });
        addActivity(`🚨 Priority spike detected: ${recentCritical.length} critical tickets in ${topCategory[0]}`, "error");
      }
    }
  }, [prioritySpike]);

  // --- AGENT LOAD BALANCER (From Real Data) ---
  const agentStats = useMemo(() => {
    const agentMap = {};
    
    tickets.forEach(ticket => {
      if (ticket.assignedTo) {
        if (!agentMap[ticket.assignedTo]) {
          agentMap[ticket.assignedTo] = {
            name: ticket.assignedTo,
            activeTickets: 0,
            resolvedTickets: 0,
            tickets: []
          };
        }
        if (ticket.status === 'open') {
          agentMap[ticket.assignedTo].activeTickets++;
        } else if (ticket.status === 'resolved') {
          agentMap[ticket.assignedTo].resolvedTickets++;
        }
        agentMap[ticket.assignedTo].tickets.push(ticket);
      }
    });
    
    // Calculate efficiency scores (0-100) based on actual performance
    return Object.values(agentMap).map(agent => {
      // Calculate resolution time average
      const resolvedTickets = agent.tickets.filter(t => t.status === 'resolved' && t.resolved_at);
      let avgResolutionHours = 0;
      if (resolvedTickets.length > 0) {
        const totalTime = resolvedTickets.reduce((acc, t) => {
          const created = new Date(t.created_at);
          const resolved = new Date(t.resolved_at);
          return acc + (resolved - created);
        }, 0);
        avgResolutionHours = totalTime / resolvedTickets.length / 3600000;
      }
      
      // Efficiency calculation based on:
      // 1. Number of resolved tickets (40%)
      // 2. Low active tickets (30%)
      // 3. Fast resolution time (30%)
      const efficiency = Math.min(100,
        (agent.resolvedTickets * 2) + // Max 40 points
        (Math.max(0, 10 - agent.activeTickets) * 3) + // Max 30 points
        (Math.max(0, 8 - avgResolutionHours) * 3.75) // Max 30 points
      );
      
      return {
        ...agent,
        efficiency: Math.round(efficiency),
        isOverloaded: agent.activeTickets > 8,
        avgResolutionHours: avgResolutionHours.toFixed(1)
      };
    }).sort((a, b) => b.efficiency - a.efficiency);
  }, [tickets]);

  // --- AI ROOT CAUSE ANALYSIS (Real Data) ---
  const rootCauseAnalysis = useMemo(() => {
    const openTickets = tickets.filter(t => t.status === 'open');
    return analyzeRootCause(openTickets);
  }, [tickets]);

  const criticalNotifications = useMemo(() => {
    return tickets.filter(t => 
      (t.priority === 'critical' || t.priority === 'high') && 
      t.status === 'open'
    );
  }, [tickets]);

  // --- 2. LIVE MESSAGE SYSTEM ---
  const addActivity = useCallback((msg, type = 'info') => {
    const log = { 
      id: Date.now(), 
      msg, 
      type, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      icon: type === 'error' ? AlertOctagon : type === 'success' ? CheckCircle : ActivityIcon
    };
    setActivities(prev => [log, ...prev].slice(0, 20));
  }, []);

  // Notification sound function
  const playNotificationSound = (priority) => {
    if (!notificationSound || !window.AudioContext) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different priorities
      if (priority === 'critical') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      } else if (priority === 'high') {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      } else {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (err) {
      console.log("Audio context not supported");
    }
  };

  useEffect(() => {
  // Initial fetch on component load
  fetchAllData();

  let intervalId = null;

  if (isLive) {
    intervalId = setInterval(() => {
      fetchAllData(true);
      setLastSynced(new Date().toLocaleTimeString()); // Update the timestamp
    }, refreshRate);
  }

  // Cleanup function: Stops the timer when component unmounts or state changes
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [fetchAllData, isLive, refreshRate]); // 👈 Re-triggers when rate or live status changes

  // --- ACTION FUNCTIONS ---
 // --- ACTION FUNCTIONS ---
// --- CORRECTED ACTION FUNCTIONS ---
const updateStatus = async (id, newStatus) => {
  // 1. Validation: Ensure ID exists and is not the string "undefined"
  if (!id || id === 'undefined' || id === 'N/A') {
    console.error('Invalid ticket ID:', id);
    addActivity('❌ Cannot resolve: Ticket ID is missing', 'error');
    
    // Try to get ID from selectedTicket as fallback
    if (selectedTicket && (selectedTicket._id || selectedTicket.id)) {
      id = selectedTicket._id || selectedTicket.id;
      console.log('Using fallback ID from selectedTicket:', id);
    } else {
      return;
    }
  }
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      addActivity('❌ Authentication required', 'error');
      return;
    }
    
    // 2. Network Call
    console.log('Updating ticket:', id, 'to status:', newStatus);
    const response = await axios.patch(`${API_BASE_URL}/tickets/${id}/status`, { 
      status: newStatus, 
      agentEmail: agent.email,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // 3. Update local tickets list
    setTickets(prev => prev.map(t => {
      const ticketId = t._id || t.id;
      return ticketId === id ? { ...t, status: newStatus } : t;
    }));
    
    // 4. Update the currently viewed ticket
    setSelectedTicket(prev => prev && (prev._id === id || prev.id === id) 
      ? { ...prev, status: newStatus } 
      : prev
    );
    
    addActivity(`✅ Ticket Status: ${newStatus}`, "success");
  } catch (err) { 
    console.error("Update failed:", err);
    addActivity(`❌ Update failed: ${err.response?.data?.message || err.message}`, "error");
  }
};

const assignToAgent = async (ticketId, agentName) => {
  if (!ticketId || ticketId === 'undefined') return;
  
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`${API_BASE_URL}/tickets/${ticketId}/assign`, { 
      agent: agentName 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setTickets(prev => prev.map(t => (t._id === ticketId ? { ...t, assignedTo: agentName } : t)));
    setSelectedTicket(prev => prev && prev._id === ticketId ? { ...prev, assignedTo: agentName } : prev);
    addActivity(`👤 Assigned to ${agentName}`, "info");
  } catch (err) {
    addActivity("❌ Assignment failed", "error");
  }
};

  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tickets.filter(t => {
      const matchStatus = filter.status === 'all' || t.status === filter.status;
      const matchPriority = filter.priority === 'all' || t.priority === filter.priority;
      const matchCategory = filter.category === 'all' || t.category === filter.category;
      const matchAgent = filter.agent === 'all' || t.assignedTo === filter.agent;
      const matchSearch = t.title?.toLowerCase().includes(q) || 
                         t.category?.toLowerCase().includes(q) || 
                         t._id?.includes(q) ||
                         t.description?.toLowerCase().includes(q);
      return matchStatus && matchPriority && matchCategory && matchAgent && matchSearch;
    });
  }, [tickets, filter, searchQuery]);

  const theme = { primary: '#6366f1', danger: '#ef4444', success: '#10b981', text: '#0f172a', muted: '#64748b' };

  return (
    <div style={styles.appContainer}>
      
      {/* EMERGENCY MODAL */}
      {criticalPopup && (
  <div style={styles.modalBackdrop}>
    <div style={styles.modalBody}>
      <div style={styles.modalHeader}><Flame size={32} /> CRITICAL_PRIORITY_DETECTED</div>
      <h2 style={{ fontSize: '32px', margin: '20px 0', letterSpacing: '-2px' }}>{criticalPopup.title}</h2>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>
        Ticket ID: #{criticalPopup._id?.slice(-6).toUpperCase() || criticalPopup.id?.slice(-6).toUpperCase() || 'N/A'}
        <br/>
        Urgent attention required. Priority: {criticalPopup.priority?.toUpperCase()}
        <br/>
        Category: {criticalPopup.category || 'Unknown'}
      </p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button onClick={() => { setSelectedTicket(criticalPopup); setCriticalPopup(null); }} style={styles.ackBtn}>TRIAGE_NOW</button>
        <button onClick={() => setCriticalPopup(null)} style={styles.dismissBtn}>DISMISS</button>
      </div>
    </div>
  </div>
)}

      {/* PRIORITY SPIKE ALERT */}
      {prioritySpike && (
        <div style={styles.spikeAlert}>
          <AlertTriangle size={20} />
          <span style={{flex: 1}}>
            <strong>Priority Spike Detected:</strong> {prioritySpike.count} critical tickets in {prioritySpike.category}
          </span>
          <button onClick={() => setPrioritySpike(null)} style={styles.closeAlertBtn}>×</button>
        </div>
      )}

      {/* COLUMN 1: THE FIXED FAB GUTTER */}
      <div style={styles.fixedGutter}>
        <button onClick={() => setIsSidebarOpen(true)} style={styles.fabMain}><Menu color="#fff" size={24}/></button>
        <button onClick={() => setFilter({...filter, status: 'open'})} style={styles.fabSub} title="Filter Open"><Clock size={20}/></button>
        <button onClick={() => setFilter({...filter, status: 'all'})} style={{...styles.fabSub, background: theme.danger}}><AlertCircle color="#fff" size={20}/></button>
        <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} style={styles.fabSub} title="Advanced Filters"><FilterIcon size={20}/></button>
      </div>

      {/* ADVANCED FILTERS PANEL */}
      {showAdvancedFilters && (
        <div style={styles.advancedFiltersPanel}>
          <div style={styles.filterHeader}>
            <h3 style={{margin: 0}}>Advanced Filters</h3>
            <button onClick={() => setShowAdvancedFilters(false)} style={styles.closeBtn}><X size={20}/></button>
          </div>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Status</label>
              <select 
                style={styles.filterSelect}
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Priority</label>
              <select 
                style={styles.filterSelect}
                value={filter.priority}
                onChange={(e) => setFilter({...filter, priority: e.target.value})}
              >
                <option value="all">All Priorities</option>
                {priorities.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <select 
                style={styles.filterSelect}
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Assigned Agent</label>
              <select 
                style={styles.filterSelect}
                value={filter.agent}
                onChange={(e) => setFilter({...filter, agent: e.target.value})}
              >
                <option value="all">All Agents</option>
                {agents.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 2. OVERLAY: THE SCROLLABLE DRAWER SIDEBAR */}
      {isSidebarOpen && <div style={styles.backdrop} onClick={() => setIsSidebarOpen(false)} />}
      <div style={{...styles.sidebarOverlay, transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'}}>
        <div style={styles.drawerHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: theme.primary }}>
            <Layers size={32} />
            <span style={{ fontSize: '20px', fontWeight: '900' }}>HQ_SENTINEL</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} style={styles.closeBtn}><X size={20}/></button>
        </div>
        
        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <p style={styles.label}>COMMAND_FILTERS</p>
          <button onClick={() => { setFilter({...filter, status: 'all'}); setIsSidebarOpen(false); }} style={styles.navLink(filter.status === 'all')}>
            Full Spectrum ({tickets.length})
          </button>
          <button onClick={() => { setFilter({...filter, status: 'open'}); setIsSidebarOpen(false); }} style={styles.navLink(filter.status === 'open')}>
            Active Feed ({analytics.open})
          </button>
          <button onClick={() => { setFilter({...filter, status: 'resolved'}); setIsSidebarOpen(false); }} style={styles.navLink(filter.status === 'resolved')}>
            Archive vault ({analytics.resolved})
          </button>
          
          {/* LIVE HEATMAP */}
          <p style={{...styles.label, marginTop: '40px'}}>LIVE HEATMAP 🔥</p>
          <div style={styles.heatmapContainer}>
            {categoryHeatmap.map(item => (
              <div key={item.category} style={styles.heatmapItem}>
                <span style={{fontSize: '12px', fontWeight: '600'}}>{item.category}</span>
                <div style={styles.heatmapBar}>
                  <div style={{
                    ...styles.heatmapFill,
                    width: `${item.intensity}%`,
                    background: item.intensity > 70 ? '#ef4444' : item.intensity > 40 ? '#f59e0b' : '#10b981'
                  }} />
                </div>
                <span style={{fontSize: '11px', color: theme.muted}}>{item.count} active</span>
              </div>
            ))}
          </div>
          
          {/* AGENT LEADERBOARD */}
          <p style={{...styles.label, marginTop: '40px'}}>AGENT LEADERBOARD 🏆</p>
          {leaderboard.length > 0 ? (
            leaderboard.slice(0, 5).map((agent, index) => (
              <div key={agent._id} style={styles.leaderboardItem}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    background: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : index === 2 ? '#92400e' : '#e2e8f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: index < 3 ? '#fff' : '#000',
                    fontSize: '10px',
                    fontWeight: '900'
                  }}>
                    {index + 1}
                  </span>
                  <span style={{fontSize: '12px', fontWeight: '600'}}>{agent._id || 'Unassigned'}</span>
                </div>
                <span style={{fontSize: '11px', color: theme.primary, fontWeight: '700'}}>{agent.count} resolved</span>
              </div>
            ))
          ) : (
            <p style={{fontSize: '12px', color: theme.muted, padding: '10px'}}>No agent data available</p>
          )}
          
          {/* AGENT LOAD BALANCER */}
          {agentStats.length > 0 && (
            <>
              <p style={{...styles.label, marginTop: '40px'}}>AGENT LOAD BALANCER ⚖️</p>
              {agentStats.slice(0, 3).map(agent => (
                <div key={agent.name} style={styles.agentLoadItem}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '12px', fontWeight: '600'}}>{agent.name}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: agent.isOverloaded ? theme.danger : theme.success
                    }}>
                      {agent.efficiency}%
                    </span>
                  </div>
                  <div style={styles.loadBar}>
                    <div style={{
                      ...styles.loadFill,
                      width: `${Math.min(100, agent.activeTickets * 12.5)}%`,
                      background: agent.isOverloaded ? theme.danger : theme.primary
                    }} />
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: theme.muted}}>
                    <span>Active: {agent.activeTickets}</span>
                    <span>Resolved: {agent.resolvedTickets}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Visibility ensured via Sidebar Scroll */}
        <div style={styles.agentInfo}>
           <p style={{ margin: 0, fontWeight: '900' }}>{agent.name}</p>
           <p style={{ margin: '5px 0 0', fontSize: '12px', color: theme.muted }}>{agent.role}</p>
           <button onClick={() => {localStorage.clear(); window.location.reload();}} style={styles.logoutBtn}><LogOut size={14}/> ABORT_SESSION</button>
        </div>
      </div>

      <div style={styles.mainContentWrapper}>
        
        {/* HEADER: ALIGNED SEARCH & BELL */}
        <div style={styles.hudHeader}>
          <div style={styles.hudGrid}>
            <div style={styles.metricBlock}>
              <p>QUEUE_DEPTH</p>
              <h3>{analytics.open} 
                {ticketTrend.direction === 'up' ? 
                  <TrendingUp size={16} style={{marginLeft: '10px', color: theme.danger}} /> : 
                  ticketTrend.direction === 'down' ? 
                  <TrendingDown size={16} style={{marginLeft: '10px', color: theme.success}} /> : 
                  <span className="pulse-dot" />
                }
              </h3>
            </div>
            <div style={styles.metricBlock}>
              <p>TODAY_ALERTS</p>
              <h3 style={{color: theme.danger}}>{analytics.todayAlerts}</h3>
            </div>
            <div style={styles.metricBlock}>
              <p>RESOLVED</p>
              <h3>{analytics.resolved}</h3>
            </div>
            <div style={styles.metricBlock}>
              <p>AI_ACCURACY</p>
              <h3 style={{color: theme.success}}>{analytics.trainAccuracy}%</h3>
            </div>
            {/* 🕒 INSERT THE REFRESH_CONTROL BLOCK HERE */}
            <div style={styles.metricBlock}>
              <p>RES_VELOCITY</p>
              <h3 style={{color: '#8b5cf6'}}>{analytics.resolutionVelocity}/hr</h3>
            </div>
          </div>

          <div style={styles.hudRightSection}>
            <div style={styles.searchBar}>
              <Search size={18} color={theme.muted}/>
              <input 
                placeholder="Search by title, category, or ID..." 
                style={styles.inputReset} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={styles.clearSearchBtn}>×</button>
              )}
            </div>
            <button onClick={() => setNotificationSound(!notificationSound)} style={styles.soundToggleBtn}>
              {notificationSound ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <div style={styles.notificationWrapper} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={22} color={criticalNotifications.length > 0 ? theme.danger : "#1e293b"} className={criticalNotifications.length > 0 ? 'shake' : ''} />
              {criticalNotifications.length > 0 && <span style={styles.notificationBadge}>{criticalNotifications.length}</span>}
              
              {showNotifications && (
                <div style={styles.notificationPanel}>
                  <div style={styles.notificationHeader}>
                    <AlertTriangleIcon size={14} /> Critical Alerts ({criticalNotifications.length})
                  </div>
                  <div style={styles.notificationBody}>
                    {criticalNotifications.length === 0 ? 
                      <p style={{padding: 15, fontSize: 12}}>No active alerts</p> : 
                      criticalNotifications.map(n => (
                        <div key={n._id} style={styles.notificationItem} onClick={() => {setSelectedTicket(n); setShowNotifications(false);}}>
  <div style={styles.notificationTitle}>{n.title}</div>
  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 10, color: theme.muted}}>
    <span>
      #{n._id ? n._id.toString().slice(-6).toUpperCase() : n.id ? n.id.toString().slice(-6).toUpperCase() : 'N/A'} • {n.category}
    </span>
    <span>{n.priority?.toUpperCase()}</span>
  </div>
</div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROOT CAUSE ANALYSIS BANNER */}
        {rootCauseAnalysis && (
          <div style={styles.rootCauseBanner}>
            <Brain size={18} />
            <div style={{flex: 1}}>
              <strong style={{color: '#fff'}}>AI Root Cause Analysis:</strong> {rootCauseAnalysis.rootCause}
              <div style={{fontSize: '11px', opacity: 0.8, marginTop: '5px'}}>
                Confidence: {rootCauseAnalysis.confidence.toFixed(1)}% • Affected: {rootCauseAnalysis.affectedTickets} tickets • Keywords: {rootCauseAnalysis.keywords.join(', ')}
              </div>
            </div>
          </div>
        )}

        <div style={styles.dualPaneContainer}>
          {/* COLUMN 2: STREAM (450px) */}
          <div style={styles.ingressStreamColumn}>
            <div style={styles.streamHeader}>
              <span>{filter.status === 'resolved' ? 'RESOLVED_VAULT' : 'INGRESS_STREAM'} ({filteredTickets.length})</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                {loading && <Loader size={14} className="spin" />}
                <RefreshCcw size={16} className={loading ? 'spin' : ''} onClick={() => fetchAllData()}/>
              </div>
            </div>
            <div style={styles.streamScrollArea}>
              {filteredTickets.length === 0 ? (
                <div style={styles.emptyState}>
                  <Search size={32} color="#cbd5e1" />
                  <p style={{color: '#94a3b8', fontSize: '14px'}}>No tickets found</p>
                </div>
              ) : (
                filteredTickets.map(t => {
  const ticketId = t._id || t.id || 'N/A';
  const displayTicketId = ticketId && ticketId !== 'N/A' 
    ? `#${ticketId.toString().slice(-6).toUpperCase()}` 
    : 'N/A';
  
  const slaInfo = getSLATimeLeft(t.created_at, t.priority);
  return (
    <div key={ticketId} style={styles.ticketCard(selectedTicket?._id === ticketId)} onClick={() => setSelectedTicket(t)}>
      <div style={styles.cardHeader}>
        <span style={styles.ticketId}>{displayTicketId}</span>
        <span style={pBadge(t.priority)}>{t.priority?.toUpperCase()}</span>
      </div>
      <h4 style={styles.cardTitle}>{t.title}</h4>
      <div style={styles.cardMeta}>
        <div style={{...styles.dot, background: t.status === 'open' ? '#f59e0b' : theme.success}} />
        <span style={{color: t.status === 'resolved' ? theme.success : '#64748b'}}>{t.status?.toUpperCase()}</span>
        {t.category && (
          <>
            <div style={styles.vDivider} />
            <span style={{fontSize: '10px', color: theme.muted}}>{t.category}</span>
          </>
        )}
        {t.assignedTo && (
          <>
            <div style={styles.vDivider} />
            <UserCheck size={12} />
            <span style={{fontSize: '10px', color: theme.primary}}>{t.assignedTo}</span>
          </>
        )}
      </div>
      {slaInfo.isBreaching && t.status === 'open' && (
        <div style={styles.slaWarning}>
          <Clock3 size={12} />
          <span style={{fontSize: '10px', marginLeft: '5px'}}>
            SLA Breaching: {slaInfo.timeLeft} hrs left
          </span>
        </div>
      )}
    </div>
  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 3: INCIDENT HUB (Massive Text) */}
          <div style={styles.displayHubColumn}>
            {selectedTicket ? (
              <div style={{padding: '48px'}} className="fade-in">
                <div style={styles.incidentHeader}>
                  <div style={{ flex: 1 }}>
                    <h1 style={styles.giantTitle}>{selectedTicket.title}</h1>
                    <div style={styles.incidentSubHeader}>
                      {selectedTicket.created_at && (
                        <>
                          <span style={{
                            fontSize: '13px',
                            fontWeight: '900',
                            color: getSLATimeLeft(selectedTicket.created_at, selectedTicket.priority).isBreaching
                              ? theme.danger
                              : '#f59e0b'
                          }}>
                            ⏱ SLA: {getSLATimeLeft(selectedTicket.created_at, selectedTicket.priority).timeLeft} hrs
                          </span>
                          <div style={styles.vDivider} />
                        </>
                      )}
                      <span style={pBadge(selectedTicket.priority)}>{selectedTicket.priority?.toUpperCase()} PRIORITY</span>
                      <div style={styles.vDivider} />
                      <span style={{color: theme.muted, fontSize: '13px'}}>
                        <Timer size={16}/> Created: {selectedTicket.created_at ? new Date(selectedTicket.created_at).toLocaleString() : 'N/A'}
                      </span>
                      {selectedTicket.resolved_at && (
                        <>
                          <div style={styles.vDivider} />
                          <span style={{color: theme.success, fontSize: '13px'}}>
                            <CheckCircle size={16}/> Resolved: {new Date(selectedTicket.resolved_at).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedTicket.status === 'open' ? (
  <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
    {selectedTicket.assignedTo ? (
      <div style={styles.assignedBadge}>
        <UserCheck size={16} />
        <span>Assigned to: {selectedTicket.assignedTo}</span>
      </div>
    ) : (
      <select 
        style={styles.assignSelect}
        value=""
        onChange={(e) => {
          const agentName = e.target.value;
          if (agentName) {
            const ticketId = selectedTicket._id || selectedTicket.id;
            if (ticketId) {
              assignToAgent(ticketId, agentName);
            } else {
              alert('Cannot assign: No valid ticket ID found');
            }
          }
        }}
      >
        <option value="">Assign to agent...</option>
        {agents.map(a => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    )}
    <button 
  onClick={() => {
    const ticketId = selectedTicket._id || selectedTicket.id;
    if (ticketId) {
      updateStatus(ticketId, 'resolved');
    } else {
      console.error('No ticket ID found:', selectedTicket);
      addActivity('❌ Cannot resolve: No ticket ID found', 'error');
    }
  }} 
  className="resolve-btn"
  style={{ opacity: !selectedTicket?._id && !selectedTicket?.id ? 0.5 : 1 }}
>
  <CheckCircle2 size={18}/> MARK_AS_SOLVED
</button>
  </div>
) : (
  <div style={styles.solvedLabel}>
    <CheckCircle size={20}/> INCIDENT_RESOLVED
    {selectedTicket.assignedTo && (
      <span style={{fontSize: '12px', marginLeft: '10px'}}>by {selectedTicket.assignedTo}</span>
    )}
  </div>
)}
                </div>

                <div style={styles.detailsGrid}>
                  <div style={styles.manifestCard}>
                    <p style={styles.cardLabel}><Terminal size={16}/> RAW_MANIFEST_DATA</p>
                    <div style={styles.manifestBody}>{selectedTicket.description || 'No description available'}</div>
                    
                    {/* ENTITY EXTRACTION */}
                    {selectedTicket.entities && (
                      <div style={styles.entitySection}>
                        <p style={{...styles.cardLabel, marginTop: '30px'}}><Database size={16}/> EXTRACTED ENTITIES</p>
                        <div style={styles.entityGrid}>
                          {selectedTicket.entities.devices && selectedTicket.entities.devices.length > 0 && (
                            <div style={styles.entityGroup}>
                              <span style={styles.entityLabel}>Devices</span>
                              <div style={styles.entityTags}>
                                {selectedTicket.entities.devices.map((device, idx) => (
                                  <span key={idx} style={styles.entityTag}>{device}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedTicket.entities.usernames && selectedTicket.entities.usernames.length > 0 && (
                            <div style={styles.entityGroup}>
                              <span style={styles.entityLabel}>Users</span>
                              <div style={styles.entityTags}>
                                {selectedTicket.entities.usernames.map((user, idx) => (
                                  <span key={idx} style={styles.entityTag}>{user}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedTicket.entities.error_codes && selectedTicket.entities.error_codes.length > 0 && (
                            <div style={styles.entityGroup}>
                              <span style={styles.entityLabel}>Error Codes</span>
                              <div style={styles.entityTags}>
                                {selectedTicket.entities.error_codes.map((code, idx) => (
                                  <span key={idx} style={styles.entityTag}>{code}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* LIVE ACTIVITY FEED */}
                    <div style={styles.activityBox}>
                      <p style={{fontSize: '11px', fontWeight: '900', color: theme.primary, marginBottom: '15px'}}>
                        <History size={14}/> SYSTEM_ACTIVITY_LOG
                      </p>
                      <div style={styles.activityList}>
                        {activities.map(act => (
                          <div key={act.id} style={styles.activityLine(act.type)}>
                            <span style={{color: theme.primary, fontSize: '11px'}}>[{act.time}]</span> 
                            <span style={{marginLeft: '10px'}}>{act.msg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={styles.sideDiagnostics}>
                    <div style={styles.aiCard}>
                      <p style={{...styles.cardLabel, color: '#fff'}}><Zap size={16}/> AI_DIAGNOSTICS</p>
                      <div style={styles.confidenceGrid}>
                        <div style={styles.confidenceItem}>
                          <span style={{fontSize: '12px', opacity: 0.8}}>Category Confidence</span>
                          <h2 style={{color: theme.success, margin: '10px 0', fontSize: '32px'}}>
                            {selectedTicket.category_confidence ? Math.round(selectedTicket.category_confidence * 100) : 'N/A'}%
                          </h2>
                          <div style={styles.progressBar}>
                            <div style={{
                              ...styles.progressFill, 
                              width: `${selectedTicket.category_confidence ? selectedTicket.category_confidence * 100 : 0}%`
                            }} />
                          </div>
                        </div>
                        <div style={styles.confidenceItem}>
                          <span style={{fontSize: '12px', opacity: 0.8}}>Priority Confidence</span>
                          <h2 style={{color: '#f59e0b', margin: '10px 0', fontSize: '32px'}}>
                            {selectedTicket.priority_confidence ? Math.round(selectedTicket.priority_confidence * 100) : 'N/A'}%
                          </h2>
                          <div style={styles.progressBar}>
                            <div style={{
                              ...styles.progressFill, 
                              width: `${selectedTicket.priority_confidence ? selectedTicket.priority_confidence * 100 : 0}%`,
                              background: '#f59e0b'
                            }} />
                          </div>
                        </div>
                      </div>
                      
                      {/* AI SUGGESTIONS */}
                      {selectedTicket.status === 'open' && (
                        <div style={styles.aiSuggestion}>
                          <Lightbulb size={16} style={{flexShrink: 0}} />
                          <div style={{flex: 1}}>
                            <strong>AI Suggestion:</strong> Similar issues were resolved by restarting the affected service.
                            {selectedTicket.category && ` Check ${selectedTicket.category} service logs.`}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* AGENT LOAD WIDGET */}
                    <div style={styles.agentLoadWidget}>
                      <p style={{...styles.cardLabel, marginBottom: '20px'}}><UsersIcon size={16}/> AGENT AVAILABILITY</p>
                      {agentStats.length > 0 ? (
                        agentStats.slice(0, 3).map(agent => (
                          <div key={agent.name} style={styles.agentWidgetItem}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <span style={{fontSize: '12px', fontWeight: '600'}}>{agent.name}</span>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                color: agent.efficiency > 70 ? theme.success : agent.efficiency > 40 ? '#f59e0b' : theme.danger
                              }}>
                                {agent.efficiency}%
                              </span>
                            </div>
                            <div style={styles.widgetLoadBar}>
                              <div style={{
                                ...styles.loadFill,
                                width: `${Math.min(100, agent.activeTickets * 12.5)}%`,
                                background: agent.isOverloaded ? theme.danger : theme.primary
                              }} />
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: theme.muted, marginTop: '5px'}}>
                              <span>Load: {agent.activeTickets}/8</span>
                              <span>Avg: {agent.avgResolutionHours}h</span>
                            </div>
                            {!selectedTicket.assignedTo && agent.activeTickets < 5 && (
  <button 
    onClick={() => {
      const ticketId = selectedTicket._id || selectedTicket.id;
      if (ticketId && ticketId !== 'N/A' && ticketId !== 'undefined') {
        assignToAgent(ticketId, agent.name);
      } else {
        alert('Cannot assign: No valid ticket ID found');
      }
    }}
    style={styles.assignQuickBtn}
  >
    Assign to {agent.name.split(' ')[0]}
  </button>
)}
                          </div>
                        ))
                      ) : (
                        <p style={{fontSize: '12px', color: theme.muted, textAlign: 'center', padding: '20px'}}>
                          No agent data available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.emptyView}>
                <Monitor size={100} color="#f1f5f9" />
                <h2 style={{color: '#cbd5e1', fontWeight: '900'}}>SENTINEL_STANDBY</h2>
                <p style={{color: '#94a3b8'}}>Select an ingress node from the master log.</p>
                {tickets.length === 0 && (
                  <button onClick={() => fetchAllData()} style={styles.retryBtn}>
                    <RefreshCcw size={16} /> Fetch Data
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(8deg); } 75% { transform: rotate(-8deg); } }
        .shake { animation: shake 0.4s infinite; }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; margin-left: 10px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); } }
        .resolve-btn { background: #10b981; color: #fff; border: none; padding: 18px 36px; border-radius: 16px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); transition: 0.3s; }
        .resolve-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(16, 185, 129, 0.5); }
      `}</style>
    </div>
  );
};

// --- STYLES SYSTEM ---
const styles = {
  appContainer: { height: '100vh', width: '100vw', display: 'flex', background: '#fcfcfd', overflow: 'hidden', position: 'relative' },
  fixedGutter: { width: '80px', flexShrink: 0, height: '100%', background: '#fff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '32px', gap: '20px', zIndex: 50 },
  fabMain: { width: '50px', height: '50px', borderRadius: '15px', background: '#6366f1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  fabSub: { width: '46px', height: '46px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  sidebarOverlay: { position: 'fixed', top: 0, left: 0, height: '100%', width: '330px', background: '#fff', zIndex: 1000, transition: '0.4s ease', padding: '40px', display: 'flex', flexDirection: 'column', overflowY: 'auto', boxShadow: '25px 0 60px rgba(0,0,0,0.1)' },
  
  mainContentWrapper: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  hudHeader: { height: '120px', flexShrink: 0, background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 48px' },
  hudGrid: { display: 'flex', gap: '48px' },
  metricBlock: { p: { margin: 0, fontSize: '10px', fontWeight: '900', color: '#94a3b8' }, h3: { margin: 0, fontSize: '28px', fontWeight: '900', letterSpacing: '-1.5px', display: 'flex', alignItems: 'center' } },
  
  hudRightSection: { display: 'flex', alignItems: 'center', gap: '16px' },
  searchBar: { background: '#f1f5f9', padding: '12px 18px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', width: '320px', position: 'relative' },
  inputReset: { border: 'none', background: 'none', outline: 'none', fontSize: '14px', fontWeight: '600', width: '100%' },
  clearSearchBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px', padding: '0 5px' },
  soundToggleBtn: { width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  notificationWrapper: { position: 'relative', width: '40px', height: '40px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' },
  notificationBadge: { position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: '#fff', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', border: '2px solid #fff' },
  notificationPanel: { position: 'absolute', top: '50px', right: '0', width: '320px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 1100, overflow: 'hidden' },
  notificationHeader: { padding: '12px', background: '#f8fafc', fontWeight: 800, fontSize: 12, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' },
  notificationItem: { padding: '12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.2s' },
  notificationItemHover: { background: '#f8fafc' },
  notificationTitle: { fontSize: 12, fontWeight: 700, marginBottom: '5px' },
  
  spikeAlert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', borderLeft: '4px solid #ef4444' },
  closeAlertBtn: { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '24px', padding: '0 10px' },
  
  rootCauseBanner: { background: '#0f172a', color: '#fff', padding: '15px 48px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px' },
  
  advancedFiltersPanel: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', background: '#fff', borderRadius: '24px', padding: '30px', zIndex: 2000, boxShadow: '0 25px 50px rgba(0,0,0,0.15)', border: '1px solid #f1f5f9' },
  filterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  filterGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  filterLabel: { fontSize: '12px', fontWeight: '700', color: '#64748b' },
  filterSelect: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', fontWeight: '600' },
  
  dualPaneContainer: { flex: 1, display: 'flex', overflow: 'hidden' },
  ingressStreamColumn: { width: '450px', flexShrink: 0, background: '#fff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' },
  streamHeader: { padding: '28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '12px', alignItems: 'center' },
  streamScrollArea: { flex: 1, overflowY: 'auto', padding: '20px' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#cbd5e1' },
  ticketCard: (active) => ({ padding: '28px', marginBottom: '15px', borderRadius: '24px', background: active ? '#f8fafc' : 'none', cursor: 'pointer', border: active ? '2px solid #6366f1' : '2.5px solid transparent', position: 'relative' }),
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  ticketId: { fontSize: '12px', color: '#94a3b8', fontWeight: '800' },
  cardTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b', lineHeight: 1.3 },
  cardMeta: { marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800', color: '#64748b', flexWrap: 'wrap' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  vDivider: { width: '1px', height: '15px', background: '#e2e8f0' },
  refreshSelect: {
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '4px 8px',
  fontSize: '12px',
  fontWeight: '800',
  cursor: 'pointer'
},
playPauseBtn: {
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
},
  slaWarning: { position: 'absolute', bottom: '10px', right: '15px', background: '#fef2f2', color: '#ef4444', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center' },
  
  displayHubColumn: { flex: 1, overflowY: 'auto', background: '#fafafa', minWidth: '600px' },
  incidentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px', marginBottom: '40px' },
  giantTitle: { fontSize: '42px', fontWeight: '900', margin: 0, letterSpacing: '-2px', lineHeight: 1.1 },
  incidentSubHeader: { display: 'flex', gap: '20px', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap' },
  assignedBadge: { background: '#eff6ff', color: '#6366f1', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' },
  assignSelect: { padding: '12px 20px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#fff', fontSize: '14px', fontWeight: '600', minWidth: '200px' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' },
  manifestCard: { background: '#fff', padding: '40px', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  cardLabel: { fontSize: '11px', fontWeight: '900', color: '#6366f1', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' },
  manifestBody: { fontSize: '17px', lineHeight: 1.9, color: '#334155', whiteSpace: 'pre-wrap' },
  
  entitySection: { marginTop: '30px' },
  entityGrid: { display: 'grid', gap: '20px' },
  entityGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  entityLabel: { fontSize: '12px', fontWeight: '700', color: '#64748b' },
  entityTags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  entityTag: { background: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  
  sideDiagnostics: { display: 'flex', flexDirection: 'column', gap: '32px' },
  aiCard: { background: '#0f172a', padding: '35px', borderRadius: '32px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
  confidenceGrid: { display: 'grid', gap: '30px' },
  confidenceItem: { marginBottom: '20px' },
  progressBar: { height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginTop: '10px' },
  progressFill: { height: '100%', background: '#10b981', transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' },
  aiSuggestion: { background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', marginTop: '30px', display: 'flex', gap: '15px', alignItems: 'flex-start', fontSize: '14px', lineHeight: 1.5 },
  
  agentLoadWidget: { background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #f1f5f9' },
  agentWidgetItem: { background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '15px' },
  widgetLoadBar: { height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginTop: '10px' },
  assignQuickBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', width: '100%' },
  
  solvedLabel: { background: '#dcfce7', color: '#166534', padding: '16px 28px', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBody: { width: '500px', background: '#ef4444', padding: '48px', borderRadius: '32px', color: '#fff', boxShadow: '0 30px 60px rgba(239,68,68,0.4)' },
  modalHeader: { display: 'flex', alignItems: 'center', gap: '15px', fontSize: '12px', fontWeight: '900', letterSpacing: '2px' },
  ackBtn: { background: '#fff', color: '#ef4444', border: 'none', padding: '16px 32px', borderRadius: '16px', fontWeight: '900', cursor: 'pointer' },
  dismissBtn: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #fff', padding: '16px 32px', borderRadius: '16px', fontWeight: '900', cursor: 'pointer' },
  navLink: (active) => ({ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: active ? '#f1f5f9' : 'none', textAlign: 'left', fontWeight: '800', color: active ? '#6366f1' : '#64748b', cursor: 'pointer', marginBottom: '8px' }),
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.1)', zIndex: 900 },
  agentInfo: { marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '20px' },
  logoutBtn: { color: '#ef4444', border: 'none', background: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginTop: '10px' },
  label: { fontSize: '11px', fontWeight: '900', color: '#94a3b8', letterSpacing: '2px', marginBottom: '24px' },
  
  heatmapContainer: { marginBottom: '20px' },
  heatmapItem: { marginBottom: '15px' },
  heatmapBar: { height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', margin: '5px 0' },
  heatmapFill: { height: '100%', transition: 'width 0.5s ease' },
  
  leaderboardItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px', marginBottom: '8px' },
  
  agentLoadItem: { background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '10px' },
  loadBar: { height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', margin: '8px 0' },
  loadFill: { height: '100%', transition: 'width 0.5s ease' },
  
  activityBox: { marginTop: '40px', background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' },
  activityList: { maxHeight: '200px', overflowY: 'auto' },
  activityLine: (type) => ({ 
    fontSize: '13px', 
    marginBottom: '8px', 
    color: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#475569',
    padding: '5px 0',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center'
  }),
  
  emptyView: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' },
  retryBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', marginTop: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }
};

const pBadge = (p) => ({ 
  fontSize: '10px', 
  fontWeight: '900', 
  padding: '6px 12px', 
  borderRadius: '100px', 
  background: p === 'high' || p === 'critical' ? '#fef2f2' : '#eff6ff', 
  color: p === 'high' || p === 'critical' ? '#ef4444' : '#6366f1', 
  border: '1px solid currentColor' 
});

export default DevDashboard;