import { multiplyMatrixVector, validateLinearSystem, vectorNorm } from './linalgUtils.js';

export const checkSolution = (A, B, X, eps = 1e-6) => {
  validateLinearSystem(A, B);
  if (!Array.isArray(X) || X.length !== B.length) {
    throw new Error('Solution vector length must match system size');
  }

  const product = multiplyMatrixVector(A, X);
  const residual = product.map((val, idx) => val - B[idx]);
  const norm = vectorNorm(residual);
  return { valid: norm < eps, residual, norm };
};

export default checkSolution;
