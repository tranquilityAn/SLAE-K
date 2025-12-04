const validateMatrixDimensions = (A, B) => {
  if (!Array.isArray(A) || !Array.isArray(B)) {
    throw new Error('Coefficient matrix and free terms vector must be arrays');
  }

  const rows = A.length;
  if (rows === 0) {
    throw new Error('Coefficient matrix cannot be empty');
  }

  const cols = A[0].length;
  if (!A.every((row) => Array.isArray(row) && row.length === cols)) {
    throw new Error('Coefficient matrix must be rectangular');
  }

  if (rows !== cols) {
    throw new Error('Coefficient matrix must be square');
  }

  if (B.length !== rows) {
    throw new Error('Free terms vector length must match matrix size');
  }
};

export const copyMatrix = (matrix) => matrix.map((row) => [...row]);

export const determinant = (matrix) => {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error('Matrix must be a non-empty array');
  }

  if (!matrix.every((row) => Array.isArray(row) && row.length === matrix.length)) {
    throw new Error('Determinant requires a square matrix');
  }

  const n = matrix.length;
  const m = copyMatrix(matrix);
  let det = 1;
  let swapCount = 0;

  for (let i = 0; i < n; i += 1) {
    let pivot = i;
    for (let r = i + 1; r < n; r += 1) {
      if (Math.abs(m[r][i]) > Math.abs(m[pivot][i])) {
        pivot = r;
      }
    }

    if (Math.abs(m[pivot][i]) < Number.EPSILON) {
      return 0;
    }

    if (pivot !== i) {
      [m[i], m[pivot]] = [m[pivot], m[i]];
      swapCount += 1;
    }

    const pivotVal = m[i][i];
    det *= pivotVal;

    for (let r = i + 1; r < n; r += 1) {
      const factor = m[r][i] / pivotVal;
      for (let c = i; c < n; c += 1) {
        m[r][c] -= factor * m[i][c];
      }
    }
  }

  return swapCount % 2 === 0 ? det : -det;
};

export const vectorNorm = (vector) => {
  if (!Array.isArray(vector)) {
    throw new Error('Vector must be an array');
  }
  return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
};

export const multiplyMatrixVector = (A, x) => {
  if (!Array.isArray(A) || !Array.isArray(x)) {
    throw new Error('Matrix and vector must be arrays');
  }
  return A.map((row) => {
    if (row.length !== x.length) {
      throw new Error('Matrix column count must equal vector length');
    }
    return row.reduce((sum, val, idx) => sum + val * x[idx], 0);
  });
};

export const buildAugmentedMatrix = (A, B) => {
  validateMatrixDimensions(A, B);
  return A.map((row, i) => [...row, B[i]]);
};

export const tryMakeDiagonallyDominant = (A, B) => {
  validateMatrixDimensions(A, B);
  const n = A.length;
  const matrix = copyMatrix(A);
  const vector = [...B];

  for (let i = 0; i < n; i += 1) {
    let maxRow = i;
    let maxVal = Math.abs(matrix[i][i]);

    for (let r = i + 1; r < n; r += 1) {
      if (Math.abs(matrix[r][i]) > maxVal) {
        maxVal = Math.abs(matrix[r][i]);
        maxRow = r;
      }
    }

    const rowSum = matrix[i].reduce((acc, val) => acc + Math.abs(val), 0) - Math.abs(matrix[i][i]);
    if (Math.abs(matrix[i][i]) < rowSum && maxRow !== i) {
      [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
      [vector[i], vector[maxRow]] = [vector[maxRow], vector[i]];
    }
  }

  const isDominant = matrix.every((row, idx) => {
    const diag = Math.abs(row[idx]);
    const others = row.reduce((acc, val, j) => (j === idx ? acc : acc + Math.abs(val)), 0);
    return diag >= others;
  });

  return isDominant ? { matrix, vector } : { matrix: A, vector: B };
};

export const validateLinearSystem = (A, B) => validateMatrixDimensions(A, B);
