const MatrixInput = ({ size, onSizeChange, matrixValues, vectorValues, onMatrixChange, onVectorChange }) => {
  const renderMatrixGrid = () => (
    <div className="stack">
      <span className="label">Matrix A</span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, minmax(72px, 110px))`,
          gap: '8px',
          maxWidth: 'fit-content',
        }}
      >
        {Array.from({ length: size }).map((_, row) =>
          Array.from({ length: size }).map((_, col) => (
            <input
              key={`${row}-${col}`}
              className="input compact-input no-spinner"
              type="number"
              step="any"
              value={matrixValues[row]?.[col] ?? ''}
              onChange={(e) => onMatrixChange(row, col, e.target.value)}
            />
          )),
        )}
      </div>
    </div>
  );

  const renderVectorInput = () => (
    <div className="stack">
      <span className="label">Vector B</span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(size, 5)}, minmax(96px, 120px))`,
          gap: '8px',
          maxWidth: 'fit-content',
        }}
      >
        {Array.from({ length: size }).map((_, idx) => (
          <input
            key={idx}
            className="input compact-input no-spinner"
            type="number"
            step="any"
            value={vectorValues[idx] ?? ''}
            onChange={(e) => onVectorChange(idx, e.target.value)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="section-card">
      <div className="flex-between">
        <div>
          <h2>Manual input</h2>
          <p className="method-hint">Enter the system size, coefficients matrix, and free terms.</p>
        </div>
        <div className="stack" style={{ width: '160px' }}>
          <label className="label" htmlFor="matrix-size">
            Dimension (n)
          </label>
          <input
            id="matrix-size"
            className="input"
            type="number"
            min="1"
            max="10"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
          />
          <p className="method-hint" style={{ margin: 0 }}>Max size: 10 × 10</p>
        </div>
      </div>
      <div className="stack" style={{ marginTop: '12px' }}>
        {renderMatrixGrid()}
        {renderVectorInput()}
      </div>
    </div>
  );
};

export default MatrixInput;
