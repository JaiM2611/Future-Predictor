import { useState } from 'react';
import { runWhatIf } from '../services/api';

export default function WhatIfPanel({ simulationId, originalDecision }) {
  const [modifiedDecision, setModifiedDecision] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!modifiedDecision.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await runWhatIf({
        original_simulation_id: simulationId,
        original_decision: originalDecision,
        modified_decision: modifiedDecision,
        modification_context: context || null,
      });
      setResult(res);
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to run what-if analysis');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontSize: 15,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>🔁</span>
        <div>
          <h3 style={{ fontSize: 20 }}>What-If Analysis</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Modify your decision and see how your future changes</p>
        </div>
      </div>

      {/* Original Decision */}
      <div className="card" style={{ border: '1px solid var(--border-light)' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Original Decision</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{originalDecision?.decision}</p>
      </div>

      {/* Modified Decision Input */}
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          What if instead...
        </label>
        <textarea
          value={modifiedDecision}
          onChange={e => setModifiedDecision(e.target.value)}
          placeholder="e.g., What if I stayed at my job but started a side project first?"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Additional Context (Optional)
        </label>
        <input
          type="text"
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="Any changes in circumstances..."
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleAnalyze}
        disabled={loading || !modifiedDecision.trim()}
        style={{ alignSelf: 'flex-start', padding: '12px 28px' }}
      >
        {loading ? <><div className="spinner" /> Analyzing...</> : '🔁 Run What-If Analysis'}
      </button>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: 'var(--accent-red)', fontSize: 14 }}>
          {error}
        </div>
      )}

      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ borderTop: '3px solid var(--accent-primary)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Original Path</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.original_summary}</p>
            </div>
            <div className="card" style={{ borderTop: '3px solid var(--accent-secondary)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Modified Path</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.modified_summary}</p>
            </div>
          </div>

          {/* Differences */}
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12 }}>Key Differences</div>
            {result.key_differences?.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', padding: '6px 0', borderBottom: i < result.key_differences.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--accent-gold)' }}>△</span> {d}
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="card" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent-primary)', marginBottom: 8 }}>💡 Recommendation</div>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 }}>{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
