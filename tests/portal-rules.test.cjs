const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeAttendanceStatus, calculateWeightedAverage, isValidAccessCode } = require('../src/utils/portalRules.cjs');

test('a missing attendance event is not classified as an absence', () => {
  assert.equal(normalizeAttendanceStatus(null), 'unknown');
  assert.equal(normalizeAttendanceStatus('UNKNOWN'), 'unknown');
});
test('only an explicit ABSENCE event is a recorded absence', () => {
  assert.equal(normalizeAttendanceStatus('ABSENCE'), 'absent');
  assert.equal(normalizeAttendanceStatus('PRESENT'), 'punctual');
  assert.equal(normalizeAttendanceStatus('LATE'), 'late');
});
test('weighted averages normalize assessment scales before applying weights', () => {
  const value = calculateWeightedAverage([{ grade: 18, maxScore: 20, weight: 2 }, { grade: 10, maxScore: 10, weight: 1 }], 20);
  assert.equal(value, 18.666666666666668);
});
test('simple average ignores assessment weights', () => {
  const value = calculateWeightedAverage([{ grade: 18, maxScore: 20, weight: 2 }, { grade: 10, maxScore: 10, weight: 1 }], 20, 'SIMPLE');
  assert.equal(value, 19);
});
test('access codes require one uppercase letter and eight digits', () => {
  assert.equal(isValidAccessCode('a12345678'), true);
  assert.equal(isValidAccessCode('A1234'), false);
  assert.equal(isValidAccessCode('A1234567X'), false);
});
