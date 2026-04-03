import { useState } from 'react';

const TONE_COLORS = {
  hopeful: '#10b981',
  anxious: '#f59e0b',
  triumphant: '#6366f1',
  reflective: '#94a3b8',
  determined: '#3b82f6',
  struggling: '#ef4444',
};

export default function DocumentaryView({ scenario }) {
  const [activeScene, setActiveScene] = useState(0);
  if (!scenario) return null;
  const scenes = scenario.scenes || [];
  const currentScene = scenes[activeScene];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div className="badge badge-blue" style={{ marginBottom: 12 }}>🎬 Documentary</div>
        <h2 style={{ fontSize: 28, marginBottom: 8 }}>{scenario.title}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>{scenario.summary}</p>
      </div>

      {/* Scene selector timeline */}
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', padding: '8px 0' }}>
        {scenes.map((scene, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 80 }}>
            <button
              onClick={() => setActiveScene(i)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                background: 'none', padding: '8px 4px', width: '100%',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: i === activeScene ? 'var(--accent-primary)' : 'var(--bg-card)',
                border: i <= activeScene ? '2px solid var(--accent-primary)' : '2px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: i === activeScene ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>
                {scene.year}
              </div>
              <span style={{ fontSize: 11, color: i === activeScene ? 'var(--accent-primary)' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                Yr {scene.year}
              </span>
            </button>
            {i < scenes.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < activeScene ? 'var(--accent-primary)' : 'var(--border)', transition: 'background 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      {/* Current Scene */}
      {currentScene && (
        <div className="card animate-fade-in" key={activeScene} style={{ border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Year {currentScene.year}
                </span>
                <span style={{ fontSize: 12, background: `${TONE_COLORS[currentScene.emotional_tone] || '#6366f1'}22`, color: TONE_COLORS[currentScene.emotional_tone] || '#6366f1', padding: '2px 10px', borderRadius: 100, fontWeight: 600 }}>
                  {currentScene.emotional_tone}
                </span>
              </div>
              <h3 style={{ fontSize: 22, color: 'var(--text-primary)' }}>{currentScene.title}</h3>
            </div>
            <span style={{ fontSize: 40, opacity: 0.5 }}>🎬</span>
          </div>
          
          {/* Narrative */}
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 10, padding: '20px 24px',
            borderLeft: `4px solid var(--accent-primary)`, marginBottom: 20,
          }}>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text-primary)', fontStyle: 'italic' }}>
              &ldquo;{currentScene.narrative}&rdquo;
            </p>
          </div>

          {/* Key Events */}
          {currentScene.key_events?.length > 0 && (
            <div>
              <h4 style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Key Events</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {currentScene.key_events.map((evt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-gold)', marginTop: 1 }}>★</span>
                    {evt}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveScene(Math.max(0, activeScene - 1))}
          disabled={activeScene === 0}
        >
          ← Previous
        </button>
        <span style={{ fontSize: 14, color: 'var(--text-muted)', alignSelf: 'center' }}>
          Scene {activeScene + 1} of {scenes.length}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveScene(Math.min(scenes.length - 1, activeScene + 1))}
          disabled={activeScene === scenes.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
