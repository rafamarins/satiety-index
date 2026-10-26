export function monthlyPayment(principal, annualRate, years) {
  if (![principal, annualRate, years].every(Number.isFinite) || principal < 0 || annualRate < 0 || years <= 0) throw new RangeError('Use a non-negative loan and rate, and a positive term.');
  const months = years * 12;
  const rate = annualRate / 1200;
  return rate === 0 ? principal / months : principal * rate / (1 - (1 + rate) ** -months);
}
