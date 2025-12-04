import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { cramer } from './cramer.js';
import { gauss } from './gauss.js';
import { gaussJordan } from './gaussJordan.js';
import { jacobi } from './jacobi.js';
import { seidel } from './seidel.js';
import { checkSolution } from './checkSolution.js';
import { determinant, multiplyMatrixVector } from './linalgUtils.js';

const approxEqual = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const approxArray = (actual, expected, tol = 1e-6) => {
  assert.equal(actual.length, expected.length);
  actual.forEach((val, idx) => {
    assert.ok(approxEqual(val, expected[idx], tol), `Index ${idx}: ${val} != ${expected[idx]}`);
  });
};

describe('direct solvers', () => {
  const A = [
    [2, 1],
    [5, 7],
  ];
  const B = [11, 13];
  const expected = [64 / 9, -29 / 9];

  it('solves with Cramer', () => {
    const solution = cramer(A, B);
    approxArray(solution, expected, 1e-9);
  });

  it('solves with Gaussian elimination', () => {
    const solution = gauss(A, B);
    approxArray(solution, expected, 1e-9);
  });

  it('solves with Gauss-Jordan elimination', () => {
    const solution = gaussJordan(A, B);
    approxArray(solution, expected, 1e-9);
  });
});

describe('iterative solvers', () => {
  const A = [
    [4, 1, 2],
    [3, 5, 1],
    [1, 1, 3],
  ];
  const B = [4, 7, 3];
  const expected = gauss(A, B);
  const tolerance = 1e-6;

  it('converges with Jacobi method', () => {
    const { solution, iterations } = jacobi(A, B, { eps: tolerance });
    assert.ok(iterations > 0, 'Jacobi should perform iterations');
    approxArray(solution, expected, 1e-4);
  });

  it('converges with Seidel method', () => {
    const { solution, iterations } = seidel(A, B, { eps: tolerance });
    assert.ok(iterations > 0, 'Seidel should perform iterations');
    approxArray(solution, expected, 1e-6);
  });
});

describe('utility functions', () => {
  it('computes determinant correctly', () => {
    const matrix = [
      [1, 2, 3],
      [0, 1, 4],
      [5, 6, 0],
    ];
    assert.ok(approxEqual(determinant(matrix), 1));
  });

  it('validates solution residuals', () => {
    const A = [
      [3, 2],
      [1, 4],
    ];
    const B = [18, 16];
    const X = gauss(A, B);
    const { valid, norm, residual } = checkSolution(A, B, X, 1e-8);

    assert.ok(valid, 'Expected solution to satisfy the system');
    assert.ok(norm < 1e-8, 'Residual norm should be small');
    const recomputed = multiplyMatrixVector(A, X);
    approxArray(recomputed, residual.map((r, idx) => B[idx] + r));
  });
});
