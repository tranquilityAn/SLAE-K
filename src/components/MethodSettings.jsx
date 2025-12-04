const MethodSettings = ({ method, settings, onChange }) => {
  const isIterative = method === 'jacobi' || method === 'seidel';

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
          <span className="label">Epsilon exponent (10^k)</span>
          <div className="stack" style={{ gap: '6px' }}>
            <input
              className="input range"
              type="range"
              min="-14"
              max="-1"
              step="1"
              value={settings.epsExp}
              onChange={(e) => onChange({ ...settings, epsExp: e.target.value })}
            />
            <div className="flex-between" style={{ color: '#475569', fontSize: '14px' }}>
              <span>10^-14</span>
              <strong style={{ color: '#0f172a' }}>10^{settings.epsExp}</strong>
              <span>10^-1</span>
            </div>
            <p className="method-hint" style={{ margin: 0 }}>
              Stops when ||Δx|| &lt; 10^{settings.epsExp} ({(10 ** settings.epsExp).toExponential()}).
            </p>
          </div>
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
    </div>
  );
};

export default MethodSettings;
