import { tryMakeDiagonallyDominant, validateLinearSystem, vectorNorm } from './linalgUtils.js';

export const seidel = (A, B, { eps = 1e-6, maxIter = 1000, initialGuess } = {}) => {
  validateLinearSystem(A, B);
  const { matrix, vector } = tryMakeDiagonallyDominant(A, B);
  const n = matrix.length;
  const x = initialGuess && Array.isArray(initialGuess) ? [...initialGuess] : new Array(n).fill(0);

  if (x.length !== n) {
    throw new Error('Initial guess vector length must match matrix size');
  }

  let iterations = 0;

  while (iterations < maxIter) {
    const previous = [...x];

    for (let i = 0; i < n; i += 1) {
      let sum = vector[i];
      for (let j = 0; j < n; j += 1) {
        if (j !== i) {
          sum -= matrix[i][j] * x[j];
        }
      }

      if (Math.abs(matrix[i][i]) < Number.EPSILON) {
        throw new Error('Zero pivot encountered during Seidel iteration');
      }

      x[i] = sum / matrix[i][i];
    }

    const diff = x.map((val, idx) => val - previous[idx]);
    if (vectorNorm(diff) < eps) {
      return { solution: [...x], iterations: iterations + 1 };
    }

    iterations += 1;
  }

  return { solution: [...x], iterations };
};

export default seidel;
