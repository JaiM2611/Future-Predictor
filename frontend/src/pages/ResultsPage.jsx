import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScenarioCard from '../components/ScenarioCard';
import DocumentaryView from '../components/DocumentaryView';
import BranchingTree from '../components/BranchingTree';
import ComparisonView from '../components/ComparisonView';
import WhatIfPanel from '../components/WhatIfPanel';
import { getSimulation } from '../services/api';

const TABS = [
  { id: 'scenarios', label: '🎬 Documentary', short: 'Documentary' },
  { id: 'comparison', label: '📊 Compare', short: 'Compare' },
  { id: 'branching', label: '🌳 Branches', short: 'Branches' },
  { id: 'whatif', label: '🔁 What-If', short: 'What-If' },
];

export default function ResultsPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState(state?.simulation || null);
  const [loading, setLoading] = useState(!state?.simulation);
  const [activeTab, setActiveTab] = useState('scenarios');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!simulation && id) {
      getSimulation(id)
        .then(data => {
          setSimulation(data);
          const probable = data.scenarios?.find(s => s.scenario_type === 'most_probable');
          setSelectedScenario(probable || data.scenarios?.[0] || null);
        })
        .catch(() => setError('Simulation not found.'))
        .finally(() => setLoading(false));
    } else if (simulation && !selectedScenario) {
      const probable = simulation.scenarios?.find(s => s.scenario_type === 'most_probable');
      setSelectedScenario(probable || simulation.scenarios?.[0] || null);
    }
  }, [id, simulation]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading simulation...</p>
        </div>
      </div>
    </div>
  );

  if (error || !simulation) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <h2 style={{ marginBottom: 8 }}>Simulation Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/simulate')}>Start New Simulation</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '40px 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/simulate')} style={{ marginBottom: 16, padding: '6px 0' }}>
            ← New Simulation
          </button>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Your Future Story</h1>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 18px', display: 'inline-block' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Decision: </span>
            <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>{simulation.user_decision?.decision}</span>
          </div>
        </div>

        {/* Analysis Summary */}
        {simulation.analysis_summary && (
          <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.04)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>🧠</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent-primary)', marginBottom: 6 }}>AI Analysis</div>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{simulation.analysis_summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation */}
        {simulation.recommended_path && (
          <div className="card" style={{ marginBottom: 32, border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent-gold)', marginBottom: 6 }}>Recommendation</div>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{simulation.recommended_path}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scenario Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
          {simulation.scenarios?.map((s, i) => (
            <ScenarioCard
              key={i}
              scenario={s}
              selected={selectedScenario?.scenario_type === s.scenario_type}
              onClick={() => {
                setSelectedScenario(s);
                setActiveTab('scenarios');
              }}
            />
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 32 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card" style={{ padding: 32 }}>
          {activeTab === 'scenarios' && (
            <DocumentaryView scenario={selectedScenario} />
          )}
          {activeTab === 'comparison' && (
            <ComparisonView scenarios={simulation.scenarios} />
          )}
          {activeTab === 'branching' && (
            <BranchingTree decisionTree={simulation.decision_tree} />
          )}
          {activeTab === 'whatif' && (
            <WhatIfPanel
              simulationId={simulation.simulation_id}
              originalDecision={simulation.user_decision}
            />
          )}
        </div>
      </div>
    </div>
  );
}
