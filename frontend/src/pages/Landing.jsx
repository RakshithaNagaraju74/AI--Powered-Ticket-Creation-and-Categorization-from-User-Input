import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Zap, Shield, Terminal, ArrowRight, Brain, 
  GitBranch, ShieldCheck, LineChart, Server, Users, 
  BarChart3, Rocket, Activity, Filter, ShieldAlert, 
  Target, Clock, Database, CheckCircle, Sparkles,
  Github, Star, GitFork, Eye
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [demoText, setDemoText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [confidence, setConfidence] = useState("");
  const [activeDemo, setActiveDemo] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const demoExamples = [
    "VPN is failing and I cannot access the cloud drive",
    "Server database connection timeout error",
    "Security alert: multiple failed login attempts detected",
    "Email server is down across all departments",
    "Critical software update required for security patch"
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demoExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDemoInference = () => {
    if (!demoText) {
      setDemoText(demoExamples[activeDemo]);
      return;
    }
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const text = demoText.toLowerCase();
      
      if (text.includes("vpn") || text.includes("cloud")) {
        setCategory("Network Infrastructure");
        setPriority("High");
        setConfidence("98.4%");
      } else if (text.includes("database") || text.includes("connection")) {
        setCategory("Database Systems");
        setPriority("Medium");
        setConfidence("94.7%");
      } else if (text.includes("security") || text.includes("alert")) {
        setCategory("Security Incident");
        setPriority("Critical");
        setConfidence("99.2%");
      } else if (text.includes("email") || text.includes("server")) {
        setCategory("Email Services");
        setPriority("High");
        setConfidence("96.1%");
      } else if (text.includes("update") || text.includes("software")) {
        setCategory("Software Updates");
        setPriority("Medium");
        setConfidence("92.3%");
      } else {
        const categories = ["Network Infrastructure", "Database Systems", "Security Incident"];
        const priorities = ["Low", "Medium", "High", "Critical"];
        const confidences = ["92.3%", "94.7%", "98.4%"];
        setCategory(categories[Math.floor(Math.random() * categories.length)]);
        setPriority(priorities[Math.floor(Math.random() * priorities.length)]);
        setConfidence(confidences[Math.floor(Math.random() * confidences.length)]);
      }
      
      setIsAnalyzing(false);
    }, 1500);
  };

  const stats = [
    { value: "98.4%", label: "Accuracy", icon: <Brain size={20} /> },
    { value: "<400ms", label: "Response Time", icon: <Clock size={20} /> },
    { value: "1.2M+", label: "Samples", icon: <Database size={20} /> },
    { value: "99.9%", label: "Uptime", icon: <ShieldCheck size={20} /> }
  ];

  const features = [
    {
      icon: <Brain size={28} />,
      title: "Dual-Head Transformer",
      description: "Parallel processing for semantic categorization and priority detection",
      color: "#8b5cf6"
    },
    {
      icon: <GitBranch size={28} />,
      title: "Real-time Processing",
      description: "Handle 50k+ concurrent requests with minimal latency",
      color: "#10b981"
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Enterprise Security",
      description: "GDPR compliant with end-to-end encryption",
      color: "#f59e0b"
    },
    
  ];

  const glowEffect = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '600px',
    height: '600px',
    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(99, 102, 241, 0.08) 0%, 
                rgba(99, 102, 241, 0.03) 30%, 
                transparent 70%)`,
    zIndex: 0,
    transition: 'background 0.1s'
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#0f172a',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Glow Effect */}
      <div style={glowEffect} />

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(226, 232, 240, 0.5)' : 'none',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
          }}>
            <Cpu size={24} color="#ffffff" />
          </div>
          <span style={{
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0f172a, #475569)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Nexus<span style={{ color: '#6366f1' }}>AI</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => navigate('/dev-auth')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '8px 16px',
              borderRadius: '8px',
              ':hover': { 
                color: '#0f172a',
                background: 'rgba(99, 102, 241, 0.05)'
              }
            }}
          >
            Console
          </button>
          <button 
            onClick={() => navigate('/auth')}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              ':before': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: '0.5s'
              },
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                ':before': {
                  left: '100%'
                }
              }
            }}
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '180px 5% 100px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
            zIndex: -1
          }} />
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6366f1',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span>Enterprise Grade • Now Live</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3.5rem, 6vw, 5rem)',
            fontWeight: '900',
            lineHeight: '1.1',
            letterSpacing: '-2px',
            margin: '0 0 24px 0',
            background: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Intelligent Support
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              ':after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '10%',
                width: '80%',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
                borderRadius: '2px'
              }
            }}>
              Powered by AI
            </span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            lineHeight: '1.6',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px',
            position: 'relative'
          }}>
            Transform your helpdesk with our BERT-powered architecture that intelligently categorizes, 
            prioritizes, and routes support tickets in real-time.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => navigate('/auth')}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#ffffff',
                padding: '18px 40px',
                borderRadius: '14px',
                fontWeight: '700',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                ':before': {
                  content: '""',
                  position: 'absolute',
                  top: '0',
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: '0.5s'
                },
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                  ':before': {
                    left: '100%'
                  }
                }
              }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/dev-auth')}
              style={{
                background: 'none',
                color: '#0f172a',
                padding: '18px 40px',
                borderRadius: '14px',
                fontWeight: '700',
                border: '2px solid #e2e8f0',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden',
                ':before': {
                  content: '""',
                  position: 'absolute',
                  top: '0',
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent)',
                  transition: '0.5s'
                },
                ':hover': {
                  background: '#f8fafc',
                  borderColor: '#cbd5e1',
                  transform: 'translateY(-2px)',
                  ':before': {
                    left: '100%'
                  }
                }
              }}
            >
              Developer Console
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '80px 5%',
        background: '#f8fafc',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              style={{
                background: '#ffffff',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid #f1f5f9',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                ':before': {
                  content: '""',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                },
                ':hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#e2e8f0',
                  ':before': {
                    transform: 'scaleX(1)'
                  }
                }
              }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '14px',
                marginBottom: '20px',
                color: '#6366f1',
                transition: 'all 0.3s'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#0f172a',
                marginBottom: '8px',
                transition: 'all 0.3s'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo Section */}
      <section style={{
        padding: '100px 5%',
        background: '#ffffff',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '900',
              letterSpacing: '-1.5px',
              marginBottom: '16px',
              position: 'relative',
              display: 'inline-block',
              ':after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '25%',
                width: '50%',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
                borderRadius: '2px'
              }
            }}>
              See AI in Action
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '40px auto 0',
              lineHeight: '1.6'
            }}>
              Experience real-time classification of support tickets with our BERT-powered engine
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
            borderRadius: '28px',
            padding: '40px',
            boxShadow: '0 40px 80px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            ':before': {
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)'
            }
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
              color: '#94a3b8'
            }}>
              <Terminal size={20} />
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '1px'
              }}>
                CLASSIFICATION PIPELINE
              </span>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <input
                  type="text"
                  placeholder={demoExamples[activeDemo]}
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(10px)',
                    ':focus': {
                      borderColor: 'rgba(99, 102, 241, 0.8)',
                      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
                    }
                  }}
                />
                <button
                  onClick={handleDemoInference}
                  disabled={isAnalyzing}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#ffffff',
                    padding: '0 36px',
                    borderRadius: '16px',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    opacity: isAnalyzing ? 0.8 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    ':before': {
                      content: '""',
                      position: 'absolute',
                      top: '0',
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: '0.5s'
                    },
                    ':hover': {
                      transform: isAnalyzing ? 'none' : 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                      ':before': {
                        left: '100%'
                      }
                    }
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Activity size={20} className="spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain size={20} />
                      Analyze
                    </>
                  )}
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {demoExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setDemoText(example)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(10px)',
                      ':hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        borderColor: 'rgba(99, 102, 241, 0.5)'
                      }
                    }}
                  >
                    {example.substring(0, 25)}...
                  </button>
                ))}
              </div>
            </div>

            {(demoText || isAnalyzing) && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '24px'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                      color: '#94a3b8',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      <Filter size={16} />
                      Category
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#ffffff',
                      background: isAnalyzing ? 'linear-gradient(90deg, #64748b, #94a3b8)' : 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      width: 'fit-content'
                    }}>
                      {isAnalyzing ? 'Analyzing...' : category || 'Not classified'}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                      color: '#94a3b8',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      <ShieldAlert size={16} />
                      Priority
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: priority === 'Critical' ? '#ef4444' : 
                             priority === 'High' ? '#f59e0b' : 
                             priority === 'Medium' ? '#3b82f6' : '#10b981'
                    }}>
                      {isAnalyzing ? '...' : priority || 'Not determined'}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                      color: '#94a3b8',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      <Target size={16} />
                      Confidence
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#10b981'
                    }}>
                      {isAnalyzing ? 'Calculating...' : confidence || '0%'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '100px 5%',
        background: '#f8fafc',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '900',
              letterSpacing: '-1.5px',
              marginBottom: '16px',
              position: 'relative',
              display: 'inline-block',
              ':after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '25%',
                width: '50%',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
                borderRadius: '2px'
              }
            }}>
              Why Choose NexusAI?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '40px auto 0',
              lineHeight: '1.6'
            }}>
              Built with enterprise-grade technology and security standards
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  padding: '40px',
                  borderRadius: '24px',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  ':before': {
                    content: '""',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '4px',
                    background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  },
                  ':hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.1)',
                    borderColor: '#e2e8f0',
                    ':before': {
                      transform: 'scaleX(1)'
                    }
                  }
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `linear-gradient(135deg, ${feature.color}, transparent)`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: feature.color,
                  transition: 'all 0.3s'
                }}>
                  {feature.icon}
                </div>
                
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#0f172a'
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  color: '#64748b',
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '120px 5%',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        ':before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
          zIndex: -1
        }
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '900',
            letterSpacing: '-1.5px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ready to Transform Your Support?
          </h2>
          
          <p style={{
            fontSize: '1.125rem',
            color: '#94a3b8',
            marginBottom: '48px',
            lineHeight: '1.6'
          }}>
            Join hundreds of enterprises using NexusAI to streamline their support operations 
            and deliver exceptional service.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/auth')}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#ffffff',
                padding: '18px 40px',
                borderRadius: '14px',
                fontWeight: '700',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                ':before': {
                  content: '""',
                  position: 'absolute',
                  top: '0',
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: '0.5s'
                },
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                  ':before': {
                    left: '100%'
                  }
                }
              }}
            >
              Start Free Trial
              <Rocket size={20} />
            </button>
          </div>
        </div>
      </section>

      

      {/* Simplified Footer */}
      <footer style={{
        padding: '60px 5% 40px',
        background: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
              }}>
                <Cpu size={24} color="#ffffff" />
              </div>
              <span style={{
                fontSize: '24px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #0f172a, #475569)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Nexus<span style={{ color: '#6366f1' }}>AI</span>
              </span>
            </div>
            
            <p style={{
              color: '#64748b',
              fontSize: '16px',
              maxWidth: '500px',
              lineHeight: '1.6'
            }}>
              Enterprise-grade AI-powered support intelligence platform. 
              Transforming helpdesk operations with cutting-edge technology.
            </p>
          </div>
          
          <div style={{
            paddingTop: '40px',
            borderTop: '1px solid #f1f5f9',
            color: '#94a3b8',
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div>
              © 2024 NexusAI. All rights reserved.
            </div>
            <div style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                padding: '8px 16px',
                background: 'rgba(99, 102, 241, 0.05)',
                borderRadius: '20px',
                color: '#6366f1'
              }}>
                
              </span>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                padding: '8px 16px',
                background: 'rgba(16, 185, 129, 0.05)',
                borderRadius: '20px',
                color: '#10b981'
              }}>
                
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        *:focus {
          outline: none;
        }
        
        button {
          cursor: pointer;
        }
        
        input::placeholder {
          color: #64748b;
        }
        
        /* Hide the pseudo-element styles from React */
        *[style*=":before"], *[style*=":after"], *[style*=":hover"] {
          all: unset;
        }
      `}</style>
    </div>
  );
};

export default Landing;