import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DecisionForm from '../components/DecisionForm';
import { runSimulation } from '../services/api';

const LOADING_STEPS = [
  'Analyzing your decision...',
  'Simulating future scenarios...',
  'Generating documentary narratives...',
  'Building decision branches...',
  'Calculating risk analysis...',
  'Finalizing your future story...',
];

export default function SimulationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % LOADING_STEPS.length;
      setLoadingStep(step);
    }, 2000);

    try {
      const result = await runSimulation(formData);
      clearInterval(interval);
      navigate(`/results/${result.simulation_id}`, { state: { simulation: result } });
    } catch (e) {
      clearInterval(interval);
      const msg = e.response?.data?.detail || 'Failed to run simulation. Make sure the API server is running with a valid API key.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '48px 24px', maxWidth: 760 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div className="badge badge-blue" style={{ marginBottom: 12 }}>Step 1 of 1</div>
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>Describe Your Decision</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.7 }}>
            Tell us about the decision you&apos;re facing. The more context you provide, the more accurate and personalized your future simulation will be.
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: 32 }}>
          <DecisionForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Loading overlay */}
        {loading && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.85)',
            backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', zIndex: 200,
          }}>
            <div style={{ textAlign: 'center', maxWidth: 400 }}>
              <div style={{ fontSize: 56, marginBottom: 24, animation: 'pulse 2s infinite' }}>🎬</div>
              <h2 style={{ fontSize: 26, marginBottom: 16 }}>Crafting Your Story</h2>
              <p style={{ color: 'var(--accent-primary)', fontSize: 16, marginBottom: 32, minHeight: 24 }}>
                {LOADING_STEPS[loadingStep]}
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {LOADING_STEPS.map((_, i) => (
                  <div key={i} style={{
                    width: i === loadingStep ? 24 : 8, height: 8,
                    borderRadius: 4, transition: 'all 0.3s',
                    background: i <= loadingStep ? 'var(--accent-primary)' : 'var(--border)',
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 24, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 20px', color: 'var(--accent-red)' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}
