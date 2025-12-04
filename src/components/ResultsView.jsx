const formatVector = (vector) => vector.map((v) => Number.parseFloat(v.toFixed(6)));

const ResultsView = ({ result }) => {
  if (!result) return null;
  const { solution, iterations, validation } = result;

  return (
    <div className="section-card">
      <div className="flex-between">
        <h2>Results</h2>
        {validation && (
          <span className="badge" style={{ background: validation.valid ? '#dcfce7' : '#fee2e2', color: validation.valid ? '#166534' : '#991b1b' }}>
            {validation.valid ? 'Validated' : 'Check residuals'}
          </span>
        )}
      </div>
      <div className="stack">
        <div>
          <p className="label" style={{ marginBottom: '6px' }}>
            Solution vector X
          </p>
          <div className="code-pill">{JSON.stringify(formatVector(solution))}</div>
        </div>
        {Number.isInteger(iterations) && (
          <p className="method-hint" style={{ margin: 0 }}>
            Iterations: {iterations}
          </p>
        )}
        {validation && (
          <div className="stack">
            <p className="label" style={{ marginBottom: '6px' }}>Residual A·X - B</p>
            <div className="code-pill">{JSON.stringify(formatVector(validation.residual))}</div>
            <div className="residual-list">
              <div className="info-block">
                <strong>L2 norm</strong>
                <p className="method-hint" style={{ margin: 0 }}>{validation.norm.toExponential(6)}</p>
              </div>
              <div className="info-block">
                <strong>Status</strong>
                <p className="method-hint" style={{ margin: 0 }}>
                  {validation.valid ? 'Residual is within tolerance.' : 'Residual exceeds tolerance.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
