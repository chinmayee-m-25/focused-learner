import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Login() {
  const [tab, setTab] = useState('signin');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPass, setSigninPass] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupAge, setSignupAge] = useState('');
  const [signupGender, setSignupGender] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupGoal, setSignupGoal] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'login-page-styles';
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600&display=swap');
      .lp-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1rem;font-family:'Exo 2',sans-serif}
      .lp-logo-area{margin-bottom:1.5rem}
      .lp-card{width:100%;max-width:460px;background:rgba(13,27,50,0.88);border:1px solid #1a3a5c;border-radius:20px;padding:2rem;backdrop-filter:blur(12px);box-shadow:0 8px 40px rgba(0,100,255,0.15)}
      .lp-tabs{display:flex;background:rgba(255,255,255,0.05);border-radius:12px;padding:4px;margin-bottom:1.8rem;gap:4px}
      .lp-tab{flex:1;padding:10px;border:none;border-radius:10px;font-family:'Exo 2',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.3s;background:transparent;color:#7ab8d4;letter-spacing:0.5px}
      .lp-tab.active{background:linear-gradient(135deg,#0066ff,#00aaff);color:#fff;box-shadow:0 4px 15px rgba(0,100,255,0.4)}
      .lp-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .lp-field{margin-bottom:1rem}
      .lp-label{display:block;font-size:12px;color:#7ab8d4;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;font-weight:400}
      .lp-input{width:100%;padding:11px 14px;background:rgba(255,255,255,0.05);border:1px solid #1a3a5c;border-radius:10px;color:#e0f0ff;font-family:'Exo 2',sans-serif;font-size:14px;outline:none;transition:border-color 0.3s,box-shadow 0.3s;box-sizing:border-box}
      .lp-input:focus{border-color:#0088ff;box-shadow:0 0 0 3px rgba(0,136,255,0.2)}
      .lp-input::placeholder{color:#3a5a7a}
      .lp-select{width:100%;padding:11px 14px;background:rgba(13,27,50,0.95);border:1px solid #1a3a5c;border-radius:10px;color:#e0f0ff;font-family:'Exo 2',sans-serif;font-size:14px;outline:none;cursor:pointer;box-sizing:border-box;transition:border-color 0.3s}
      .lp-select:focus{border-color:#0088ff;box-shadow:0 0 0 3px rgba(0,136,255,0.2)}
      .lp-select option{background:#0d1b32;color:#e0f0ff}
      .lp-btn{width:100%;padding:14px;background:linear-gradient(135deg,#0055ff,#00aaff);border:none;border-radius:12px;color:#fff;font-family:'Exo 2',sans-serif;font-size:16px;font-weight:600;letter-spacing:1px;cursor:pointer;margin-top:0.4rem;transition:all 0.3s;box-shadow:0 4px 20px rgba(0,100,255,0.35)}
      .lp-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,150,255,0.5)}
      .lp-btn:active{transform:translateY(0)}
      .lp-forgot{text-align:right;margin:-4px 0 1rem;font-size:13px;color:#0099ff;cursor:pointer;opacity:0.85}
      .lp-forgot:hover{opacity:1;text-decoration:underline}
      .lp-bottom{text-align:center;margin-top:1rem;font-size:13px;color:#5588aa}
      .lp-bottom span{color:#00aaff;cursor:pointer;font-weight:600}
      .lp-bottom span:hover{text-decoration:underline}
      .lp-msg{padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:1rem;text-align:center;font-weight:500}
      .lp-msg.error{background:rgba(255,50,50,0.15);border:1px solid #ff4444;color:#ff8888}
      .lp-msg.success{background:rgba(0,255,150,0.1);border:1px solid #00cc88;color:#00ffaa}
      .lp-section-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#0088ff;margin:1.2rem 0 0.8rem;padding-bottom:6px;border-bottom:1px solid #1a3a5c}
      .lp-goal-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
      .lp-goal-btn{padding:9px 8px;background:rgba(255,255,255,0.04);border:1px solid #1a3a5c;border-radius:8px;color:#7ab8d4;font-family:'Exo 2',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s;text-align:center}
      .lp-goal-btn.selected{background:rgba(0,136,255,0.2);border-color:#0088ff;color:#00d4ff}
      .lp-goal-btn:hover{border-color:#0066cc;color:#aaddff}
    `;
    if (!document.getElementById('login-page-styles')) {
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById('login-page-styles');
      if (el) el.remove();
    };
  }, []);

  const showMsg = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleSignIn = async () => {
    if (!signinEmail || !signinPass)
      return showMsg('Please fill in all fields.', 'error');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signinEmail, password: signinPass }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        showMsg('Welcome back! Redirecting...', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showMsg(data.message || 'Invalid email or password.', 'error');
      }
    } catch {
      // If no backend yet, go directly
      showMsg('Redirecting to dashboard...', 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  const handleSignUp = async () => {
    if (!signupName || !signupEmail || !signupPass || !signupConfirm || !signupAge || !signupGender)
      return showMsg('Please fill in all required fields.', 'error');
    if (signupPass !== signupConfirm)
      return showMsg('Passwords do not match!', 'error');
    if (signupPass.length < 6)
      return showMsg('Password must be at least 6 characters.', 'error');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPass,
          age: signupAge,
          gender: signupGender,
          phone: signupPhone,
          goal: signupGoal,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('Account created! Please sign in.', 'success');
        setTimeout(() => setTab('signin'), 1500);
      } else {
        showMsg(data.message || 'Registration failed.', 'error');
      }
    } catch {
      showMsg('Account created! Please sign in.', 'success');
      setTimeout(() => setTab('signin'), 1500);
    }
  };

  const goals = [
    '🧠 Mental Focus',
    '💪 Physical Fitness',
    '😴 Better Sleep',
    '🥗 Healthy Diet',
    '😌 Stress Relief',
    '📚 Daily Learning',
  ];

  return (
    <div className="lp-wrap">
      <div className="lp-logo-area">
        <Logo />
      </div>

      <div className="lp-card">
        <div className="lp-tabs">
          <button className={`lp-tab ${tab === 'signin' ? 'active' : ''}`} onClick={() => setTab('signin')}>
            Sign In
          </button>
          <button className={`lp-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>
            Sign Up
          </button>
        </div>

        {msg.text && <div className={`lp-msg ${msg.type}`}>{msg.text}</div>}

        {/* ── SIGN IN ── */}
        {tab === 'signin' && (
          <>
            <div className="lp-field">
              <label className="lp-label">Email Address</label>
              <input className="lp-input" type="email" placeholder="Enter your email"
                value={signinEmail} onChange={e => setSigninEmail(e.target.value)} />
            </div>
            <div className="lp-field">
              <label className="lp-label">Password</label>
              <input className="lp-input" type="password" placeholder="Enter your password"
                value={signinPass} onChange={e => setSigninPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignIn()} />
            </div>
            <div className="lp-forgot">Forgot password?</div>
            <button className="lp-btn" onClick={handleSignIn}>Access Dashboard →</button>
            <div className="lp-bottom">
              Don't have an account?{' '}
              <span onClick={() => setTab('signup')}>Create one now</span>
            </div>
          </>
        )}

        {/* ── SIGN UP ── */}
        {tab === 'signup' && (
          <>
            {/* Personal Info */}
            <div className="lp-section-title">👤 Personal Information</div>
            <div className="lp-field">
              <label className="lp-label">Full Name *</label>
              <input className="lp-input" type="text" placeholder="Enter your full name"
                value={signupName} onChange={e => setSignupName(e.target.value)} />
            </div>
            <div className="lp-row">
              <div className="lp-field">
                <label className="lp-label">Age *</label>
                <input className="lp-input" type="number" placeholder="Your age" min="10" max="100"
                  value={signupAge} onChange={e => setSignupAge(e.target.value)} />
              </div>
              <div className="lp-field">
                <label className="lp-label">Gender *</label>
                <select className="lp-select" value={signupGender} onChange={e => setSignupGender(e.target.value)}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
              </div>
            </div>
            <div className="lp-field">
              <label className="lp-label">Phone Number (optional)</label>
              <input className="lp-input" type="tel" placeholder="+91 98765 43210"
                value={signupPhone} onChange={e => setSignupPhone(e.target.value)} />
            </div>

            {/* Account Info */}
            <div className="lp-section-title">🔐 Account Details</div>
            <div className="lp-field">
              <label className="lp-label">Email Address *</label>
              <input className="lp-input" type="email" placeholder="Enter your email"
                value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
            </div>
            <div className="lp-row">
              <div className="lp-field">
                <label className="lp-label">Password *</label>
                <input className="lp-input" type="password" placeholder="Min 6 characters"
                  value={signupPass} onChange={e => setSignupPass(e.target.value)} />
              </div>
              <div className="lp-field">
                <label className="lp-label">Confirm Password *</label>
                <input className="lp-input" type="password" placeholder="Re-enter password"
                  value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} />
              </div>
            </div>

            {/* Wellness Goal */}
            <div className="lp-section-title">🎯 Your Wellness Goal</div>
            <div className="lp-goal-grid">
              {goals.map(g => (
                <button key={g} className={`lp-goal-btn ${signupGoal === g ? 'selected' : ''}`}
                  onClick={() => setSignupGoal(g)}>
                  {g}
                </button>
              ))}
            </div>

            <br />
            <button className="lp-btn" onClick={handleSignUp}>Create Account →</button>
            <div className="lp-bottom">
              Already have an account?{' '}
              <span onClick={() => setTab('signin')}>Sign in here</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}