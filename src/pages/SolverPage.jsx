import { useMemo, useState } from 'react'
import MethodSelector from '../components/MethodSelector'
import MatrixInput from '../components/MatrixInput'
import FileLoader from '../components/FileLoader'
import MethodSettings from '../components/MethodSettings'
import ResultsView from '../components/ResultsView'
import ValidationMessages from '../components/ValidationMessages'
import { gauss } from '../algorithms/gauss'
import { gaussJordan } from '../algorithms/gaussJordan'
import { cramer } from '../algorithms/cramer'
import { jacobi } from '../algorithms/jacobi'
import { seidel } from '../algorithms/seidel'
import { checkSolution } from '../algorithms/checkSolution'

const MAX_SIZE = 10

const createMatrix = (n) => Array.from({ length: n }, () => Array.from({ length: n }, () => ''))
const createVector = (n) => Array.from({ length: n }, () => '')

const clampSize = (value) => {
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return 1
  return Math.min(Math.max(parsed, 1), MAX_SIZE)
}

const SolverPage = () => {
  const [method, setMethod] = useState('gauss')
  const [inputMode, setInputMode] = useState('manual')
  const [size, setSize] = useState(3)
  const [matrixValues, setMatrixValues] = useState(createMatrix(3))
  const [vectorValues, setVectorValues] = useState(createVector(3))
  const [iterSettings, setIterSettings] = useState({ eps: '0.000001', maxIter: '500', initialGuess: createVector(3) })
  const [fileData, setFileData] = useState(null)
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])
  const [result, setResult] = useState(null)

  const handleSizeChange = (value) => {
    const newSize = clampSize(value)
    setSize(newSize)
    setMatrixValues((prev) => {
      const next = createMatrix(newSize)
      for (let i = 0; i < Math.min(prev.length, newSize); i += 1) {
        for (let j = 0; j < Math.min(prev[i].length, newSize); j += 1) {
          next[i][j] = prev[i][j]
        }
      }
      return next
    })
    setVectorValues((prev) => {
      const next = createVector(newSize)
      for (let i = 0; i < Math.min(prev.length, newSize); i += 1) {
        next[i] = prev[i]
      }
      return next
    })
    setIterSettings((prev) => ({
      ...prev,
      initialGuess: createVector(newSize),
    }))
    setWarnings([])
    setErrors([])
    setResult(null)
  }

  const handleMatrixChange = (row, col, value) => {
    setMatrixValues((prev) => {
      const next = prev.map((r) => [...r])
      next[row][col] = value
      return next
    })
  }

  const handleVectorChange = (idx, value) => {
    setVectorValues((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  const parseManualSystem = () => {
    const n = size
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error('Matrix dimension must be a positive integer.')
    }
    if (n > MAX_SIZE) {
      throw new Error(`Matrix dimension must not exceed ${MAX_SIZE}.`)
    }

    const A = matrixValues.map((row, i) => {
      if (row.length < n) {
        throw new Error(`Row ${i + 1} of matrix A is incomplete.`)
      }
      const parsedRow = row.slice(0, n).map((val) => Number.parseFloat(val))
      if (parsedRow.some((num) => Number.isNaN(num))) {
        throw new Error('All entries in matrix A must be numeric.')
      }
      return parsedRow
    })

    if (A.length !== n) {
      throw new Error('Matrix A must have n rows.')
    }

    const B = vectorValues.slice(0, n).map((val) => Number.parseFloat(val))
    if (B.length !== n || B.some((num) => Number.isNaN(num))) {
      throw new Error('Vector B must have n numeric values.')
    }

    return { n, A, B }
  }

  const buildIterativeOptions = (n) => {
    const eps = Number.parseFloat(iterSettings.eps)
    if (Number.isNaN(eps) || eps <= 0) {
      throw new Error('Epsilon must be a positive number.')
    }

    const maxIter = Number.parseInt(iterSettings.maxIter, 10)
    if (!Number.isInteger(maxIter) || maxIter <= 0) {
      throw new Error('Max iterations must be a positive integer.')
    }

    const hasGuess = iterSettings.initialGuess.some((v) => v !== '' && v !== undefined)
    let initialGuess
    if (hasGuess) {
      initialGuess = iterSettings.initialGuess.slice(0, n).map((val, idx) => {
        const num = Number.parseFloat(val)
        if (Number.isNaN(num)) {
          throw new Error(`Initial guess entry ${idx + 1} must be numeric.`)
        }
        return num
      })
      if (initialGuess.length !== n) {
        throw new Error('Initial guess must have n values.')
      }
    }

    return { eps, maxIter, initialGuess }
  }

  const handleSolve = () => {
    setErrors([])
    setWarnings([])
    setResult(null)
    try {
      let system
      if (inputMode === 'manual') {
        system = parseManualSystem()
      } else {
        if (!fileData) {
          throw new Error('Load a file before solving.')
        }
        system = { n: fileData.n, A: fileData.matrix, B: fileData.vector }
      }

      if (method === 'cramer' && system.n > 4) {
        throw new Error("Cramer's rule supports systems up to 4 × 4.")
      }

      let solution
      let iterations
      switch (method) {
        case 'gauss':
          solution = gauss(system.A, system.B)
          break
        case 'gaussJordan':
          solution = gaussJordan(system.A, system.B)
          break
        case 'cramer':
          solution = cramer(system.A, system.B)
          break
        case 'jacobi': {
          const options = buildIterativeOptions(system.n)
          const res = jacobi(system.A, system.B, options)
          solution = res.solution
          iterations = res.iterations
          break
        }
        case 'seidel': {
          const options = buildIterativeOptions(system.n)
          const res = seidel(system.A, system.B, options)
          solution = res.solution
          iterations = res.iterations
          break
        }
        default:
          throw new Error('Select a method to proceed.')
      }

      const validation = checkSolution(system.A, system.B, solution)
      setResult({ solution, iterations, validation })
    } catch (err) {
      setErrors([err.message])
    }
  }

  const handleInputModeChange = (mode) => {
    setInputMode(mode)
    setErrors([])
    setWarnings([])
    setResult(null)
  }

  const handleFileLoad = (data) => {
    setFileData(data)
    setSize(data.n)
    setMatrixValues(data.matrix.map((row) => row.map((v) => v.toString())))
    setVectorValues(data.vector.map((v) => v.toString()))
    setIterSettings((prev) => ({ ...prev, initialGuess: createVector(data.n) }))
    setResult(null)
  }

  const handleFileError = (message) => {
    setFileData(null)
    if (message) {
      setErrors([message])
    }
  }

  const disableSolve = useMemo(() => {
    if (inputMode === 'file' && !fileData) return true
    return false
  }, [inputMode, fileData])

  return (
    <div className="stack">
      <MethodSelector selected={method} onChange={setMethod} />

      <div className="section-card">
        <div className="flex-between">
          <h2>Data source</h2>
          <div className="tabs" role="tablist" aria-label="Input mode">
            <button className={`tab ${inputMode === 'manual' ? 'active' : ''}`} type="button" onClick={() => handleInputModeChange('manual')}>
              Manual entry
            </button>
            <button className={`tab ${inputMode === 'file' ? 'active' : ''}`} type="button" onClick={() => handleInputModeChange('file')}>
              From file
            </button>
          </div>
        </div>
        <p className="method-hint" style={{ marginBottom: 0 }}>
          Switch between manual form inputs and loading a formatted text file. Errors and results are cleared when you switch.
        </p>
      </div>

      {inputMode === 'manual' ? (
        <MatrixInput
          size={size}
          onSizeChange={handleSizeChange}
          matrixValues={matrixValues}
          vectorValues={vectorValues}
          onMatrixChange={handleMatrixChange}
          onVectorChange={handleVectorChange}
        />
      ) : (
        <FileLoader onLoad={handleFileLoad} onError={handleFileError} maxSize={MAX_SIZE} />
      )}

      <MethodSettings method={method} size={size} settings={iterSettings} onChange={setIterSettings} />

      <div className="section-card">
        <div className="flex-between">
          <div>
            <h2>Solve</h2>
            <p className="method-hint" style={{ margin: 0 }}>
              Validate inputs, run the selected algorithm, and verify the residual.
            </p>
          </div>
          <button className="button" type="button" onClick={handleSolve} disabled={disableSolve}>
            Solve system
          </button>
        </div>
      </div>

      <ValidationMessages errors={errors} warnings={warnings} />
      <ResultsView result={result} />
    </div>
  )
}

export default SolverPage
