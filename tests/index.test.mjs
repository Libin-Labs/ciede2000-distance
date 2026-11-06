import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('identical colors have zero difference', () => {
  assert.equal(api.deltaE2000({ L: 50, a: 2, b: -3 }, { L: 50, a: 2, b: -3 }), 0);
});
test('published pair one', () => {
  assert.ok(
    Math.abs(
      api.deltaE2000({ L: 50, a: 2.6772, b: -79.7751 }, { L: 50, a: 0, b: -82.7485 }) - 2.0425,
    ) < 0.0001,
  );
});
test('published pair two', () => {
  assert.ok(
    Math.abs(
      api.deltaE2000({ L: 50, a: 3.1571, b: -77.2803 }, { L: 50, a: 0, b: -82.7485 }) - 2.8615,
    ) < 0.0001,
  );
});
test('neutral chroma boundary is finite', () => {
  assert.ok(Number.isFinite(api.deltaE2000({ L: 20, a: 0, b: 0 }, { L: 80, a: 0, b: 0 })));
});
test('argument order is symmetric', () => {
  const a = { L: 40, a: 12, b: 18 },
    b = { L: 52, a: -3, b: 8 };
  assert.ok(Math.abs(api.deltaE2000(a, b) - api.deltaE2000(b, a)) < 1e-12);
});
test('nonfinite components are rejected', () => {
  assert.throws(() => api.deltaE2000({ L: NaN, a: 0, b: 0 }, { L: 0, a: 0, b: 0 }), TypeError);
});
