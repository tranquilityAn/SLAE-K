import './App.css'
import SolverPage from './pages/SolverPage'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Numerical methods lab</p>
          <h1>SLAE Solver</h1>
          <p className="subtitle">Solve linear systems with Gaussian elimination, Cramer, Jacobi, and more.</p>
        </div>
      </header>
      <main>
        <SolverPage />
      </main>
    </div>
  )
}

export default App
