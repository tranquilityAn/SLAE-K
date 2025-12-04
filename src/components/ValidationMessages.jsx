const ValidationMessages = ({ errors, warnings }) => {
  const hasErrors = errors && errors.length > 0;
  const hasWarnings = warnings && warnings.length > 0;

  if (!hasErrors && !hasWarnings) {
    return null;
  }

  return (
    <div className="section-card" style={{ borderColor: hasErrors ? '#ef4444' : '#eab308' }}>
      {hasErrors && (
        <div className="stack" style={{ marginBottom: hasWarnings ? '12px' : 0 }}>
          <div className="flex-between">
            <h2 style={{ margin: 0, color: '#991b1b' }}>Errors</h2>
            <span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>
              {errors.length} issue{errors.length > 1 ? 's' : ''}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#991b1b' }}>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      {hasWarnings && (
        <div className="stack">
          <div className="flex-between">
            <h2 style={{ margin: 0, color: '#92400e' }}>Warnings</h2>
            <span className="badge" style={{ background: '#fef9c3', color: '#92400e' }}>
              {warnings.length}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e' }}>
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationMessages;
