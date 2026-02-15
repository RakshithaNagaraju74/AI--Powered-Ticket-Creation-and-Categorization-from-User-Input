import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, FileText, Video, HelpCircle, 
  ChevronRight, ThumbsUp, ThumbsDown, ExternalLink,
  Clock, Eye, Star, TrendingUp, Zap, Cpu, Shield,
  Wifi, HardDrive, Monitor, Printer, Smartphone,
  Mail, Lock, Database, Cloud, Server, Download,
  Bookmark, Share2, Copy, CheckCircle, X,
  Filter, Grid, List, Menu, ChevronLeft,
  MessageSquare, AlertCircle, Award, Users,
  Sparkles, Heart, Calendar, Tag, Volume2,
  BarChart, PieChart, Layers, Code, Settings
} from 'lucide-react';

const KnowledgeBase = ({ theme, userData, onClose, initialCategory = 'all' }) => {
  // Default theme in case theme prop is not provided
  const safeTheme = theme || {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#10b981',
    bg: '#fcfcfd',
    sidebar: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
    glass: 'rgba(255, 255, 255, 0.7)',
    border: '#f1f5f9',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  };

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [helpfulFeedback, setHelpfulFeedback] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'popular',
    contentTypes: [],
    difficulty: []
  });

  // Knowledge base articles data
  const articles = [
    // Getting Started (Category: getting-started)
    {
      id: 'gs-1',
      title: 'Getting Started with the Support Portal',
      description: 'Learn how to navigate the support portal, create tickets, and track their progress.',
      content: `
        <h2>Welcome to the Support Portal</h2>
        <p>The support portal is your central hub for all IT-related requests and assistance. This guide will help you get started with the basic features.</p>
        
        <h3>Creating Your First Ticket</h3>
        <ol>
          <li>Click on the "Create New Ticket" button on the dashboard</li>
          <li>Enter a clear title summarizing your issue</li>
          <li>Provide a detailed description including error messages and steps to reproduce</li>
          <li>Our AI will automatically categorize and prioritize your ticket</li>
          <li>Submit and track your ticket in real-time</li>
        </ol>
        
        <h3>Tracking Ticket Status</h3>
        <p>You can monitor your tickets in the "Ticket History" section. Each ticket goes through these stages:</p>
        <ul>
          <li><strong>NEW:</strong> Just submitted, awaiting review</li>
          <li><strong>IN PROGRESS:</strong> Assigned to an agent</li>
          <li><strong>PENDING:</strong> Waiting for additional information</li>
          <li><strong>RESOLVED:</strong> Issue has been addressed</li>
        </ul>
        
        <h3>Pro Tips</h3>
        <ul>
          <li>Enable notifications to get real-time updates</li>
          <li>Use the AI assistant for quick questions</li>
          <li>Provide feedback on resolved tickets to help us improve</li>
        </ul>
      `,
      category: 'getting-started',
      subcategory: 'basics',
      tags: ['onboarding', 'new user', 'tickets'],
      views: 15420,
      likes: 342,
      dislikes: 12,
      readTime: '5 min',
      author: 'Sarah Johnson',
      lastUpdated: '2026-02-10',
      contentType: 'article',
      difficulty: 'beginner',
      featured: true,
      popular: true,
      video: null
    },
    {
      id: 'gs-2',
      title: 'Understanding Ticket Priority Levels',
      description: 'Learn how ticket priorities are determined and what each priority level means for response times.',
      content: `
        <h2>Ticket Priority Levels Explained</h2>
        <p>Our AI-powered system automatically assigns priority levels based on the content and urgency of your request.</p>
        
        <h3>Priority Levels</h3>
        
        <h4>🔴 CRITICAL (Response: &lt; 1 hour)</h4>
        <ul>
          <li>System-wide outages</li>
          <li>Security breaches</li>
          <li>Data loss incidents</li>
          <li>Production systems down</li>
        </ul>
        
        <h4>🟠 HIGH (Response: &lt; 4 hours)</h4>
        <ul>
          <li>Individual system unavailable</li>
          <li>Major functionality broken</li>
          <li>Blocked workflow for multiple users</li>
        </ul>
        
        <h4>🟡 MEDIUM (Response: &lt; 24 hours)</h4>
        <ul>
          <li>Individual user issues</li>
          <li>Minor functionality problems</li>
          <li>Feature requests</li>
        </ul>
        
        <h4>🟢 LOW (Response: &lt; 48 hours)</h4>
        <ul>
          <li>General inquiries</li>
          <li>Documentation requests</li>
          <li>Non-urgent questions</li>
        </ul>
        
        <h3>How Priority is Determined</h3>
        <p>Our AI analyzes:</p>
        <ul>
          <li>Keywords indicating urgency (e.g., "down", "broken", "emergency")</li>
          <li>Number of affected users</li>
          <li>Business impact</li>
          <li>Historical patterns</li>
        </ul>
      `,
      category: 'getting-started',
      subcategory: 'basics',
      tags: ['priority', 'sla', 'response time'],
      views: 8930,
      likes: 215,
      dislikes: 8,
      readTime: '4 min',
      author: 'Michael Chen',
      lastUpdated: '2026-02-05',
      contentType: 'article',
      difficulty: 'beginner',
      featured: true,
      popular: true,
      video: null
    },

    // Hardware Issues (Category: hardware)
    {
      id: 'hw-1',
      title: 'Troubleshooting Laptop Overheating Issues',
      description: 'Step-by-step guide to identify and fix laptop overheating problems.',
      content: `
        <h2>Laptop Overheating: Causes and Solutions</h2>
        <p>Overheating is a common issue that can affect performance and hardware longevity. Follow this comprehensive guide to diagnose and fix overheating problems.</p>
        
        <h3>Signs of Overheating</h3>
        <ul>
          <li>Laptop feels extremely hot to touch</li>
          <li>Fan running loudly constantly</li>
          <li>Sudden shutdowns or restarts</li>
          <li>Performance throttling (slowing down)</li>
          <li>Screen flickering or artifacts</li>
        </ul>
        
        <h3>Quick Fixes</h3>
        <ol>
          <li><strong>Check ventilation:</strong> Ensure air vents are not blocked. Use on hard surfaces, not beds or laps.</li>
          <li><strong>Clean the fans:</strong> Use compressed air to remove dust buildup from vents and fans.</li>
          <li><strong>Update drivers:</strong> Outdated drivers can cause inefficient power management.</li>
          <li><strong>Adjust power settings:</strong> Use "Balanced" or "Power Saver" mode instead of "High Performance".</li>
          <li><strong>Monitor temperatures:</strong> Use tools like HWMonitor or Core Temp to check CPU/GPU temps.</li>
        </ol>
        
        <h3>When to Contact IT Support</h3>
        <ul>
          <li>Temperatures consistently above 90°C under light load</li>
          <li>Laptop shuts down within minutes of startup</li>
          <li>Burning smell coming from laptop</li>
          <li>Physical damage to the laptop casing</li>
        </ul>
        
        <div class="tip-box">
          <strong>💡 Pro Tip:</strong> Regular maintenance every 3-6 months can prevent most overheating issues. Consider getting a laptop cooling pad for extended use.
        </div>
      `,
      category: 'hardware',
      subcategory: 'laptops',
      tags: ['overheating', 'fan', 'temperature', 'hardware'],
      views: 23450,
      likes: 567,
      dislikes: 23,
      readTime: '8 min',
      author: 'David Kim',
      lastUpdated: '2026-02-08',
      contentType: 'guide',
      difficulty: 'intermediate',
      featured: true,
      popular: true,
      video: 'https://youtube.com/watch?v=example1'
    },
    {
      id: 'hw-2',
      title: 'External Monitor Not Detected - Troubleshooting Guide',
      description: 'Fix connectivity issues when your external monitor shows "No Signal" or is not detected.',
      content: `
        <h2>External Monitor Connection Issues</h2>
        <p>When your external monitor isn't detected, it can be frustrating. Follow these steps to diagnose and fix the problem.</p>
        
        <h3>Quick Checks</h3>
        <ol>
          <li>Verify the monitor is powered on (check power light)</li>
          <li>Ensure cables are securely connected at both ends</li>
          <li>Try a different cable if available</li>
          <li>Test the monitor with another device</li>
        </ol>
        
        <h3>Windows 10/11 Troubleshooting</h3>
        <ol>
          <li>Press <strong>Windows + P</strong> and select "Duplicate" or "Extend"</li>
          <li>Go to <strong>Settings > System > Display</strong></li>
          <li>Click "Detect" under Multiple displays</li>
          <li>Update graphics drivers from Device Manager</li>
        </ol>
        
        <h3>macOS Troubleshooting</h3>
        <ol>
          <li>Check System Preferences > Displays</li>
          <li>Press Option key and click "Detect Displays"</li>
          <li>Reset NVRAM/PRAM (Intel Macs)</li>
          <li>Check for macOS updates</li>
        </ol>
        
        <h3>Hardware-Specific Issues</h3>
        <ul>
          <li><strong>HDMI:</strong> Try different HDMI ports, check HDCP compatibility</li>
          <li><strong>DisplayPort:</strong> Ensure the cable is fully inserted (clicks into place)</li>
          <li><strong>USB-C/Thunderbolt:</strong> Verify your laptop supports video over USB-C</li>
          <li><strong>Docking Stations:</strong> Update dock firmware, try direct connection</li>
        </ul>
        
        <h3>Common Error Codes</h3>
        <ul>
          <li><strong>Code 43:</strong> Driver issue - reinstall graphics drivers</li>
          <li><strong>Code 31:</strong> Driver failed to load - update Windows</li>
          <li><strong>No Signal:</strong> Check input source on monitor menu</li>
        </ul>
      `,
      category: 'hardware',
      subcategory: 'monitors',
      tags: ['monitor', 'display', 'external monitor', 'no signal'],
      views: 18760,
      likes: 432,
      dislikes: 18,
      readTime: '6 min',
      author: 'Emily Rodriguez',
      lastUpdated: '2026-02-01',
      contentType: 'guide',
      difficulty: 'intermediate',
      featured: false,
      popular: true,
      video: null
    },

    // Software Issues (Category: software)
    {
      id: 'sw-1',
      title: 'Microsoft Excel Crashing or Freezing - Fixes',
      description: 'Comprehensive solutions for Excel crashes, freezes, and performance issues.',
      content: `
        <h2>Fix Excel Crashing and Freezing Issues</h2>
        <p>Excel crashing can disrupt your work. Here's how to diagnose and fix common Excel issues.</p>
        
        <h3>Quick Fixes</h3>
        <ol>
          <li>Open Excel in Safe Mode (press Ctrl while opening)</li>
          <li>Disable add-ins that might be causing conflicts</li>
          <li>Repair Office installation via Control Panel</li>
          <li>Update Office to the latest version</li>
        </ol>
        
        <h3>Fix Specific Error Messages</h3>
        
        <h4>"Excel has stopped working"</h4>
        <ul>
          <li>Clear Excel cache: %appdata%\\Microsoft\\Excel\\ (delete contents)</li>
          <li>Check for conflicting software (antivirus, other Office add-ins)</li>
          <li>Run Windows Update to get latest system fixes</li>
        </ul>
        
        <h4>"Not enough memory to complete this action"</h4>
        <ul>
          <li>Close other applications to free up RAM</li>
          <li>Reduce file size by removing unnecessary formatting</li>
          <li>Convert large files to .xlsb format (smaller file size)</li>
          <li>Use 64-bit Excel for files >2GB</li>
        </ul>
        
        <h4>Large File Performance Issues</h4>
        <ul>
          <li>Disable automatic calculations (Formulas > Calculation Options > Manual)</li>
          <li>Remove volatile functions like NOW(), TODAY(), RAND()</li>
          <li>Use Power Query for data transformation instead of formulas</li>
          <li>Compress images in the workbook</li>
        </ul>
        
        <div class="warning-box">
          <strong>⚠️ Important:</strong> Always backup your files before attempting repairs or deleting cache files.
        </div>
      `,
      category: 'software',
      subcategory: 'office',
      tags: ['excel', 'microsoft office', 'crash', 'freeze'],
      views: 32150,
      likes: 876,
      dislikes: 34,
      readTime: '10 min',
      author: 'James Wilson',
      lastUpdated: '2026-02-12',
      contentType: 'guide',
      difficulty: 'intermediate',
      featured: true,
      popular: true,
      video: null
    },
    {
      id: 'sw-2',
      title: 'VPN Connection Issues - Complete Troubleshooting',
      description: 'Step-by-step guide to fix VPN connection problems, disconnections, and authentication errors.',
      content: `
        <h2>VPN Troubleshooting Guide</h2>
        <p>VPN issues can prevent remote work. This guide covers common VPN problems and their solutions.</p>
        
        <h3>Common VPN Issues</h3>
        <ul>
          <li>Connection drops frequently</li>
          <li>Authentication failures</li>
          <li>Slow performance after connecting</li>
          <li>Unable to access internal resources</li>
          <li>Error codes: 809, 619, 800, 789</li>
        </ul>
        
        <h3>Quick Fixes</h3>
        <ol>
          <li>Restart your computer and network equipment</li>
          <li>Check if VPN client needs updates</li>
          <li>Verify your internet connection is stable</li>
          <li>Try connecting from a different network</li>
        </ol>
        
        <h3>Specific Error Fixes</h3>
        
        <h4>Error 809: VPN connection failed</h4>
        <ul>
          <li>Check firewall settings (allow VPN traffic)</li>
          <li>Ensure VPN protocol (PPTP/L2TP/IKEv2) is allowed</li>
          <li>Verify server address is correct</li>
        </ul>
        
        <h4>Error 619: Port or connection ended</h4>
        <ul>
          <li>Disable IPv6 on your network adapter</li>
          <li>Reset TCP/IP: netsh int ip reset</li>
          <li>Check if ISP is blocking VPN ports</li>
        </ul>
        
        <h4>Slow VPN Performance</h4>
        <ul>
          <li>Use split tunneling (only route work traffic through VPN)</li>
          <li>Connect to nearest VPN server</li>
          <li>Upgrade internet connection speed</li>
          <li>Check for bandwidth-heavy applications</li>
        </ul>
        
        <h3>Advanced Diagnostics</h3>
        <pre>
# Test VPN connectivity
ping vpn.company.com
tracert vpn.company.com

# Check DNS resolution
nslookup internal.company.com

# View VPN logs (Windows)
Get-WinEvent -LogName Microsoft-Windows-VPN/Operational
        </pre>
      `,
      category: 'software',
      subcategory: 'networking',
      tags: ['vpn', 'remote access', 'connection', 'network'],
      views: 28430,
      likes: 654,
      dislikes: 27,
      readTime: '12 min',
      author: 'Lisa Thompson',
      lastUpdated: '2026-02-09',
      contentType: 'guide',
      difficulty: 'advanced',
      featured: true,
      popular: true,
      video: null
    },

    // Network Issues (Category: network)
    {
      id: 'net-1',
      title: 'WiFi Connection Drops Frequently - Fix Guide',
      description: 'Diagnose and fix intermittent WiFi disconnections on Windows and macOS.',
      content: `
        <h2>Fix WiFi Connection Drops</h2>
        <p>Intermittent WiFi disconnections can be frustrating. Here's how to stabilize your wireless connection.</p>
        
        <h3>Quick Checks</h3>
        <ol>
          <li>Move closer to the router (check signal strength)</li>
          <li>Restart your router and modem</li>
          <li>Check if other devices have the same issue</li>
          <li>Update WiFi adapter drivers</li>
        </ol>
        
        <h3>Windows Specific Fixes</h3>
        <ul>
          <li>Disable power saving for WiFi adapter</li>
          <li>Run network troubleshooter</li>
          <li>Reset network settings: netsh winsock reset</li>
          <li>Change WiFi frequency to 5GHz if available</li>
        </ul>
        
        <h3>macOS Specific Fixes</h3>
        <ul>
          <li>Forget network and reconnect</li>
          <li>Create new network location</li>
          <li>Reset SMC and NVRAM</li>
          <li>Disable Bluetooth if causing interference</li>
        </ul>
        
        <h3>Router Optimization</h3>
        <ul>
          <li>Change WiFi channel (use less congested channel)</li>
          <li>Update router firmware</li>
          <li>Position router centrally, away from obstacles</li>
          <li>Consider mesh WiFi for large spaces</li>
        </ul>
        
        <div class="tip-box">
          <strong>📶 Pro Tip:</strong> Use WiFi analyzer apps to find the least congested channel in your area.
        </div>
      `,
      category: 'network',
      subcategory: 'wifi',
      tags: ['wifi', 'internet', 'connection drops', 'wireless'],
      views: 45670,
      likes: 1123,
      dislikes: 45,
      readTime: '7 min',
      author: 'Robert Garcia',
      lastUpdated: '2026-02-07',
      contentType: 'guide',
      difficulty: 'intermediate',
      featured: true,
      popular: true,
      video: null
    },

    // Email Issues (Category: email)
    {
      id: 'email-1',
      title: 'Outlook Search Not Working - Fixes',
      description: 'Restore Outlook search functionality with these proven solutions.',
      content: `
        <h2>Fix Outlook Search Problems</h2>
        <p>When Outlook search stops working, finding emails becomes impossible. Follow these steps to restore search functionality.</p>
        
        <h3>Quick Fixes</h3>
        <ol>
          <li>Restart Outlook and try search again</li>
          <li>Check if indexing is complete (search bar shows "Indexing complete")</li>
          <li>Run Windows Search troubleshooter</li>
          <li>Repair Outlook data files (.pst/.ost)</li>
        </ol>
        
        <h3>Rebuild Search Index</h3>
        <ol>
          <li>Close Outlook</li>
          <li>Go to Control Panel > Indexing Options</li>
          <li>Click "Advanced" then "Rebuild"</li>
          <li>Wait for indexing to complete (may take hours)</li>
        </ol>
        
        <h3>Fix Instant Search Settings</h3>
        <ul>
          <li>Enable Instant Search in Outlook options</li>
          <li>Check if search scope is set to "All Mailboxes"</li>
          <li>Disable and re-enable indexing for Outlook</li>
          <li>Clear search history</li>
        </ul>
        
        <h3>Advanced Solutions</h3>
        <ul>
          <li>Create new Outlook profile</li>
          <li>Run Microsoft Support and Recovery Assistant</li>
          <li>Check for corrupt search database (delete Windows.edb)</li>
          <li>Repair Office installation</li>
        </ul>
      `,
      category: 'email',
      subcategory: 'outlook',
      tags: ['outlook', 'email', 'search', 'indexing'],
      views: 19870,
      likes: 487,
      dislikes: 19,
      readTime: '6 min',
      author: 'Patricia Lee',
      lastUpdated: '2026-02-03',
      contentType: 'article',
      difficulty: 'intermediate',
      featured: false,
      popular: true,
      video: null
    },

    // Security (Category: security)
    {
      id: 'sec-1',
      title: 'Password Best Practices and Security Tips',
      description: 'Learn how to create strong passwords and protect your accounts from breaches.',
      content: `
        <h2>Password Security Guide</h2>
        <p>Strong passwords are your first line of defense against unauthorized access. Here's how to create and manage them securely.</p>
        
        <h3>Creating Strong Passwords</h3>
        <ul>
          <li>Use at least 12 characters</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Add numbers and special characters</li>
          <li>Avoid personal information (names, birthdays)</li>
          <li>Don't use common words or patterns</li>
        </ul>
        
        <h3>Password Examples</h3>
        <div class="code-block">
❌ Weak: password123
❌ Weak: John1985!
❌ Weak: qwerty12345

✅ Strong: C0mpl3x!P@ssw0rd
✅ Strong: Purpl3$ky*Danc3r42
✅ Strong: 8#mYc@t$L0v3sTuna
        </div>
        
        <h3>Password Management Tips</h3>
        <ul>
          <li>Use a password manager (Bitwarden, 1Password, LastPass)</li>
          <li>Enable two-factor authentication (2FA) on all accounts</li>
          <li>Never reuse passwords across sites</li>
          <li>Change passwords immediately if compromised</li>
          <li>Use passphrases for easier remembering</li>
        </ul>
        
        <h3>Two-Factor Authentication (2FA) Options</h3>
        <ul>
          <li><strong>SMS codes:</strong> Convenient but less secure (SIM swapping risk)</li>
          <li><strong>Authenticator apps:</strong> Google Authenticator, Microsoft Authenticator</li>
          <li><strong>Hardware tokens:</strong> YubiKey, Titan Security Key (most secure)</li>
          <li><strong>Biometrics:</strong> Fingerprint, facial recognition</li>
        </ul>
        
        <h3>What to Do If Your Password Is Compromised</h3>
        <ol>
          <li>Change password immediately</li>
          <li>Check account for unauthorized activity</li>
          <li>Enable 2FA if not already enabled</li>
          <li>Notify IT security team</li>
          <li>Check other accounts for similar passwords</li>
        </ol>
        
        <div class="warning-box">
          <strong>🔐 Important:</strong> Never share passwords via email or chat. IT will never ask for your password.
        </div>
      `,
      category: 'security',
      subcategory: 'authentication',
      tags: ['password', 'security', '2fa', 'authentication'],
      views: 36780,
      likes: 892,
      dislikes: 31,
      readTime: '8 min',
      author: 'Thomas Anderson',
      lastUpdated: '2026-02-11',
      contentType: 'guide',
      difficulty: 'beginner',
      featured: true,
      popular: true,
      video: null
    },

    // Account Access (Category: account)
    {
      id: 'acc-1',
      title: 'Account Locked or Disabled - Recovery Steps',
      description: 'Step-by-step guide to regain access when your account is locked or disabled.',
      content: `
        <h2>Account Recovery Guide</h2>
        <p>Getting locked out of your account can halt your work. Follow these steps to regain access quickly.</p>
        
        <h3>Why Accounts Get Locked</h3>
        <ul>
          <li>Multiple failed login attempts (usually 5-10)</li>
          <li>Password expired (90-day policy)</li>
          <li>Suspicious activity detected</li>
          <li>Account disabled by administrator</li>
          <li>Session timeout with remembered credentials</li>
        </ul>
        
        <h3>Self-Service Recovery</h3>
        <ol>
          <li>Wait 15-30 minutes for automatic unlock</li>
          <li>Use "Forgot Password" option</li>
          <li>Verify identity via email or phone</li>
          <li>Set new password (meeting complexity requirements)</li>
          <li>Check spam folder for recovery emails</li>
        </ol>
        
        <h3>Contact IT Support</h3>
        <p>If self-service doesn't work, contact IT with:</p>
        <ul>
          <li>Your full name and employee ID</li>
          <li>Date and time of last successful login</li>
          <li>Any error messages received</li>
          <li>Verification details (security questions, manager name)</li>
        </ul>
        
        <h3>Prevent Future Lockouts</h3>
        <ul>
          <li>Use password manager to remember complex passwords</li>
          <li>Set calendar reminder for password expiry</li>
          <li>Enable biometric login where available</li>
          <li>Keep recovery email/phone updated</li>
        </ul>
      `,
      category: 'account',
      subcategory: 'access',
      tags: ['account', 'locked', 'password', 'access'],
      views: 21980,
      likes: 534,
      dislikes: 22,
      readTime: '5 min',
      author: 'Jennifer Martinez',
      lastUpdated: '2026-02-06',
      contentType: 'article',
      difficulty: 'beginner',
      featured: true,
      popular: true,
      video: null
    },

    // Video Tutorials
    {
      id: 'video-1',
      title: 'Video: Creating and Managing Support Tickets',
      description: 'Watch this 5-minute video tutorial on how to effectively create and manage support tickets.',
      content: `
        <h2>Video Tutorial: Ticket Management</h2>
        <p>This comprehensive video walks you through the entire ticket lifecycle - from creation to resolution.</p>
        
        <div class="video-placeholder">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 300px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; margin-bottom: 20px;">
            <Video size={64} />
            <span style="margin-left: 16px; font-size: 20px;">Video Player Would Be Here</span>
          </div>
        </div>
        
        <h3>Video Chapters</h3>
        <ul>
          <li><strong>0:00</strong> - Introduction</li>
          <li><strong>1:30</strong> - Creating a new ticket</li>
          <li><strong>2:45</strong> - Adding screenshots and attachments</li>
          <li><strong>3:30</strong> - Tracking ticket status</li>
          <li><strong>4:15</strong> - Responding to agent queries</li>
          <li><strong>5:00</strong> - Closing and feedback</li>
        </ul>
        
        <h3>Transcript Excerpt</h3>
        <p>"Welcome to the support portal tutorial. In this video, I'll show you how to create tickets efficiently so our team can help you faster..."</p>
      `,
      category: 'videos',
      subcategory: 'tutorials',
      tags: ['video', 'tutorial', 'tickets', 'how-to'],
      views: 8900,
      likes: 210,
      dislikes: 8,
      readTime: '5 min video',
      author: 'Training Team',
      lastUpdated: '2026-01-28',
      contentType: 'video',
      difficulty: 'beginner',
      featured: false,
      popular: false,
      video: 'https://youtube.com/watch?v=example2'
    }
  ];

  // Categories with icons and colors
  const categories = [
    { id: 'all', name: 'All Articles', icon: <BookOpen size={20} />, color: '#6366f1' },
    { id: 'getting-started', name: 'Getting Started', icon: <Sparkles size={20} />, color: '#10b981' },
    { id: 'hardware', name: 'Hardware', icon: <Monitor size={20} />, color: '#f59e0b' },
    { id: 'software', name: 'Software', icon: <Code size={20} />, color: '#3b82f6' },
    { id: 'network', name: 'Network', icon: <Wifi size={20} />, color: '#8b5cf6' },
    { id: 'email', name: 'Email', icon: <Mail size={20} />, color: '#ec4899' },
    { id: 'security', name: 'Security', icon: <Shield size={20} />, color: '#ef4444' },
    { id: 'account', name: 'Account Access', icon: <Lock size={20} />, color: '#14b8a6' },
    { id: 'videos', name: 'Video Tutorials', icon: <Video size={20} />, color: '#f97316' }
  ];

  // Get category color helper
  const getCategoryColor = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#64748b';
  };

  // Get category icon helper
  const getCategoryIcon = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.icon : <BookOpen size={20} />;
  };

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    // Category filter
    if (activeCategory !== 'all' && article.category !== activeCategory) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query)) ||
        article.content.toLowerCase().includes(query)
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by filter
    if (filters.sortBy === 'popular') return b.views - a.views;
    if (filters.sortBy === 'recent') return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    if (filters.sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  // Featured articles (top by views)
  const featuredArticles = articles.filter(a => a.featured).sort((a, b) => b.views - a.views).slice(0, 3);

  // Popular tags (count occurrences)
  const allTags = articles.flatMap(a => a.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([tag]) => tag);

  // Handle bookmark toggling
  const toggleBookmark = (articleId) => {
    setBookmarkedArticles(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  // Handle helpful feedback
  const markHelpful = (articleId, isHelpful) => {
    setHelpfulFeedback(prev => ({
      ...prev,
      [articleId]: isHelpful
    }));
    
    // In a real app, you'd send this to your backend
    console.log(`Article ${articleId} marked as ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  // Track article view
  const trackView = (article) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== article.id);
      return [article.id, ...filtered].slice(0, 10);
    });
  };

  // Handle article click
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    trackView(article);
  };

  // Copy article link
  const copyArticleLink = (articleId) => {
    const url = `${window.location.origin}/knowledge-base/${articleId}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  // Format number with K/M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      border: `1px solid ${safeTheme.border}`,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 32px',
        borderBottom: `1px solid ${safeTheme.border}`,
        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <BookOpen size={28} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Knowledge Base</h2>
              <p style={{ fontSize: '14px', color: safeTheme.muted, margin: '4px 0 0 0' }}>
                Find answers, guides, and tutorials
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'white',
                border: `1px solid ${safeTheme.border}`,
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                ':hover': {
                  background: '#f1f5f9',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <X size={20} color={safeTheme.muted} />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: safeTheme.muted,
              zIndex: 1
            }} />
            <input
              type="text"
              placeholder="Search articles, guides, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                background: 'white',
                border: `2px solid ${safeTheme.border}`,
                borderRadius: '16px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = safeTheme.primary}
              onBlur={(e) => e.target.style.borderColor = safeTheme.border}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: safeTheme.muted,
                  padding: '4px'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '16px 20px',
              background: showFilters ? safeTheme.primary : 'white',
              color: showFilters ? 'white' : safeTheme.text,
              border: `2px solid ${showFilters ? safeTheme.primary : safeTheme.border}`,
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Filter size={20} />
            Filters
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={{
              padding: '16px',
              background: 'white',
              border: `2px solid ${safeTheme.border}`,
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: 'white',
            borderRadius: '16px',
            border: `1px solid ${safeTheme.border}`,
            animation: 'slideDown 0.3s ease'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: safeTheme.muted, marginBottom: '8px' }}>
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${safeTheme.border}`,
                    borderRadius: '12px',
                    background: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Updated</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: safeTheme.muted, marginBottom: '8px' }}>
                  Content Type
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['article', 'guide', 'video'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={filters.contentTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, contentTypes: [...filters.contentTypes, type]});
                          } else {
                            setFilters({...filters, contentTypes: filters.contentTypes.filter(t => t !== type)});
                          }
                        }}
                      />
                      <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: safeTheme.muted, marginBottom: '8px' }}>
                  Difficulty
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={filters.difficulty.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, difficulty: [...filters.difficulty, level]});
                          } else {
                            setFilters({...filters, difficulty: filters.difficulty.filter(l => l !== level)});
                          }
                        }}
                      />
                      <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar - Categories */}
        <div style={{
          width: '260px',
          borderRight: `1px solid ${safeTheme.border}`,
          padding: '24px 0',
          background: '#f8fafc',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '0 16px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 12px 0', padding: '0 8px' }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '12px',
                    background: activeCategory === cat.id ? `${cat.color}15` : 'transparent',
                    color: activeCategory === cat.id ? cat.color : safeTheme.muted,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: activeCategory === cat.id ? '700' : '500',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                  {cat.name}
                  {cat.id !== 'all' && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '12px',
                      background: activeCategory === cat.id ? 'white' : '#e2e8f0',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      color: safeTheme.muted
                    }}>
                      {articles.filter(a => a.category === cat.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div style={{ padding: '0 16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 12px 0', padding: '0 8px' }}>Popular Tags</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  style={{
                    padding: '6px 12px',
                    background: 'white',
                    border: `1px solid ${safeTheme.border}`,
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: safeTheme.muted,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div style={{ padding: '24px 16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 12px 0', padding: '0 8px' }}>Recently Viewed</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentlyViewed.slice(0, 5).map(articleId => {
                  const article = articles.find(a => a.id === articleId);
                  if (!article) return null;
                  return (
                    <button
                      key={articleId}
                      onClick={() => handleArticleClick(article)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '13px',
                        color: safeTheme.text,
                        transition: 'all 0.2s'
                      }}
                    >
                      <Clock size={14} color={safeTheme.muted} />
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {article.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Articles Grid/List */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {selectedArticle ? (
            // Article Detail View
            <div>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: safeTheme.primary,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '24px',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }}
              >
                <ChevronLeft size={18} />
                Back to articles
              </button>

              <div style={{
                background: 'white',
                borderRadius: '20px',
                border: `1px solid ${safeTheme.border}`,
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}>
                {/* Article Header */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: `${getCategoryColor(selectedArticle.category)}15`,
                      color: getCategoryColor(selectedArticle.category),
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {getCategoryIcon(selectedArticle.category)}
                      {categories.find(c => c.id === selectedArticle.category)?.name || selectedArticle.category}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      background: selectedArticle.difficulty === 'beginner' ? '#10b98115' :
                                   selectedArticle.difficulty === 'intermediate' ? '#f59e0b15' : '#ef444415',
                      color: selectedArticle.difficulty === 'beginner' ? '#10b981' :
                             selectedArticle.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {selectedArticle.difficulty}
                    </span>
                    {selectedArticle.contentType === 'video' && (
                      <span style={{
                        padding: '4px 12px',
                        background: '#f9731615',
                        color: '#f97316',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Video size={12} />
                        Video
                      </span>
                    )}
                  </div>

                  <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 16px 0' }}>
                    {selectedArticle.title}
                  </h1>

                  <p style={{ fontSize: '16px', color: safeTheme.muted, marginBottom: '24px', lineHeight: 1.6 }}>
                    {selectedArticle.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    borderTop: `1px solid ${safeTheme.border}`,
                    borderBottom: `1px solid ${safeTheme.border}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedArticle.author)}&background=6366f1&color=fff&size=64`}
                          style={{ width: '40px', height: '40px', borderRadius: '12px' }}
                          alt={selectedArticle.author}
                        />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedArticle.author}</div>
                          <div style={{ fontSize: '12px', color: safeTheme.muted }}>Updated {new Date(selectedArticle.lastUpdated).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={14} color={safeTheme.muted} />
                          <span style={{ fontSize: '12px', color: safeTheme.muted }}>{formatNumber(selectedArticle.views)} views</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} color={safeTheme.muted} />
                          <span style={{ fontSize: '12px', color: safeTheme.muted }}>{selectedArticle.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => toggleBookmark(selectedArticle.id)}
                        style={{
                          padding: '10px',
                          background: bookmarkedArticles.includes(selectedArticle.id) ? '#f59e0b15' : 'white',
                          border: `1px solid ${safeTheme.border}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          color: bookmarkedArticles.includes(selectedArticle.id) ? '#f59e0b' : safeTheme.muted,
                          transition: 'all 0.2s'
                        }}
                      >
                        <Bookmark size={18} fill={bookmarkedArticles.includes(selectedArticle.id) ? '#f59e0b' : 'none'} />
                      </button>
                      <button
                        onClick={() => copyArticleLink(selectedArticle.id)}
                        style={{
                          padding: '10px',
                          background: 'white',
                          border: `1px solid ${safeTheme.border}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          color: safeTheme.muted,
                          transition: 'all 0.2s'
                        }}
                      >
                        <Copy size={18} />
                      </button>
                      {selectedArticle.video && (
                        <button
                          onClick={() => window.open(selectedArticle.video, '_blank')}
                          style={{
                            padding: '10px 20px',
                            background: safeTheme.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <ExternalLink size={16} />
                          Open Video
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div 
                  className="article-content"
                  style={{
                    lineHeight: 1.8,
                    fontSize: '16px',
                    color: safeTheme.text
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />

                {/* Tags */}
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${safeTheme.border}` }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Related Tags</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedArticle.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag);
                          setSelectedArticle(null);
                        }}
                        style={{
                          padding: '6px 16px',
                          background: '#f1f5f9',
                          border: 'none',
                          borderRadius: '20px',
                          fontSize: '13px',
                          color: safeTheme.muted,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Section */}
                <div style={{
                  marginTop: '32px',
                  padding: '24px',
                  background: '#f8fafc',
                  borderRadius: '16px',
                  border: `1px solid ${safeTheme.border}`,
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Was this article helpful?</h4>
                  <p style={{ fontSize: '14px', color: safeTheme.muted, marginBottom: '16px' }}>
                    {selectedArticle.likes} people found this helpful
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                      onClick={() => markHelpful(selectedArticle.id, true)}
                      style={{
                        padding: '12px 32px',
                        background: helpfulFeedback[selectedArticle.id] === true ? '#10b981' : 'white',
                        color: helpfulFeedback[selectedArticle.id] === true ? 'white' : safeTheme.text,
                        border: `1px solid ${helpfulFeedback[selectedArticle.id] === true ? '#10b981' : safeTheme.border}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <ThumbsUp size={16} />
                      Yes
                    </button>
                    <button
                      onClick={() => markHelpful(selectedArticle.id, false)}
                      style={{
                        padding: '12px 32px',
                        background: helpfulFeedback[selectedArticle.id] === false ? '#ef4444' : 'white',
                        color: helpfulFeedback[selectedArticle.id] === false ? 'white' : safeTheme.text,
                        border: `1px solid ${helpfulFeedback[selectedArticle.id] === false ? '#ef4444' : safeTheme.border}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <ThumbsDown size={16} />
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Articles List View
            <div>
              {/* Featured Articles */}
              {activeCategory === 'all' && !searchQuery && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={20} color={safeTheme.primary} />
                    Featured Articles
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {featuredArticles.map(article => (
                      <div
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        style={{
                          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                          borderRadius: '16px',
                          padding: '20px',
                          border: `1px solid ${safeTheme.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: `${getCategoryColor(article.category)}15`,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: getCategoryColor(article.category),
                          marginBottom: '16px'
                        }}>
                          {getCategoryIcon(article.category)}
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0' }}>{article.title}</h4>
                        <p style={{ fontSize: '13px', color: safeTheme.muted, marginBottom: '16px' }}>{article.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: safeTheme.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={12} /> {formatNumber(article.views)}
                          </span>
                          <span style={{ fontSize: '11px', color: safeTheme.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {article.readTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Articles */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
                    {searchQuery ? `Search Results for "${searchQuery}"` : 
                     activeCategory === 'all' ? 'All Articles' : 
                     categories.find(c => c.id === activeCategory)?.name || 'Articles'}
                    <span style={{
                      marginLeft: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: safeTheme.muted
                    }}>
                      ({filteredArticles.length} articles)
                    </span>
                  </h3>
                </div>

                {filteredArticles.length === 0 ? (
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '60px 32px',
                    textAlign: 'center',
                    border: `1px solid ${safeTheme.border}`
                  }}>
                    <BookOpen size={48} color={safeTheme.muted} style={{ opacity: 0.5, marginBottom: '16px' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No articles found</h4>
                    <p style={{ color: safeTheme.muted, marginBottom: '20px' }}>
                      Try adjusting your search or browse different categories
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                      style={{
                        background: safeTheme.primary,
                        color: 'white',
                        border: 'none',
                        padding: '10px 24px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      View All Articles
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr',
                    gap: viewMode === 'grid' ? '20px' : '12px'
                  }}>
                    {filteredArticles.map(article => (
                      <div
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: viewMode === 'grid' ? '20px' : '16px',
                          border: `1px solid ${safeTheme.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: viewMode === 'grid' ? 'block' : 'flex',
                          gap: viewMode === 'grid' ? '0' : '16px',
                          alignItems: viewMode === 'grid' ? 'flex-start' : 'center'
                        }}
                      >
                        {viewMode === 'list' && (
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: `${getCategoryColor(article.category)}15`,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getCategoryColor(article.category),
                            flexShrink: 0
                          }}>
                            {getCategoryIcon(article.category)}
                          </div>
                        )}
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            marginBottom: viewMode === 'grid' ? '12px' : '8px'
                          }}>
                            <h4 style={{ 
                              fontSize: viewMode === 'grid' ? '16px' : '15px', 
                              fontWeight: '700', 
                              margin: 0,
                              flex: 1
                            }}>
                              {article.title}
                            </h4>
                            {bookmarkedArticles.includes(article.id) && (
                              <Bookmark size={14} color="#f59e0b" fill="#f59e0b" style={{ marginLeft: '8px', flexShrink: 0 }} />
                            )}
                          </div>
                          
                          {viewMode === 'grid' && (
                            <p style={{ fontSize: '13px', color: safeTheme.muted, marginBottom: '16px' }}>
                              {article.description}
                            </p>
                          )}
                          
                          <div style={{ 
                            display: 'flex', 
                            gap: viewMode === 'grid' ? '12px' : '16px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ fontSize: '11px', color: safeTheme.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Eye size={12} /> {formatNumber(article.views)}
                            </span>
                            <span style={{ fontSize: '11px', color: safeTheme.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> {article.readTime}
                            </span>
                            {viewMode === 'list' && (
                              <>
                                <span style={{ fontSize: '11px', color: safeTheme.muted }}>
                                  • Updated {new Date(article.lastUpdated).toLocaleDateString()}
                                </span>
                                <span style={{
                                  fontSize: '10px',
                                  padding: '2px 8px',
                                  background: article.difficulty === 'beginner' ? '#10b98115' :
                                             article.difficulty === 'intermediate' ? '#f59e0b15' : '#ef444415',
                                  color: article.difficulty === 'beginner' ? '#10b981' :
                                         article.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444',
                                  borderRadius: '10px',
                                  textTransform: 'capitalize'
                                }}>
                                  {article.difficulty}
                                </span>
                              </>
                            )}
                          </div>
                          
                          {viewMode === 'grid' && (
                            <div style={{ 
                              marginTop: '16px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span style={{
                                fontSize: '10px',
                                padding: '2px 8px',
                                background: article.difficulty === 'beginner' ? '#10b98115' :
                                           article.difficulty === 'intermediate' ? '#f59e0b15' : '#ef444415',
                                color: article.difficulty === 'beginner' ? '#10b981' :
                                       article.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444',
                                borderRadius: '10px',
                                textTransform: 'capitalize'
                              }}>
                                {article.difficulty}
                              </span>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <ThumbsUp size={12} color={safeTheme.muted} />
                                <span style={{ fontSize: '11px', color: safeTheme.muted }}>{article.likes}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS styles for article content */}
      <style>{`
        .article-content h2 {
          font-size: 24px;
          font-weight: 800;
          margin: 32px 0 16px 0;
        }
        
        .article-content h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 24px 0 12px 0;
        }
        
        .article-content h4 {
          font-size: 18px;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }
        
        .article-content p {
          margin-bottom: 16px;
          line-height: 1.8;
        }
        
        .article-content ul, .article-content ol {
          margin: 16px 0;
          padding-left: 24px;
        }
        
        .article-content li {
          margin-bottom: 8px;
        }
        
        .article-content pre {
          background: #0f172a;
          color: #4ade80;
          padding: 16px;
          border-radius: 12px;
          overflow-x: auto;
          font-size: 14px;
          margin: 16px 0;
        }
        
        .article-content code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
          color: #ef4444;
        }
        
        .article-content .tip-box {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          color: #166534;
        }
        
        .article-content .warning-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          color: #991b1b;
        }
        
        .article-content .video-placeholder {
          margin: 24px 0;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeBase;