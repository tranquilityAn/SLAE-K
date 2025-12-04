import { determinant, validateLinearSystem } from './linalgUtils.js';

export const cramer = (A, B) => {
  validateLinearSystem(A, B);
  const detA = determinant(A);
  if (Math.abs(detA) < Number.EPSILON) {
    throw new Error('System determinant is zero; Cramer\'s rule cannot be applied');
  }

  const n = A.length;
  const solution = new Array(n).fill(0);

  for (let col = 0; col < n; col += 1) {
    const modified = A.map((row, i) => row.map((val, j) => (j === col ? B[i] : val)));
    solution[col] = determinant(modified) / detA;
  }

  return solution;
};

export default cramer;
