const methods = [
  { value: 'gauss', label: 'Gaussian elimination' },
  { value: 'gaussJordan', label: 'Gauss-Jordan' },
  { value: 'cramer', label: "Cramer's rule" },
  { value: 'jacobi', label: 'Jacobi (iterative)' },
  { value: 'seidel', label: 'Gauss-Seidel (iterative)' },
];

const methodHints = {
  cramer: 'Best for small systems (n ≤ 4) with non-zero determinant.',
  gauss: 'Direct solver using forward elimination and back substitution.',
  gaussJordan: 'Reduces the augmented matrix to reduced row-echelon form.',
  jacobi: 'Iterative solver; requires diagonal dominance or good initial guess.',
  seidel: 'Iterative solver; often converges faster than Jacobi.',
};

const MethodSelector = ({ selected, onChange }) => (
  <div className="section-card">
    <div className="flex-between">
      <div>
        <h2>Method</h2>
        <p className="method-hint">Choose a solver for the current system.</p>
      </div>
      <span className="badge">5 methods</span>
    </div>
    <div className="table-grid" role="radiogroup" aria-label="Method selector">
      {methods.map((method) => (
        <label key={method.value} className="stack" style={{ margin: 0 }}>
          <div className="flex-between">
            <span className="label">{method.label}</span>
            <input
              type="radio"
              name="method"
              value={method.value}
              checked={selected === method.value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <p className="method-hint" style={{ marginTop: 0 }}>{methodHints[method.value]}</p>
        </label>
      ))}
    </div>
  </div>
);

export default MethodSelector;
