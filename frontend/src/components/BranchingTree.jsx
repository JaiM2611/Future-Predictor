export default function BranchingTree({ decisionTree }) {
  if (!decisionTree) return null;
  const { branches } = decisionTree;
  const rootBranches = branches.filter(b => !b.parent_id);
  const getChildren = (id) => branches.filter(b => b.parent_id === id);

  const BranchNode = ({ branch, depth = 0 }) => {
    const children = getChildren(branch.id);
    const isRoot = depth === 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{
          background: isRoot ? 'var(--bg-card)' : 'var(--bg-secondary)',
          border: `1px solid ${isRoot ? 'var(--accent-primary)' : 'var(--border)'}`,
          borderRadius: 10, padding: '14px 18px', minWidth: 220, maxWidth: 320,
          position: 'relative',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
            {branch.decision_point}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: isRoot ? 'var(--accent-primary)' : 'var(--text-primary)', marginBottom: 8 }}>
            {branch.choice}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {branch.consequence_summary}
          </div>
        </div>

        {children.length > 0 && (
          <div style={{ display: 'flex', paddingLeft: 24, marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {children.map(child => (
                <div key={child.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 8 }}>
                    <div style={{ width: 2, height: 20, background: 'var(--border)' }} />
                    <div style={{ width: 20, height: 2, background: 'var(--border)' }} />
                  </div>
                  <BranchNode branch={child} depth={depth + 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 24 }}>🌳</span>
        <div>
          <h3 style={{ fontSize: 20 }}>Decision Branching Tree</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Explore how each choice leads to different paths</p>
        </div>
      </div>
      
      {/* Root */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          borderRadius: 10, padding: '14px 24px', textAlign: 'center', maxWidth: 400,
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Your Decision</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{decisionTree.root_decision}</div>
        </div>
      </div>

      {/* Connector */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ width: 2, height: 32, background: 'var(--border)' }} />
      </div>

      {/* Branches */}
      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', minWidth: 'max-content' }}>
          {rootBranches.map(branch => (
            <BranchNode key={branch.id} branch={branch} depth={0} />
          ))}
        </div>
      </div>
    </div>
  );
}
