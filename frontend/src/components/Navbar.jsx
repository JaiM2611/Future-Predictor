import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav style={{
      background: 'rgba(10,10,15,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)', textDecoration: 'none' }}>
          <span style={{ fontSize: 24 }}>🎬</span>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}>
            Future<span style={{ color: 'var(--accent-primary)' }}>Lens</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/" className={`btn btn-ghost ${pathname === '/' ? 'active' : ''}`} style={{ color: pathname === '/' ? 'var(--text-primary)' : undefined }}>Home</Link>
          <Link to="/simulate" className="btn btn-primary" style={{ fontSize: 14, padding: '8px 20px' }}>
            ✦ Start Simulation
          </Link>
        </div>
      </div>
    </nav>
  );
}
