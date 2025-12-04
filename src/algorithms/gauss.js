import { buildAugmentedMatrix, copyMatrix, validateLinearSystem } from './linalgUtils.js';

const forwardElimination = (augmented) => {
  const n = augmented.length;
  for (let i = 0; i < n - 1; i += 1) {
    let pivotRow = i;
    for (let r = i + 1; r < n; r += 1) {
      if (Math.abs(augmented[r][i]) > Math.abs(augmented[pivotRow][i])) {
        pivotRow = r;
      }
    }

    if (Math.abs(augmented[pivotRow][i]) < Number.EPSILON) {
      throw new Error('Matrix is singular or nearly singular');
    }

    if (pivotRow !== i) {
      [augmented[i], augmented[pivotRow]] = [augmented[pivotRow], augmented[i]];
    }

    for (let r = i + 1; r < n; r += 1) {
      const factor = augmented[r][i] / augmented[i][i];
      for (let c = i; c <= n; c += 1) {
        augmented[r][c] -= factor * augmented[i][c];
      }
    }
  }
};

const backSubstitution = (augmented) => {
  const n = augmented.length;
  const solution = new Array(n).fill(0);

  for (let i = n - 1; i >= 0; i -= 1) {
    let sum = augmented[i][n];
    for (let j = i + 1; j < n; j += 1) {
      sum -= augmented[i][j] * solution[j];
    }

    if (Math.abs(augmented[i][i]) < Number.EPSILON) {
      throw new Error('Zero pivot encountered during back substitution');
    }

    solution[i] = sum / augmented[i][i];
  }

  return solution;
};

export const gauss = (A, B) => {
  validateLinearSystem(A, B);
  const augmented = buildAugmentedMatrix(copyMatrix(A), [...B]);
  forwardElimination(augmented);
  return backSubstitution(augmented);
};

export default gauss;
