function normalizeAttendanceStatus(status) {
  if (status === 'PRESENT') return 'punctual';
  if (status === 'LATE') return 'late';
  if (status === 'ABSENCE') return 'absent';
  return 'unknown';
}
function calculateWeightedAverage(items, scale = 20, method = 'WEIGHTED') {
  const graded = (items || []).filter(item => item.grade !== null && item.grade !== undefined && Number.isFinite(Number(item.grade)) && Number(item.maxScore) > 0);
  if (!graded.length) return null;
  const total = graded.reduce((sum, item) => {
    const normalized = Number(item.grade) / Number(item.maxScore) * scale;
    const weight = method === 'WEIGHTED' ? Math.max(0, Number(item.weight) || 1) : 1;
    return sum + normalized * weight;
  }, 0);
  const divisor = graded.reduce((sum, item) => sum + (method === 'WEIGHTED' ? Math.max(0, Number(item.weight) || 1) : 1), 0);
  return divisor ? total / divisor : null;
}
function isValidAccessCode(code) { return /^[A-Z][0-9]{8}$/.test(String(code || '').trim().toUpperCase()); }
module.exports = { normalizeAttendanceStatus, calculateWeightedAverage, isValidAccessCode };
