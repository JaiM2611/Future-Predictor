export default function ComparisonView({ scenarios }) {
  if (!scenarios?.length) return null;

  const getConfig = (type) => ({
    best_case: { label: 'Best Case', color: 'var(--accent-green)', emoji: '🌟' },
    worst_case: { label: 'Worst Case', color: 'var(--accent-red)', emoji: '⚠️' },
    most_probable: { label: 'Most Probable', color: 'var(--accent-primary)', emoji: '🎯' },
  }[type] || { label: type, color: 'var(--accent-primary)', emoji: '📊' });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 24 }}>📊</span>
        <div>
          <h3 style={{ fontSize: 20 }}>Scenario Comparison</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Side-by-side view of your possible futures</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${scenarios.length}, 1fr)`, gap: 16 }}>
        {scenarios.map((s, i) => {
          const config = getConfig(s.scenario_type);
          return (
            <div key={i} className="card" style={{ borderTop: `3px solid ${config.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>{config.emoji}</span>
                <span style={{ fontWeight: 700, color: config.color }}>{config.label}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{s.summary}</p>
              
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: config.color }}>{Math.round(s.probability * 100)}%</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Probability</div>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.regret_probability > 0.5 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                    {Math.round(s.regret_probability * 100)}%
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Regret Risk</div>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Key Outcomes</div>
                {s.key_outcomes?.map((o, j) => (
                  <div key={j} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: config.color }}>→</span> {o}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Opportunities</div>
                {s.opportunities?.slice(0, 2).map((o, j) => (
                  <div key={j} style={{ fontSize: 13, color: 'var(--accent-green)', padding: '3px 0', display: 'flex', gap: 8 }}>
                    <span>✓</span> {o}
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Risks</div>
                {s.risks?.slice(0, 2).map((r, j) => (
                  <div key={j} style={{ fontSize: 13, color: 'var(--accent-red)', padding: '3px 0', display: 'flex', gap: 8 }}>
                    <span>!</span> {r}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
