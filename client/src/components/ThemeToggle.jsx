import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      style={{
        position: 'fixed', bottom: '25px', right: '25px', zIndex: 9999,
        background: 'var(--panel-bg)', color: 'var(--text-primary)',
        border: '1px solid var(--border-color)', borderRadius: '50%',
        width: '54px', height: '54px', fontSize: '26px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', backdropFilter: 'blur(10px)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease'
      }}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
