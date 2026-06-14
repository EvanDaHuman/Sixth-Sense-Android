export const Colors = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#22C55E',
  blue: '#3B82F6',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
}

export function riskColor(score) {
  if (score >= 7) return Colors.high
  if (score >= 4) return Colors.medium
  return Colors.low
}

export function riskLabel(score) {
  if (score >= 7) return 'High Risk'
  if (score >= 4) return 'Medium Risk'
  return 'Low Risk'
}
