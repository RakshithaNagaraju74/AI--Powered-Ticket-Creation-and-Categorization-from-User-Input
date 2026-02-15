import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  Terminal, Key, Cpu, ArrowRight, Lock, 
  Code, GitBranch, Star, Zap, Shield,
  ChevronRight, Clock, Users, Server,
  Monitor, Github, Command, TerminalSquare,
  HardDrive, Wifi, Globe, Fingerprint
} from 'lucide-react';

const DevAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isHovering, setIsHovering] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [logs, setLogs] = useState([
    { text: "> System.init(): Developer console v2.4.1", time: "00:00:00", type: "info" },
    { text: "> BERT_CORE_v2.4 handshake successful", time: "00:00:01", type: "success" },
    { text: "> Waiting for technician credentials...", time: "00:00:02", type: "waiting" }
  ]);

  // Add log animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = {
          text: `> Heartbeat: ${new Date().toLocaleTimeString()}`,
          time: new Date().toLocaleTimeString(),
          type: "info"
        };
        return [newLog, ...prev].slice(0, 8);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Add login attempt log
    setLogs(prev => [{
      text: `> Auth attempt: ${formData.email}`,
      time: new Date().toLocaleTimeString(),
      type: "info"
    }, ...prev].slice(0, 8));

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (res.data.user.role !== 'agent') {
        const errorMsg = "> [AUTH_ERROR]: ACCESS_DENIED. Technical credentials required.";
        setError(errorMsg);
        setLogs(prev => [{
          text: errorMsg,
          time: new Date().toLocaleTimeString(),
          type: "error"
        }, ...prev].slice(0, 8));
        return;
      }

      // Success log
      setLogs(prev => [{
        text: `> ✅ Authentication successful for ${res.data.user.name}`,
        time: new Date().toLocaleTimeString(),
        type: "success"
      }, ...prev].slice(0, 8));

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Smooth transition
      setTimeout(() => {
        navigate('/dev-dashboard');
      }, 500);

    } catch (err) {
      const errorMsg = `> [AUTH_ERROR]: ${err.response?.data?.msg || "INVALID_CREDENTIALS"}`;
      setError(errorMsg);
      setLogs(prev => [{
        text: errorMsg,
        time: new Date().toLocaleTimeString(),
        type: "error"
      }, ...prev].slice(0, 8));
    }
  };

  const dvStyles = {
    wrapper: { 
      minHeight: '100vh', 
      background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Plus Jakarta Sans', monospace",
      position: 'relative',
      overflow: 'hidden'
    },

    // Grid Background Pattern
    gridPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      zIndex: 1
    },

    // Floating Orbs
    orb1: {
      position: 'absolute',
      top: '-100px',
      right: '-100px',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      zIndex: 1
    },

    orb2: {
      position: 'absolute',
      bottom: '-100px',
      left: '-100px',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      zIndex: 1
    },

    card: { 
      width: '1000px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '32px', 
      border: '1px solid rgba(226, 232, 240, 0.8)',
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative', 
      zIndex: 10,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
    },

    topBar: { 
      padding: '16px 24px', 
      borderBottom: '1px solid #e2e8f0', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: 'rgba(248, 250, 252, 0.8)',
      backdropFilter: 'blur(5px)'
    },

    brand: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      color: '#0f172a',
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: '0.5px'
    },

    brandIcon: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      padding: '8px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(59,130,246,0.2)'
    },

    status: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      padding: '6px 14px',
      background: '#f0fdf4',
      borderRadius: '30px',
      border: '1px solid #86efac',
      color: '#16a34a',
      fontSize: '12px',
      fontWeight: '700'
    },

    pulse: { 
      width: '8px', 
      height: '8px', 
      background: '#10b981', 
      borderRadius: '50%', 
      boxShadow: '0 0 10px #10b981',
      animation: 'pulse 2s infinite'
    },

    content: { 
      display: 'flex', 
      padding: '48px',
      gap: '48px'
    },

    left: { 
      flex: 1.2,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },

    right: { 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },

    title: { 
      color: '#0f172a', 
      fontSize: '36px', 
      fontWeight: '800', 
      margin: 0,
      letterSpacing: '-1px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },

    titleBadge: {
      background: '#e2e8f0',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#475569',
      letterSpacing: 'normal'
    },

    sub: { 
      color: '#64748b', 
      fontSize: '14px', 
      lineHeight: 1.6,
      margin: 0,
      borderLeft: '3px solid #3b82f6',
      paddingLeft: '16px',
      background: 'linear-gradient(90deg, #f8fafc, transparent)'
    },

    field: { 
      marginBottom: '20px' 
    },

    label: { 
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#334155', 
      fontSize: '11px', 
      fontWeight: '700', 
      letterSpacing: '0.5px', 
      marginBottom: '8px',
      textTransform: 'uppercase'
    },

    inputRow: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      background: activeField ? '#ffffff' : '#f8fafc',
      padding: '14px 18px', 
      borderRadius: '14px', 
      border: activeField ? '2px solid #3b82f6' : '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      boxShadow: activeField ? '0 4px 12px rgba(59,130,246,0.1)' : 'none'
    },

    inputIcon: {
      color: activeField ? '#3b82f6' : '#94a3b8',
      transition: 'color 0.2s ease'
    },

    input: { 
      background: 'none', 
      border: 'none', 
      outline: 'none', 
      color: '#0f172a', 
      width: '100%', 
      fontSize: '14px',
      fontFamily: "'Fira Code', monospace",
      '::placeholder': {
        color: '#94a3b8'
      }
    },

    loginBtn: { 
      width: '100%', 
      background: isHovering ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: '#fff', 
      padding: '16px', 
      borderRadius: '16px', 
      fontWeight: '700', 
      border: 'none', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '10px',
      transition: 'all 0.3s ease',
      transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: isHovering ? '0 12px 25px -8px rgba(59,130,246,0.5)' : '0 8px 20px -5px rgba(59,130,246,0.4)',
      fontSize: '15px'
    },

    logBox: { 
      background: '#ffffff',
      borderRadius: '20px', 
      border: '1px solid #e2e8f0',
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '0 8px 20px rgba(0,0,0,0.02)'
    },

    logHeader: { 
      background: '#f8fafc',
      padding: '14px 20px', 
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#334155', 
      fontSize: '11px', 
      fontWeight: '700',
      letterSpacing: '0.5px'
    },

    logHeaderDots: {
      display: 'flex',
      gap: '6px',
      marginRight: '12px'
    },

    dot: (color) => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: color,
      border: '1px solid rgba(0,0,0,0.05)'
    }),

    logBody: { 
      padding: '20px', 
      color: '#0f172a', 
      fontFamily: "'Fira Code', monospace", 
      fontSize: '12px',
      background: '#fcfcfd',
      minHeight: '200px',
      maxHeight: '250px',
      overflowY: 'auto'
    },

    logEntry: (type) => ({
      margin: '0 0 8px 0',
      padding: '4px 0',
      borderBottom: '1px solid #f1f5f9',
      color: type === 'error' ? '#dc2626' : 
             type === 'success' ? '#16a34a' : 
             type === 'waiting' ? '#d97706' : '#334155',
      display: 'flex',
      gap: '12px',
      fontFamily: "'Fira Code', monospace",
      fontSize: '11px'
    }),

    logTime: {
      color: '#94a3b8',
      minWidth: '60px'
    },

    securityMeta: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      color: '#64748b', 
      fontSize: '11px', 
      fontWeight: '600',
      justifyContent: 'center',
      padding: '12px',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },

    errorText: { 
      color: '#dc2626', 
      fontSize: '11px', 
      fontFamily: 'monospace', 
      margin: '8px 0',
      padding: '8px 12px',
      background: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    divider: {
      width: '1px',
      height: '20px',
      background: '#e2e8f0',
      margin: '0 16px'
    },

    quickTip: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      fontSize: '11px',
      color: '#475569'
    }
  };

  return (
    <div style={dvStyles.wrapper}>
      {/* Grid Background */}
      <div style={dvStyles.gridPattern} />
      
      {/* Floating Orbs */}
      <div style={dvStyles.orb1} />
      <div style={dvStyles.orb2} />

      {/* Main Card */}
      <div style={dvStyles.card}>
        {/* Top Bar */}
        <div style={dvStyles.topBar}>
          <div style={dvStyles.brand}>
            <div style={dvStyles.brandIcon}>
              <Terminal size={16} color="white" />
            </div>
            <span>DEV_CONSOLE // TIER_4</span>
            <span style={dvStyles.divider} />
            <GitBranch size={14} color="#64748b" />
            <span style={{ color: '#64748b', fontWeight: '500' }}>main</span>
          </div>
          
          <div style={dvStyles.status}>
            <div style={dvStyles.pulse} />
            <span>PRODUCTION</span>
            <span style={dvStyles.divider} />
            <Shield size={12} />
            <span>SECURE</span>
          </div>
        </div>

        {/* Main Content */}
        <div style={dvStyles.content}>
          {/* Left Column - Login Form */}
          <div style={dvStyles.left}>
            <div>
              <h2 style={dvStyles.title}>
                <Code size={32} color="#3b82f6" />
                Developer Access
                <span style={dvStyles.titleBadge}>v2.4.1</span>
              </h2>
              <p style={dvStyles.sub}>
                Initialize secure session to monitor BERT model telemetry, 
                analyze ML accuracy (86%), and manage manual triage overrides.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div style={dvStyles.errorText}>
                <Terminal size={14} />
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} autoComplete="off">
              <div style={dvStyles.field}>
                <div style={dvStyles.label}>
                  <Fingerprint size={14} color="#3b82f6" />
                  STAFF_IDENTIFIER (EMAIL)
                </div>
                <div style={dvStyles.inputRow}>
                  <Terminal size={18} style={dvStyles.inputIcon} />
                  <input 
                    name="email" 
                    style={dvStyles.input} 
                    type="email" 
                    placeholder="developer@nexus.ai" 
                    value={formData.email} 
                    onChange={handleChange}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField('')}
                    autoComplete="off"
                    required 
                  />
                </div>
              </div>

              <div style={dvStyles.field}>
                <div style={dvStyles.label}>
                  <Key size={14} color="#3b82f6" />
                  SECURITY_PASSKEY
                </div>
                <div style={dvStyles.inputRow}>
                  <Lock size={18} style={dvStyles.inputIcon} />
                  <input 
                    name="password" 
                    style={dvStyles.input} 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={handleChange}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField('')}
                    autoComplete="off"
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={dvStyles.loginBtn}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Terminal size={16} />
                START_SESSION
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Tips */}
            <div style={dvStyles.quickTip}>
              <Command size={14} color="#64748b" />
              <span>
                <strong>Quick tip:</strong> Use Ctrl/Cmd + K to open command palette
              </span>
            </div>
          </div>

          {/* Right Column - Console */}
          <div style={dvStyles.right}>
            {/* Console Log */}
            <div style={dvStyles.logBox}>
              <div style={dvStyles.logHeader}>
                <div style={dvStyles.logHeaderDots}>
                  <div style={dvStyles.dot('#ef4444')} />
                  <div style={dvStyles.dot('#f59e0b')} />
                  <div style={dvStyles.dot('#10b981')} />
                </div>
                <Terminal size={14} />
                <span>CONSOLE_TELEMETRY</span>
                <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>
                  <Clock size={12} />
                </span>
              </div>
              <div style={dvStyles.logBody}>
                {logs.map((log, i) => (
                  <div key={i} style={dvStyles.logEntry(log.type)}>
                    <span style={dvStyles.logTime}>[{log.time}]</span>
                    <span>{log.text}</span>
                  </div>
                ))}
                <div style={{ 
                  ...dvStyles.logEntry('cursor'),
                  borderBottom: 'none',
                  color: '#3b82f6',
                  marginTop: '8px'
                }}>
                  <span style={dvStyles.logTime}>[{new Date().toLocaleTimeString()}]</span>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span>$</span>
                    <span style={{ 
                      width: '8px', 
                      height: '16px', 
                      background: '#3b82f6', 
                      marginLeft: '4px',
                      animation: 'blink 1s infinite'
                    }} />
                  </span>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div style={dvStyles.securityMeta}>
              <Server size={14} />
              <span>API: {API_BASE_URL}</span>
              <div style={dvStyles.divider} />
              <Wifi size={14} color="#10b981" />
              <span>ONLINE</span>
              <div style={dvStyles.divider} />
              <Lock size={14} />
              <span>AES-256</span>
            </div>

            {/* Quick Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              {[
                { icon: <Cpu size={12} />, label: 'ML Acc', value: '86%' },
                { icon: <Users size={12} />, label: 'Agents', value: '20+' },
                { icon: <Globe size={12} />, label: 'Uptime', value: '99.9%' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#3b82f6', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{stat.value}</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '10px',
          color: '#64748b',
          fontWeight: '600'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>© 2026 NexusAI • Developer Console</span>
            <span>BERT Core v2.4.1</span>
            <span>20+ Active Agents</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>DOCS</span>
            <span>STATUS</span>
            <span>SUPPORT</span>
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        input::placeholder {
          color: #94a3b8;
          font-family: 'Fira Code', monospace;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default DevAuth;