import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  { icon: '🎬', title: 'Documentary Mode', desc: 'Experience your future as a cinematic documentary with scene-based storytelling.' },
  { icon: '🌳', title: 'Decision Branching', desc: 'See how each choice branches into multiple future paths.' },
  { icon: '📊', title: 'Multi-Scenario View', desc: 'Compare best-case, worst-case, and most probable outcomes side by side.' },
  { icon: '🔁', title: 'What-If Engine', desc: 'Modify decisions and instantly see how your future changes.' },
  { icon: '⚠️', title: 'Risk Analysis', desc: 'Understand risks, regret probability, and how to minimize them.' },
  { icon: '⏳', title: 'Time Progression', desc: 'Journey through your future year by year on an interactive timeline.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      {/* Hero */}
      <section style={{
        padding: '100px 24px 80px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
      }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32, fontSize: 14, color: 'var(--accent-primary)' }}>
            <span>✦</span> AI-Powered Future Simulation
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Simulate Decisions.<br />
            <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Experience Your Future.
            </span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Don&apos;t just guess your future — see it. Our AI transforms your decisions into immersive documentary experiences with branching timelines and deep insights.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ fontSize: 18, padding: '16px 40px' }} onClick={() => navigate('/simulate')}>
              🎬 Start Your Story
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 16, padding: '16px 32px' }} onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Learn More ↓
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 16 }}>Everything You Need to Decide with Confidence</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 56, fontSize: 17 }}>
            Six powerful modules working together to illuminate your future.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ cursor: 'default' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.05))' }}>
        <div className="container">
          <h2 style={{ fontSize: 40, marginBottom: 16 }}>Ready to See Your Future?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 40 }}>Your decisions shape your destiny. Make them with clarity.</p>
          <button className="btn btn-primary" style={{ fontSize: 18, padding: '16px 48px' }} onClick={() => navigate('/simulate')}>
            🚀 Launch Simulation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        <p>🎬 FutureLens — AI Interactive Future Documentary Engine</p>
      </footer>
    </div>
  );
}
