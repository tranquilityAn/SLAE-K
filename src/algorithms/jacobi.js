import { tryMakeDiagonallyDominant, validateLinearSystem, vectorNorm } from './linalgUtils.js';

export const jacobi = (A, B, { eps = 1e-6, maxIter = 1000, initialGuess } = {}) => {
  validateLinearSystem(A, B);
  const { matrix, vector } = tryMakeDiagonallyDominant(A, B);
  const n = matrix.length;
  const x = initialGuess && Array.isArray(initialGuess) ? [...initialGuess] : new Array(n).fill(0);

  if (x.length !== n) {
    throw new Error('Initial guess vector length must match matrix size');
  }

  let iterations = 0;
  const newX = new Array(n).fill(0);

  while (iterations < maxIter) {
    for (let i = 0; i < n; i += 1) {
      let sum = vector[i];
      for (let j = 0; j < n; j += 1) {
        if (i !== j) {
          sum -= matrix[i][j] * x[j];
        }
      }

      if (Math.abs(matrix[i][i]) < Number.EPSILON) {
        throw new Error('Zero pivot encountered during Jacobi iteration');
      }

      newX[i] = sum / matrix[i][i];
    }

    const diff = newX.map((val, idx) => val - x[idx]);
    if (vectorNorm(diff) < eps) {
      return { solution: [...newX], iterations: iterations + 1 };
    }

    for (let i = 0; i < n; i += 1) {
      x[i] = newX[i];
    }

    iterations += 1;
  }

  return { solution: [...x], iterations };
};

export default jacobi;
