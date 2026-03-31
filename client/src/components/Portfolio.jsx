import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Portfolio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setContactStatus('Sending...');
    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: contactName, email: contactEmail, subject: contactSubject, message: contactMessage })
        });
        if (res.ok) {
            setContactStatus('✅ Message sent successfully! I will get back to you soon.');
            setContactName(''); setContactEmail(''); setContactSubject(''); setContactMessage('');
        } else {
            setContactStatus('❌ Failed to send message. Please try again.');
        }
    } catch (err) {
        setContactStatus('❌ Network error. Please try again.');
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchPortfolio = () => {
      fetch('/api/portfolio')
        .then(res => res.json())
        .then(portfolioData => {
          setData(portfolioData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching data:', err);
          setLoading(false);
        });
    };

    const hasVisited = localStorage.getItem('portfolioVisited');
    if (!hasVisited) {
      fetch('/api/visit', { method: 'POST' })
        .then(() => {
          localStorage.setItem('portfolioVisited', 'true');
          fetchPortfolio();
        })
        .catch(err => {
          console.error('Error logging visit:', err);
          fetchPortfolio();
        });
    } else {
      fetchPortfolio();
    }
  }, []);

  if (loading) {
    return <div className="app-container" style={{ textAlign: 'center', marginTop: '20vh' }}>Loading Portfolio...</div>;
  }

  if (!data || !data.profile) {
    return <div className="app-container" style={{ textAlign: 'center', marginTop: '20vh' }}>Failed to load portfolio data. Make sure backend is running and seeded.</div>;
  }

  const avatarUrl = data.profile.photoUrl || "https://ui-avatars.com/api/?name=Gadige+Uday+Kumar&background=3b82f6&color=fff&size=200";
  const zoomLevel = data.profile.photoSize ? data.profile.photoSize / 100 : 1;

  const showSection = (sectionName) => activeTab === 'Home' || activeTab === sectionName;
  const tabs = ['Home', 'Education', 'Skills', 'Projects', 'Certifications', 'Achievements', 'Contact'];

  return (
    <div className="portfolio-layout">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Side Navigation Bar */}
      <nav className={`side-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 10px 30px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', margin: '0', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '1px', fontWeight: '800' }}>Portfolio.</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>{data.profile.name}</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {tabs.map(tab => (
                <button 
                  key={tab} 
                  onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
                  className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
            ))}
        </div>

        <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <Link to="/admin" className="nav-item" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--card-bg)', color: 'var(--text-muted)', textDecoration: 'none'}}>⚙️ Admin Login</Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="portfolio-content" onClick={() => { if(isMobileMenuOpen) setIsMobileMenuOpen(false); }}>
        <div key={activeTab} className="app-container page-transition" style={{ margin: '0 auto', maxWidth: '900px', padding: '0 20px' }}>
          
          {/* Hero Section */}
          {activeTab === 'Home' && (
            <>
            <header className="hero-split page-transition" style={{ marginBottom: '60px', position: 'relative' }}>
                {/* Radiant Background Blobs */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'var(--accent-secondary)', opacity: '0.15', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', background: 'var(--accent-primary)', opacity: '0.15', filter: 'blur(80px)', borderRadius: '50%', zIndex: -1 }}></div>

                <div style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '60px', background: 'var(--panel-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '50px 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    
                    {/* Left Typography Block */}
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '10px', fontWeight: '600' }}>Hello, I'm</h2>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '15px', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{data.profile.name}</h1>
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', marginBottom: '25px', fontWeight: '500' }}>{data.profile.title}</h3>
                        
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px', maxWidth: '500px' }}>{data.profile.summary}</p>
                        
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '30px' }}>
                            <button onClick={() => setActiveTab('Contact')} className="project-link" style={{ padding: '15px 35px', borderRadius: '12px', fontSize: '16px', background: 'var(--accent-secondary)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)' }}>Say Hello!</button>
                            {data.profile.resumeUrl && (
                                <a href={data.profile.resumeUrl} download target="_blank" rel="noopener noreferrer" className="project-link" style={{ padding: '15px 35px', borderRadius: '12px', fontSize: '16px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                                    📄 Download Resume
                                </a>
                            )}
                        </div>

                        {/* Social Links Bottom Left */}
                        {data.profile.contacts && data.profile.contacts.length > 0 && (
                            <div className="contact-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {data.profile.contacts.map((contact, index) => (
                                    <a key={index} href={contact.link && contact.link !== '#' ? contact.link : undefined} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--icon-bg)', border: '1px solid var(--border-color)' }}>
                                        <span className="icon" style={{marginRight: '6px'}}>{contact.icon}</span> {contact.text}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Portrait Block */}
                    <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ width: '100%', maxWidth: '380px', aspectRatio: '4/5', borderRadius: '24px', overflow: 'hidden', border: '8px solid var(--bg-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', position: 'relative', background: 'var(--card-bg)' }}>
                            <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoomLevel})` }} />
                        </div>
                    </div>
                </div>

                {/* Analytical Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
                     <div className="glass-card" style={{ padding: '30px 20px', textAlign: 'center', borderRadius: '16px', background: 'var(--icon-bg)', border: '1px solid var(--border-color)' }}>
                         <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '5px' }}>{data.projects ? data.projects.length : 0}+</h2>
                         <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects Completed</p>
                     </div>
                     <div className="glass-card" style={{ padding: '30px 20px', textAlign: 'center', borderRadius: '16px', background: 'var(--icon-bg)', border: '1px solid var(--border-color)' }}>
                         <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '5px' }}>{data.skills ? data.skills.length : 0}</h2>
                         <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Technical Skills</p>
                     </div>
                     <div className="glass-card" style={{ padding: '30px 20px', textAlign: 'center', borderRadius: '16px', background: 'var(--icon-bg)', border: '1px solid var(--border-color)' }}>
                         <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '5px' }}>{data.visitors || 0}</h2>
                         <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Profile Views</p>
                     </div>
                </div>
            </header>
            
            {/* Journey Timeline on Home Tab */}
            {data.education && data.education.length > 0 && (
                <div className="glass-card page-transition" style={{ marginTop: '0', padding: '40px 30px', marginBottom: '40px' }}>
                    <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '30px' }}>My Journey</h2>
                    <div style={{ position: 'relative', paddingLeft: '30px' }}>
                        {/* Vertical Path Line */}
                        <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)' }}></div>
                        
                        {data.education.map((edu, index) => (
                            <div key={index} className="timeline-item" style={{ position: 'relative', marginBottom: index === data.education.length - 1 ? '0' : '40px' }}>
                                {/* Glowing Milestone Dot */}
                                <div className="timeline-dot" style={{ position: 'absolute', left: '-31.5px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent-primary)', border: '3px solid var(--bg-color)', boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)', zIndex: 2 }}></div>
                                
                                {/* Card Content */}
                                <div className="timeline-card" style={{ background: 'var(--input-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--icon-bg)', color: 'var(--accent-primary)', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>{edu.year}</span>
                                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.25rem' }}>{edu.degree}</h3>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>{edu.institution}</h4>
                                    {edu.score && <p style={{ color: 'var(--text-primary)', fontSize: '14px', marginTop: '10px', fontWeight: 'bold', background: 'var(--icon-bg)', display: 'inline-block', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--accent-primary)' }}>🏅 Score: {edu.score}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </>
          )}

          {/* Education Section */}
          {showSection('Education') && data.education && data.education.length > 0 && (
            <section className="glass-card" style={{ marginTop: activeTab!=='Home' ? '0' : '40px' }}>
              <h2 className="section-title">Academic Background</h2>
              {data.education.map((edu, index) => (
                <div key={index} className="education-item" style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: 'var(--accent-primary)', marginBottom: '5px' }}>{edu.degree}</h3>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{edu.institution}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{edu.year} {edu.score ? `| ${edu.score}` : ''}</p>
                </div>
              ))}
            </section>
          )}

          {/* Skills Section */}
          {showSection('Skills') && data.skills && data.skills.length > 0 && (
            <section className="glass-card" style={{ marginTop: activeTab!=='Home' ? '0' : '40px' }}>
              <h2 className="section-title">Technical Expertise</h2>
              <div className="skills-grid" style={{ marginBottom: '30px' }}>
                {data.skills.map((skillGroup, index) => {
                  const itemsArray = Array.isArray(skillGroup.items) ? skillGroup.items : (typeof skillGroup.items === 'string' ? skillGroup.items.split(',') : []);
                  return (
                  <div key={index} className="skill-category">
                    <h3 style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>{skillGroup.category}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {itemsArray.map((item, i) => (
                        <span key={i} className="skill-badge" style={{ padding: '6px 12px', background: 'var(--icon-bg)', color: 'var(--accent-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: '500' }}>{typeof item === 'string' ? item.trim() : item}</span>
                      ))}
                    </div>
                  </div>
                )})}
              </div>

              {data.profile.fundamentals && data.profile.fundamentals.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: 'var(--accent-primary)', marginBottom: '15px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Software Engineering Fundamentals / Core</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {data.profile.fundamentals.map((fund, i) => (
                      <span key={i} style={{ padding: '8px 16px', background: 'var(--icon-bg)', color: 'var(--accent-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: '500' }}>{fund}</span>
                    ))}
                  </div>
                </div>
              )}

              {data.profile.devopsHighlights && (
                <div>
                  <h3 style={{ color: 'var(--accent-primary)', marginBottom: '15px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>DevOps & System Design Highlights</h3>
                  <div style={{ background: 'var(--icon-bg)', borderLeft: '4px solid var(--accent-primary)', padding: '15px 20px', borderRadius: '0 8px 8px 0', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: data.profile.devopsHighlights }} />
                </div>
              )}
            </section>
          )}

          {/* Projects Section */}
          {showSection('Projects') && data.projects && data.projects.length > 0 && (
            <section className="glass-card" style={{ marginTop: activeTab!=='Home' ? '0' : '40px' }}>
              <h2 className="section-title">Featured Projects</h2>
              <div className="grid-2">
                {data.projects.map((project, index) => (
                  <div key={index} className="project-card" style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>{project.title}</h3>
                    <p style={{ color: 'var(--accent-secondary)', fontSize: '13px', marginBottom: '12px', fontWeight: 'bold' }}>{project.tech}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>{project.description}</p>
                    {Array.isArray(project.bullets) && project.bullets.length > 0 && (
                      <ul style={{ color: 'var(--text-muted)', fontSize: '13px', paddingLeft: '20px', marginBottom: '15px' }}>
                        {project.bullets.map((bullet, i) => <li key={i} style={{ marginBottom: '4px' }}>{bullet}</li>)}
                      </ul>
                    )}
                    {Array.isArray(project.links) && project.links.length > 0 && (
                      <div style={{ marginTop: 'auto' }}>
                        {project.links.map((link, i) => (
                          <a key={i} href={link} className="project-link" style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--accent-gradient)', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '13px', marginRight: '8px' }}>Live Demo / Source</a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {showSection('Certifications') && data.certificates && data.certificates.length > 0 && (
            <section className="glass-card page-transition" style={{ marginTop: activeTab!=='Home' ? '0' : '40px', marginBottom: '40px' }}>
              <h2 className="section-title">Certifications</h2>
              <div className="grid-2">
                {data.certificates.map((cert) => (
                  <div key={cert._id} className="project-card" style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '300px', background: 'var(--bg-color)', position: 'relative', borderBottom: '1px solid var(--border-color)' }}>
                        <img src={cert.imageUrl} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '15px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ color: 'var(--accent-primary)', marginBottom: '8px', fontSize: '18px' }}>{cert.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements Section */}
          {showSection('Achievements') && data.achievements && data.achievements.length > 0 && (
            <section className="glass-card" style={{ marginTop: activeTab!=='Home' ? '0' : '40px', marginBottom: '40px' }}>
              <h2 className="section-title">Certifications & Achievements</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {data.achievements.map((achievement, index) => (
                  <li key={index} style={{ color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#f59e0b', marginRight: '10px' }}>🏆</span>
                    <div>
                      <strong style={{ display: 'block' }}>{achievement.title}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{achievement.organization} - {achievement.year}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Contact Section */}
          {showSection('Contact') && (
            <section className="glass-card" style={{ marginTop: activeTab !== 'Home' ? '0' : '40px', marginBottom: '40px' }}>
              <h2 className="section-title">Get In Touch</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>Interested in working together or have a question? Feel free to drop a message below. I monitor this inbox actively.</p>
              
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>Your Name</label>
                    <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }} placeholder="John Doe" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>Your Email</label>
                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }} placeholder="john@example.com" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>Subject</label>
                  <input type="text" value={contactSubject} onChange={e => setContactSubject(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }} placeholder="Job Opportunity" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>Message</label>
                  <textarea value={contactMessage} onChange={e => setContactMessage(e.target.value)} required rows="5" style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }} placeholder="Write your message here..."></textarea>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="project-link" style={{ alignSelf: 'flex-start', padding: '12px 30px', fontSize: '16px', background: isSubmitting ? 'var(--text-muted)' : 'var(--accent-gradient)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Sending...' : 'Send Message 🚀'}
                </button>

                {contactStatus && (
                  <div style={{ marginTop: '10px', padding: '12px', background: 'var(--icon-bg)', borderRadius: '8px', color: 'var(--text-primary)', borderLeft: '4px solid var(--accent-primary)', fontSize: '14px', fontWeight: '500' }}>
                    {contactStatus}
                  </div>
                )}
              </form>
            </section>
          )}

        </div>
        
        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '50px', padding: '20px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
            <p style={{ marginBottom: '15px' }}>📄 Portfolio & up-to-date repositories: <a href="https://github.com/uday862" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-primary)', textDecoration: 'none'}}>github.com/uday862</a> | LeetCode (450+ problems) | Open to Software Engineering Roles</p>
            <div style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--card-bg)', border: '1px solid var(--accent-primary)', borderRadius: '30px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
              👁️ Unique Visitors: <span style={{ color: 'var(--accent-primary)' }}>{data.visitors !== undefined ? data.visitors : 0}</span>
            </div>
        </footer>
      </main>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', background: 'var(--bg-color)', color: 'var(--danger-color)', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2>React Crash Report 💥</h2>
          <p>Please copy this exact error message and send it back to the AI assistant so I can fix it immediately!</p>
          <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }}/>
          <strong style={{ fontSize: '18px' }}>{this.state.error && this.state.error.toString()}</strong>
          <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>
            {this.state.error && this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PortfolioWrapper(props) {
  return <ErrorBoundary><Portfolio {...props} /></ErrorBoundary>;
}
