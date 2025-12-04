import { buildAugmentedMatrix, copyMatrix, validateLinearSystem } from './linalgUtils.js';

export const gaussJordan = (A, B) => {
  validateLinearSystem(A, B);
  const augmented = buildAugmentedMatrix(copyMatrix(A), [...B]);
  const n = augmented.length;

  for (let i = 0; i < n; i += 1) {
    let pivotRow = i;
    for (let r = i; r < n; r += 1) {
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

    const pivot = augmented[i][i];
    for (let c = i; c <= n; c += 1) {
      augmented[i][c] /= pivot;
    }

    for (let r = 0; r < n; r += 1) {
      if (r === i) continue;
      const factor = augmented[r][i];
      for (let c = i; c <= n; c += 1) {
        augmented[r][c] -= factor * augmented[i][c];
      }
    }
  }

  return augmented.map((row) => row[n]);
};

export default gaussJordan;
