const MethodSettings = ({ method, size, settings, onChange }) => {
  const isIterative = method === 'jacobi' || method === 'seidel';

  const handleInitialGuessChange = (idx, value) => {
    const next = [...settings.initialGuess];
    next[idx] = value;
    onChange({ ...settings, initialGuess: next });
  };

  if (!isIterative) {
    return (
      <div className="section-card">
        <div className="flex-between">
          <h2>Method settings</h2>
          <span className="badge">Auto</span>
        </div>
        <p className="method-hint" style={{ marginBottom: 0 }}>
          No additional parameters are required for this method.
        </p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="flex-between">
        <h2>Iterative parameters</h2>
        <span className="badge">Convergence</span>
      </div>
      <div className="controls-grid">
        <label className="stack">
          <span className="label">Epsilon (stop when ||Δx|| &lt; eps)</span>
          <input
            className="input"
            type="number"
            step="any"
            value={settings.eps}
            onChange={(e) => onChange({ ...settings, eps: e.target.value })}
          />
        </label>
        <label className="stack">
          <span className="label">Max iterations</span>
          <input
            className="input"
            type="number"
            min="1"
            value={settings.maxIter}
            onChange={(e) => onChange({ ...settings, maxIter: e.target.value })}
          />
        </label>
      </div>
      <div className="stack" style={{ marginTop: '12px' }}>
        <span className="label">Initial guess (optional)</span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(size, 5)}, minmax(96px, 1fr))`,
            gap: '8px',
          }}
        >
          {Array.from({ length: size }).map((_, idx) => (
            <input
              key={idx}
              className="input"
              type="number"
              step="any"
              value={settings.initialGuess[idx] ?? ''}
              onChange={(e) => handleInitialGuessChange(idx, e.target.value)}
            />
          ))}
        </div>
        <p className="method-hint" style={{ margin: 0 }}>
          Leave blank to start from the zero vector.
        </p>
      </div>
    </div>
  );
};

export default MethodSettings;
