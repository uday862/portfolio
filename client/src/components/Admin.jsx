import React, { useState, useEffect } from 'react';

function Admin() {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [status, setStatus] = useState('');
    
    const [messages, setMessages] = useState([]);

    // Core Profile data
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [fundamentals, setFundamentals] = useState('');
    const [devopsHighlights, setDevopsHighlights] = useState('');
    const [photoSize, setPhotoSize] = useState(100);
    const [photoUrl, setPhotoUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [contacts, setContacts] = useState([]);
    
    const [photo, setPhoto] = useState(null);
    const [resume, setResume] = useState(null);

    const [projects, setProjects] = useState([]);
    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);
    
    // Certificate Form
    const [certTitle, setCertTitle] = useState('');
    const [certDesc, setCertDesc] = useState('');
    const [certImg, setCertImg] = useState(null);
    const [editCertId, setEditCertId] = useState(null);
    
    // Sub-forms
    const initContact = { icon: '', text: '', link: '' };
    const [newContact, setNewContact] = useState(initContact);
    const [editContactIdx, setEditContactIdx] = useState(-1);

    const initProj = { title: '', tech: '', description: '', link: '' };
    const [newProj, setNewProj] = useState(initProj);
    const [editProjIdx, setEditProjIdx] = useState(-1);

    const initEdu = { degree: '', institution: '', score: '', year: '' };
    const [newEdu, setNewEdu] = useState(initEdu);
    const [editEduIdx, setEditEduIdx] = useState(-1);

    const initSkill = { category: '', items: '' };
    const [newSkill, setNewSkill] = useState(initSkill);
    const [editSkillIdx, setEditSkillIdx] = useState(-1);

    const [newAdminUser, setNewAdminUser] = useState('');
    const [newAdminPass, setNewAdminPass] = useState('');

    useEffect(() => {
        if (token) {
            fetchData();
            fetchMessages();
        }
    }, [token]);

    // Auto-clear global status toaster
    useEffect(() => {
        if (status) {
            const timer = setTimeout(() => setStatus(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/admin/messages', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error('Failed to fetch messages');
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE', headers: { 'x-auth-token': token } });
            if (res.ok) {
                setMessages(messages.filter(m => m._id !== id));
                setStatus('Message deleted successfully.');
            }
        } catch (err) {
            setStatus('Failed to delete message.');
        }
    };

    const fetchData = () => {
        fetch('/api/portfolio')
            .then(res => res.json())
            .then(data => {
                setName(data.profile?.name || '');
                setTitle(data.profile?.title || '');
                setSummary(data.profile?.summary || '');
                setFundamentals(data.profile?.fundamentals?.join(', ') || '');
                setDevopsHighlights(data.profile?.devopsHighlights || '');
                setPhotoSize(data.profile?.photoSize || 100);
                setPhotoUrl(data.profile?.photoUrl || '');
                setResumeUrl(data.profile?.resumeUrl || '');
                setContacts(data.profile?.contacts || []);

                setProjects(data.projects || []);
                setEducation(data.education || []);
                setSkills(data.skills || []);
                setCertificates(data.certificates || []);
            });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginUser, password: loginPass })
            });
            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                localStorage.setItem('adminToken', data.token);
                setStatus('Logged in successfully!');
            } else {
                setStatus(data.message);
            }
        } catch (err) {
            setStatus('Login failed');
        }
    };

    const handlePhotoUpload = async (e) => {
        e.preventDefault();
        if (!photo) return setStatus('Select a photo first');
        setStatus('Uploading...');
        const formData = new FormData();
        formData.append('photo', photo);
        try {
            const res = await fetch('/api/admin/upload-photo', {
                method: 'POST',
                headers: { 'x-auth-token': token },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('Photo uploaded successfully! Refresh public portfolio to see it.');
                if(data.photoUrl) setPhotoUrl(data.photoUrl);
            }
            else setStatus('Upload failed');
        } catch (err) {
            setStatus('Upload failed');
        }
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resume) return setStatus('Select a PDF resume first');
        setStatus('Uploading resume...');
        const formData = new FormData();
        formData.append('resume', resume);
        try {
            const res = await fetch('/api/admin/upload-resume', {
                method: 'POST',
                headers: { 'x-auth-token': token },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('Resume uploaded successfully! Check the public site Download button.');
                if(data.resumeUrl) setResumeUrl(data.resumeUrl);
            }
            else setStatus('Resume upload failed');
        } catch (err) {
            setStatus('Resume upload failed via network');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setStatus('Saving Profile data...');
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ name, title, summary, fundamentals: fundamentals.split(',').map(s=>s.trim()).filter(Boolean), devopsHighlights, photoSize, contacts })
            });
            if (res.ok) setStatus('Profile & Settings saved successfully!');
            else setStatus('Profile save failed');
        } catch (err) {
            setStatus('Save failed');
        }
    };

    const handleUpdateCredentials = async (e) => {
        e.preventDefault();
        if (!newAdminUser || !newAdminPass) return setStatus('Both fields required');
        try {
            const res = await fetch('/api/admin/credentials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ username: newAdminUser, password: newAdminPass })
            });
            if (res.ok) {
                setStatus('Admin credentials updated! Please use these next time.');
                setNewAdminUser(''); setNewAdminPass('');
            } else setStatus('Credentials update failed');
        } catch (err) {
            setStatus('Update failed');
        }
    };

    const saveArrayData = async (section, dataArray, setter) => {
        setStatus(`Saving ${section}...`);
        try {
            const res = await fetch(`/api/admin/${section}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(dataArray)
            });
            if (res.ok) {
                setter(dataArray);
                setStatus(`${section} updated successfully!`);
            } else setStatus(`Failed to update ${section}`);
        } catch (err) {
            setStatus(`Error saving ${section}`);
        }
    };

    // Contacts Local State Helpers
    const saveContact = (e) => {
        e.preventDefault();
        const updated = [...contacts];
        if (editContactIdx >= 0) updated[editContactIdx] = newContact;
        else updated.push(newContact);
        setContacts(updated);
        setNewContact(initContact);
        setEditContactIdx(-1);
    };
    const deleteContact = (idx) => setContacts(contacts.filter((_, i) => i !== idx));

    // Projects CRUD
    const saveProject = (e) => {
        e.preventDefault();
        const updated = [...projects];
        const projObj = { ...newProj, bullets: newProj.bullets || [], links: newProj.link ? [newProj.link] : [] };
        if (editProjIdx >= 0) updated[editProjIdx] = projObj;
        else updated.push(projObj);
        saveArrayData('projects', updated, setProjects);
        setNewProj(initProj); setEditProjIdx(-1);
    };
    const deleteProject = (idx) => saveArrayData('projects', projects.filter((_, i) => i !== idx), setProjects);
    const startEditProject = (idx) => {
        setEditProjIdx(idx);
        const p = projects[idx];
        setNewProj({ title: p.title, tech: p.tech, description: p.description, link: p.links?.[0] || '' });
    };

    // Education CRUD
    const saveEducation = (e) => {
        e.preventDefault();
        const updated = [...education];
        if (editEduIdx >= 0) updated[editEduIdx] = newEdu;
        else updated.push(newEdu);
        saveArrayData('education', updated, setEducation);
        setNewEdu(initEdu); setEditEduIdx(-1);
    };
    const deleteEducation = (idx) => saveArrayData('education', education.filter((_, i) => i !== idx), setEducation);
    const startEditEducation = (idx) => { setEditEduIdx(idx); setNewEdu(education[idx]); };

    // Skills CRUD
    const saveSkill = (e) => {
        e.preventDefault();
        const updated = [...skills];
        if (editSkillIdx >= 0) updated[editSkillIdx] = newSkill;
        else updated.push(newSkill);
        saveArrayData('skills', updated, setSkills);
        setNewSkill(initSkill); setEditSkillIdx(-1);
    };
    const deleteSkill = (idx) => saveArrayData('skills', skills.filter((_, i) => i !== idx), setSkills);
    const startEditSkill = (idx) => { setEditSkillIdx(idx); setNewSkill(skills[idx]); };

    const handleUploadCertificate = async (e) => {
        e.preventDefault();
        if (!editCertId && !certImg) return setStatus('Select a certificate image first');
        
        setStatus(editCertId ? 'Updating certificate...' : 'Uploading certificate...');
        const formData = new FormData();
        if (certImg) formData.append('image', certImg);
        formData.append('title', certTitle);
        formData.append('description', certDesc);
        
        const url = editCertId ? `/api/admin/certificate/${editCertId}` : '/api/admin/certificate';
        const method = editCertId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'x-auth-token': token },
                body: formData
            });
            if (res.ok) {
                const updatedCerts = await res.json();
                setCertificates(updatedCerts);
                setStatus(`Certificate ${editCertId ? 'updated' : 'uploaded'} successfully!`);
                cancelEditCertificate();
            } else setStatus(`Certificate ${editCertId ? 'update' : 'upload'} failed`);
        } catch (err) {
            setStatus('Certificate network error');
        }
    };

    const startEditCertificate = (c) => {
        setEditCertId(c._id);
        setCertTitle(c.title);
        setCertDesc(c.description);
        setCertImg(null);
        const fileInput = document.getElementById('certFileInput');
        if (fileInput) fileInput.value = '';
    };

    const cancelEditCertificate = () => {
        setEditCertId(null);
        setCertTitle(''); 
        setCertDesc(''); 
        setCertImg(null);
        const fileInput = document.getElementById('certFileInput');
        if (fileInput) fileInput.value = '';
    };

    const deleteCertificate = async (id) => {
        if (!window.confirm('Delete this certificate?')) return;
        try {
            const res = await fetch(`/api/admin/certificate/${id}`, { method: 'DELETE', headers: { 'x-auth-token': token } });
            if (res.ok) {
                const updatedCerts = await res.json();
                setCertificates(updatedCerts);
                setStatus('Certificate deleted.');
            }
        } catch (err) {
            setStatus('Failed to delete certificate.');
        }
    };

    if (!token) {
        return (
            <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Login</h2>
                    <p style={{textAlign: 'center', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px'}}>Default is: admin / admin123</p>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" placeholder="Username" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} style={inputStyle} />
                        <input type="password" placeholder="Password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} style={inputStyle} />
                        <button type="submit" className="project-link" style={{ textAlign: 'center', border: 'none', cursor: 'pointer' }}>Secure Login</button>
                    </form>
                    {status && (
                        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: (status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') || status.toLowerCase().includes('invalid') || status.toLowerCase().includes('select')) ? 'var(--danger-color)' : (status.includes('Uploading') || status.includes('Saving')) ? 'var(--accent-primary)' : 'var(--success-color)', color: '#fff', padding: '16px 32px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 9999, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setStatus('')}>
                            <span>{(status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') || status.toLowerCase().includes('invalid') || status.toLowerCase().includes('select')) ? '❌' : (status.includes('Uploading') || status.includes('Saving')) ? '⏳' : '✅'}</span>
                            <span style={{ letterSpacing: '0.5px' }}>{status}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const liveAvatarUrl = photoUrl || "https://ui-avatars.com/api/?name=Admin+Preview&background=3b82f6&color=fff&size=200";

    return (
        <div className="app-container">
            <h1 className="section-title">Admin Dashboard</h1>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <a href="/" className="project-link" style={{ background: 'var(--accent-primary)', textDecoration: 'none' }}>Back to Public Portfolio</a>
                <button onClick={() => { setToken(null); localStorage.removeItem('adminToken'); }} className="project-link" style={{ background: 'var(--danger-color)', border: 'none', cursor: 'pointer' }}>Logout</button>
            </div>
            
            {status && (
                <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: (status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') || status.toLowerCase().includes('invalid') || status.toLowerCase().includes('select')) ? 'var(--danger-color)' : (status.includes('Uploading') || status.includes('Saving')) ? 'var(--accent-primary)' : 'var(--success-color)', color: '#fff', padding: '16px 32px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 9999, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => setStatus('')}>
                    <span>{(status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') || status.toLowerCase().includes('invalid') || status.toLowerCase().includes('select')) ? '❌' : (status.includes('Uploading') || status.includes('Saving')) ? '⏳' : '✅'}</span>
                    <span style={{ letterSpacing: '0.5px' }}>{status}</span>
                </div>
            )}

            <div className="grid-2">
                {/* Photo Upload */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '15px' }}>1A. Upload New Photo</h3>
                    <form onSubmit={handlePhotoUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} style={{ color: 'var(--text-primary)', fontSize: '14px' }} />
                        <button type="submit" className="project-link" style={{ border: 'none', cursor: 'pointer', maxWidth: '150px' }}>Upload Image</button>
                    </form>
                </div>

                {/* Resume Upload */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '15px' }}>1B. Upload Resume (PDF)</h3>
                    <form onSubmit={handleResumeUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} style={{ color: 'var(--text-primary)', fontSize: '14px' }} />
                        <button type="submit" className="project-link" style={{ background: 'var(--accent-gradient)', border: 'none', cursor: 'pointer', maxWidth: '150px' }}>Upload PDF</button>
                        {resumeUrl && <p style={{ fontSize: '13px', color: 'var(--success-color)' }}>✅ Active Resume is uploaded.</p>}
                    </form>
                </div>
            </div>

            {/* INBOX */}
            <div className="glass-card" style={{ marginTop: '24px', borderLeft: '6px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="section-title" style={{ marginBottom: '0' }}>📬 Private Inbox ({messages.length})</h3>
                    <button type="button" onClick={fetchMessages} style={{ background: 'var(--icon-bg)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>↻ Refresh</button>
                </div>
                
                {messages.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No messages yet. They will appear here when recruiters submit the Contact Form.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg) => (
                            <div key={msg._id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '20px', transition: 'all 0.2s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-primary)', margin: '0 0 5px 0', fontSize: '18px' }}>{msg.subject}</h4>
                                        <p style={{ color: 'var(--text-muted)', margin: '0', fontSize: '14px' }}>
                                            <strong style={{color: 'var(--accent-primary)'}}>{msg.name}</strong> ({msg.email})
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {new Date(msg.date).toLocaleString()}
                                        </span>
                                        <button type="button" onClick={() => deleteMessage(msg._id)} style={{ background: 'var(--danger-color)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                                    </div>
                                </div>
                                <div style={{ marginTop: '15px', padding: '15px', background: 'var(--input-bg)', borderRadius: '8px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                    {msg.message}
                                </div>
                                <a href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`} className="project-link" style={{ marginTop: '15px', background: 'var(--icon-bg)', color: 'var(--accent-primary)' }}>
                                    Reply via Email App ↗
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Credentials */}
            <div className="glass-card" style={{ marginTop: '24px' }}>
                <h3 style={{ marginBottom: '15px' }}>Security: Update Admin Credentials</h3>
                <form onSubmit={handleUpdateCredentials} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto', gap: '15px' }}>
                    <input type="text" placeholder="New Username" value={newAdminUser} onChange={e => setNewAdminUser(e.target.value)} style={inputStyle} required />
                    <input type="password" placeholder="New Password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} style={inputStyle} required />
                    <button type="submit" className="project-link" style={{ border: 'none', cursor: 'pointer' }}>Update Login</button>
                </form>
            </div>

            {/* Profile Settings (Top Header) */}
            <div className="glass-card" style={{ marginTop: '24px' }}>
                <h3 className="section-title">2. Manage Top Header & Profile</h3>
                <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px' }}>

                    {/* Live Photo Zoom Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2', alignItems: 'center', marginBottom: '15px' }}>
                         <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Internal Photo Zoom Slider ({(photoSize/100).toFixed(2)}x)</label>
                         <div style={{ padding: '4px', background: 'var(--accent-gradient)', borderRadius: '50%', width: '150px', height: '150px', display: 'flex', boxSizing: 'border-box' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--bg-color)', background: 'var(--bg-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
                                <img src={liveAvatarUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${photoSize / 100})` }} />
                            </div>
                         </div>
                         <input type="range" min="50" max="250" value={photoSize} onChange={e => setPhotoSize(e.target.value)} style={{ width: '100%', maxWidth: '300px', marginTop: '15px', cursor: 'pointer' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Professional Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Professional Summary</label>
                        <textarea value={summary} onChange={e => setSummary(e.target.value)} rows="4" style={inputStyle}></textarea>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Software Engineering Fundamentals (comma separated)</label>
                        <input type="text" value={fundamentals} onChange={e => setFundamentals(e.target.value)} style={inputStyle} placeholder="DSA, Object-Oriented Programming, Git..." />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>DevOps & System Design Highlights (HTML supported)</label>
                        <textarea value={devopsHighlights} onChange={e => setDevopsHighlights(e.target.value)} rows="4" style={inputStyle} placeholder="✅ DevOps Mindset: ..."></textarea>
                    </div>

                    {/* Contacts Manager inside Profile Form */}
                    <div style={{ gridColumn: 'span 2', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Top Header Contacts (Links/Icons)</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                            {contacts.map((c, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--input-bg)', padding: '8px', borderRadius: '6px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{c.icon} {c.text} {c.link ? `(${c.link})` : ''}</span>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button type="button" onClick={() => { setEditContactIdx(i); setNewContact(c); }} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                                        <button type="button" onClick={() => deleteContact(i)} style={{ background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '12px' }}>Del</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr) minmax(0, 3fr) auto', gap: '10px' }}>
                            <input type="text" placeholder="Icon (e.g. 📧)" value={newContact.icon} onChange={e => setNewContact({...newContact, icon: e.target.value})} style={{...inputStyle, padding: '8px'}} />
                            <input type="text" placeholder="Text" value={newContact.text} onChange={e => setNewContact({...newContact, text: e.target.value})} style={{...inputStyle, padding: '8px'}} />
                            <input type="text" placeholder="Link (optional)" value={newContact.link} onChange={e => setNewContact({...newContact, link: e.target.value})} style={{...inputStyle, padding: '8px'}} />
                            <button type="button" onClick={saveContact} className="project-link" style={{ border: 'none', cursor: 'pointer', padding: '8px' }}>{editContactIdx>=0?'Save':'Add'}</button>
                        </div>
                        <p style={{marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)'}}>* Contact updates are placed in staging. Click <b>"Save All Settings"</b> below to push to the server.</p>
                    </div>

                    <button type="submit" className="project-link" style={{ background: 'var(--success-color)', gridColumn: 'span 2', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '14px' }}>
                        Save All Top Header & Profile Settings
                    </button>
                </form>
            </div>

            {/* Projects CRUD */}
            <div className="glass-card" style={{ marginTop: '24px' }}>
                <h3 className="section-title">3. Manage Projects</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {projects.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div>
                                <strong style={{ color: 'var(--text-primary)' }}>{p.title}</strong><br/>
                                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{p.tech}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => startEditProject(i)} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px 12px' }}>Edit</button>
                                <button onClick={() => deleteProject(i)} style={{ background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px 12px' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                <h4 style={{color: 'var(--text-primary)'}}>{editProjIdx >= 0 ? "Edit Project" : "Add New Project"}</h4>
                <form onSubmit={saveProject} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px', marginTop: '10px' }}>
                    <input type="text" placeholder="Title" value={newProj.title} onChange={e => setNewProj({...newProj, title: e.target.value})} style={inputStyle} required />
                    <input type="text" placeholder="Tech Stack" value={newProj.tech} onChange={e => setNewProj({...newProj, tech: e.target.value})} style={inputStyle} required />
                    <textarea placeholder="Description" value={newProj.description} onChange={e => setNewProj({...newProj, description: e.target.value})} style={{...inputStyle, gridColumn: 'span 2'}} rows="3" required />
                    <input type="text" placeholder="Link URL (optional)" value={newProj.link} onChange={e => setNewProj({...newProj, link: e.target.value})} style={{...inputStyle, gridColumn: 'span 2'}} />
                    <button type="submit" className="project-link" style={{ border: 'none', cursor: 'pointer', gridColumn: 'span 2' }}>
                        {editProjIdx >= 0 ? "Update Project" : "+ Add Project"}
                    </button>
                    {editProjIdx >= 0 && (
                        <button type="button" onClick={() => { setEditProjIdx(-1); setNewProj(initProj); }} style={{ background: 'var(--text-muted)', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '6px', gridColumn: 'span 2', padding: '10px' }}>Cancel Edit</button>
                    )}
                </form>
            </div>

            <div className="grid-2" style={{ marginTop: '24px' }}>
                {/* Education CRUD */}
                <div className="glass-card">
                    <h3 className="section-title">Manage Education</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {education.map((e, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{e.degree} ({e.year})</span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => startEditEducation(i)} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px', fontSize: '12px' }}>Edit</button>
                                    <button onClick={() => deleteEducation(i)} style={{ background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px', fontSize: '12px' }}>Del</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h4 style={{color: 'var(--text-primary)'}}>{editEduIdx >= 0 ? "Edit Education" : "Add Education"}</h4>
                    <form onSubmit={saveEducation} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        <input type="text" placeholder="Degree" value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} style={inputStyle} required />
                        <input type="text" placeholder="Institution" value={newEdu.institution} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} style={inputStyle} required />
                        <input type="text" placeholder="Score/GPA" value={newEdu.score} onChange={e => setNewEdu({...newEdu, score: e.target.value})} style={inputStyle} />
                        <input type="text" placeholder="Year Range (e.g., 2020-2024)" value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} style={inputStyle} />
                        <button type="submit" className="project-link" style={{ border: 'none', cursor: 'pointer' }}>{editEduIdx >= 0 ? "Update" : "+ Add"} Education</button>
                        {editEduIdx >= 0 && <button type="button" onClick={() => { setEditEduIdx(-1); setNewEdu(initEdu); }} style={{ background: 'var(--text-muted)', cursor: 'pointer', padding: '10px', borderRadius: '6px', border: 'none', color: '#fff' }}>Cancel</button>}
                    </form>
                </div>

                {/* Skills CRUD */}
                <div className="glass-card">
                    <h3 className="section-title">Manage Skills</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {skills.map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{s.category}</span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => startEditSkill(i)} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px', fontSize: '12px' }}>Edit</button>
                                    <button onClick={() => deleteSkill(i)} style={{ background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px', fontSize: '12px' }}>Del</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h4 style={{color: 'var(--text-primary)'}}>{editSkillIdx >= 0 ? "Edit Skill Category" : "Add Skill Category"}</h4>
                    <form onSubmit={saveSkill} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        <input type="text" placeholder="Category Name" value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} style={inputStyle} required />
                        <textarea placeholder="Skills (comma separated)" value={newSkill.items} onChange={e => setNewSkill({...newSkill, items: e.target.value})} style={inputStyle} rows="3" required />
                        <button type="submit" className="project-link" style={{ border: 'none', cursor: 'pointer' }}>{editSkillIdx >= 0 ? "Update" : "+ Add"} Skills</button>
                        {editSkillIdx >= 0 && <button type="button" onClick={() => { setEditSkillIdx(-1); setNewSkill(initSkill); }} style={{ background: 'var(--text-muted)', cursor: 'pointer', padding: '10px', borderRadius: '6px', border: 'none', color: '#fff' }}>Cancel</button>}
                    </form>
                </div>
                
                {/* Certificates CRUD */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="section-title">Manage Certifications (Images)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                        {certificates.map((c) => (
                            <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', background: '#000' }}>
                                        <img src={c.imageUrl} alt="cert" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{c.title}</strong>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{c.description}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => startEditCertificate(c)} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '8px 16px' }}>Edit</button>
                                    <button onClick={() => deleteCertificate(c._id)} style={{ background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '8px 16px' }}>Del</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleUploadCertificate} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px', background: 'var(--card-bg)', padding: '20px', borderRadius: '10px', border: '1px dashed var(--border-color)' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>{editCertId ? "✏️ Edit Certificate" : "+ Add New Certificate"}</h4>
                        </div>
                        <input type="text" placeholder="Certificate Title (e.g. AWS Certified Architect)" value={certTitle} onChange={e => setCertTitle(e.target.value)} style={inputStyle} required />
                        <input id="certFileInput" type="file" accept="image/*" onChange={(e) => setCertImg(e.target.files[0])} style={{ ...inputStyle, padding: '9px 12px' }} required={!editCertId} />
                        <textarea placeholder="Description or Issuer info..." value={certDesc} onChange={e => setCertDesc(e.target.value)} style={{ ...inputStyle, gridColumn: 'span 2' }} rows="3" required />
                        <button type="submit" className="project-link" style={{ gridColumn: 'span 2', background: 'var(--success-color)', border: 'none', cursor: 'pointer', padding: '12px' }}>{editCertId ? "Update Certificate" : "Upload Certificate"}</button>
                        {editCertId && (
                            <button type="button" onClick={cancelEditCertificate} className="project-link" style={{ gridColumn: 'span 2', background: 'var(--text-muted)', border: 'none', cursor: 'pointer', padding: '12px' }}>Cancel Edit</button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    width: '100%',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
};

export default Admin;
