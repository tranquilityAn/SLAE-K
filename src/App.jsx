import './App.css'
import SolverPage from './pages/SolverPage'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>SLAE Solver</h1>
          <p className="subtitle">Solve linear systems with Gauss, Gauss-Jordan, Cramer, Jacobi and Seidel methods.</p>
        </div>
      </header>
      <main>
        <SolverPage />
      </main>
    </div>
  )
}

export default App
