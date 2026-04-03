const TYPE_CONFIG = {
  best_case: { label: 'Best Case', color: 'var(--accent-green)', badge: 'badge-green', emoji: '🌟' },
  worst_case: { label: 'Worst Case', color: 'var(--accent-red)', badge: 'badge-red', emoji: '⚠️' },
  most_probable: { label: 'Most Probable', color: 'var(--accent-primary)', badge: 'badge-blue', emoji: '🎯' },
};

export default function ScenarioCard({ scenario, onClick, selected }) {
  const config = TYPE_CONFIG[scenario.scenario_type] || TYPE_CONFIG.most_probable;
  return (
    <div
      onClick={onClick}
      className="card"
      style={{
        cursor: 'pointer',
        border: selected ? `2px solid ${config.color}` : '1px solid var(--border)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: config.color,
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{config.emoji}</span>
        <span className={`badge ${config.badge}`}>{config.label}</span>
      </div>
      <h3 style={{ fontSize: 17, marginBottom: 8, color: 'var(--text-primary)' }}>{scenario.title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
        {scenario.summary}
      </p>
      <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Probability </span>
          <span style={{ color: config.color, fontWeight: 700 }}>{Math.round(scenario.probability * 100)}%</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Regret Risk </span>
          <span style={{ color: scenario.regret_probability > 0.5 ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 700 }}>
            {Math.round(scenario.regret_probability * 100)}%
          </span>
        </div>
      </div>
      {scenario.key_outcomes?.length > 0 && (
        <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {scenario.key_outcomes.slice(0, 3).map((o, i) => (
            <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
              <span style={{ color: config.color }}>✓</span> {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
