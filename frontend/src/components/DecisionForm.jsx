import { useState } from 'react';

const CATEGORIES = [
  { value: 'career', label: '💼 Career' },
  { value: 'education', label: '🎓 Education' },
  { value: 'finance', label: '💰 Finance' },
  { value: 'habits', label: '🏃 Habits & Lifestyle' },
  { value: 'relationships', label: '❤️ Relationships' },
  { value: 'entrepreneurship', label: '🚀 Entrepreneurship' },
  { value: 'lifestyle', label: '🌍 Lifestyle' },
];

export default function DecisionForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    decision: '',
    category: 'career',
    context: '',
    current_situation: '',
    goals: '',
    time_horizon: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'time_horizon' ? parseInt(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ user_decision: form, generate_branches: true, num_branches: 3 });
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: 15,
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Decision */}
      <div>
        <label style={labelStyle}>Your Decision *</label>
        <textarea
          name="decision"
          value={form.decision}
          onChange={handleChange}
          placeholder="e.g., Should I quit my job to start my own business?"
          required
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}>Category *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Context & Current Situation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Context</label>
          <textarea
            name="context"
            value={form.context}
            onChange={handleChange}
            placeholder="Any relevant background info..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <div>
          <label style={labelStyle}>Current Situation</label>
          <textarea
            name="current_situation"
            value={form.current_situation}
            onChange={handleChange}
            placeholder="Where are you right now?"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Goals */}
      <div>
        <label style={labelStyle}>Your Goals & Aspirations</label>
        <input
          type="text"
          name="goals"
          value={form.goals}
          onChange={handleChange}
          placeholder="What are you hoping to achieve?"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Time Horizon */}
      <div>
        <label style={labelStyle}>Time Horizon: <span style={{ color: 'var(--accent-primary)' }}>{form.time_horizon} Years</span></label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>1yr</span>
          <input
            type="range"
            name="time_horizon"
            min={1}
            max={20}
            value={form.time_horizon}
            onChange={handleChange}
            style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>20yrs</span>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !form.decision.trim()}
        style={{ padding: '16px 32px', fontSize: 16, marginTop: 8 }}
      >
        {loading ? (
          <><div className="spinner" /> Simulating Your Future...</>
        ) : (
          <><span>🎬</span> Generate My Future</>
        )}
      </button>
    </form>
  );
}
