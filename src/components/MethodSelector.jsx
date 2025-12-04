const methods = [
  { value: 'gauss', label: 'Gaussian elimination' },
  { value: 'gaussJordan', label: 'Gauss-Jordan' },
  { value: 'cramer', label: "Cramer's rule" },
  { value: 'jacobi', label: 'Jacobi (iterative)' },
  { value: 'seidel', label: 'Gauss-Seidel (iterative)' },
];

const MethodSelector = ({ selected, onChange }) => (
  <div className="section-card">
    <h2 style={{ marginBottom: '8px' }}>Method</h2>
    <div className="method-grid" role="radiogroup" aria-label="Method selector">
      {methods.map((method) => (
        <label key={method.value} className={`method-card ${selected === method.value ? 'selected' : ''}`}>
          <div className="flex-between" style={{ gap: '10px' }}>
            <input
              type="radio"
              name="method"
              value={method.value}
              checked={selected === method.value}
              onChange={(e) => onChange(e.target.value)}
            />
            <span className="label" style={{ marginBottom: 0 }}>{method.label}</span>
          </div>
        </label>
      ))}
    </div>
  </div>
);

export default MethodSelector;
