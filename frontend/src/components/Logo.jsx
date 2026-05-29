import { useEffect } from 'react';

export default function Logo() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'fl-logo-styles';
    if (!document.getElementById('fl-logo-styles')) {
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&family=Exo+2:wght@300;400&display=swap');
        .fl-logo{display:flex;flex-direction:column;align-items:center;gap:0;padding:0}
        .fl-scene{position:relative;width:160px;height:160px;display:flex;align-items:center;justify-content:center}
        .fl-ring{position:absolute;border-radius:50%;border:2px solid transparent}
        .fl-ring1{width:155px;height:155px;border-top-color:#00d4ff;border-right-color:#00d4ff44;animation:fl-spin 5s linear infinite}
        .fl-ring2{width:122px;height:122px;border-bottom-color:#0099cc;border-left-color:#0099cc44;animation:fl-spin 7s linear infinite reverse}
        .fl-ring3{width:92px;height:92px;border-top-color:#00ffcc;border-right-color:#00ffcc44;animation:fl-spin 4s linear infinite}
        @keyframes fl-spin{to{transform:rotate(360deg)}}
        .fl-dot{position:absolute;border-radius:50%}
        .fl-dot1{width:9px;height:9px;background:#00d4ff;animation:fl-o1 5s linear infinite}
        .fl-dot2{width:7px;height:7px;background:#00ffaa;animation:fl-o2 7s linear infinite reverse}
        .fl-dot3{width:5px;height:5px;background:#aaddff;animation:fl-o3 4s linear infinite}
        @keyframes fl-o1{from{transform:rotate(0deg) translateX(77px) rotate(0deg)}to{transform:rotate(360deg) translateX(77px) rotate(-360deg)}}
        @keyframes fl-o2{from{transform:rotate(60deg) translateX(61px) rotate(-60deg)}to{transform:rotate(420deg) translateX(61px) rotate(-420deg)}}
        @keyframes fl-o3{from{transform:rotate(180deg) translateX(46px) rotate(-180deg)}to{transform:rotate(540deg) translateX(46px) rotate(-540deg)}}
        .fl-orb{width:75px;height:75px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#1a6aff,#002277 60%,#001144);display:flex;align-items:center;justify-content:center;animation:fl-pulse 3s ease-in-out infinite}
        @keyframes fl-pulse{0%,100%{box-shadow:0 0 20px #00aaffaa,0 0 40px #0055ff44;transform:scale(1)}50%{box-shadow:0 0 32px #00ccffcc,0 0 60px #0077ff66;transform:scale(1.06)}}
        .fl-wordmark{display:flex;flex-direction:column;align-items:center;margin-top:12px}
        .fl-brand-title{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:32px;letter-spacing:2px;background:linear-gradient(90deg,#00d4ff,#0088ff,#00ffcc);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:fl-shimmer 4s linear infinite;white-space:nowrap}
        @keyframes fl-shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .fl-brand-sub{font-family:'Exo 2',sans-serif;font-weight:300;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#7ab8d4;margin-top:4px;white-space:nowrap}
      `;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById('fl-logo-styles');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="fl-logo">
      <div className="fl-scene">
        <div className="fl-ring fl-ring1"></div>
        <div className="fl-ring fl-ring2"></div>
        <div className="fl-ring fl-ring3"></div>
        <div className="fl-dot fl-dot1"></div>
        <div className="fl-dot fl-dot2"></div>
        <div className="fl-dot fl-dot3"></div>
        <div className="fl-orb">
          <svg width="42" height="42" viewBox="0 0 46 46" fill="none">
            <path d="M23 11 C17 11 12 15 12 20 C12 22 13 24 15 25 C14 27 15 29 17 30 C18 32 20 33 23 33 C26 33 28 32 29 30 C31 29 32 27 31 25 C33 24 34 22 34 20 C34 15 29 11 23 11Z" fill="#0077cc" stroke="#00aaff" strokeWidth="0.9"/>
            <path d="M23 11 C23 16 20 19 18 22 C16 25 17 29 19 31" stroke="#00d4ff" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M23 11 C23 16 26 19 28 22 C30 25 29 29 27 31" stroke="#00d4ff" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M16 20 C19 18 23 18 27 18" stroke="#44ccff" strokeWidth="1.1" strokeLinecap="round"/>
            <path d="M15 23 C18 22 23 22 29 22" stroke="#44ccff" strokeWidth="0.9" strokeLinecap="round"/>
            <circle cx="23" cy="20" r="2.8" fill="#00d4ff"/>
            <circle cx="23" cy="20" r="1.6" fill="#ffffff"/>
            <circle cx="18" cy="17" r="1" fill="#00d4ff" opacity="0.8"/>
            <circle cx="28" cy="17" r="1" fill="#00d4ff" opacity="0.8"/>
          </svg>
        </div>
      </div>
      <div className="fl-wordmark">
        <div className="fl-brand-title">Focused Learner</div>
        <div className="fl-brand-sub">AI · Wellness · Learning</div>
      </div>
    </div>
  );
}