import { View, Text, StyleSheet } from 'react-native'
import { riskColor } from '../constants/colors'

export default function RiskBadge({ score, size = 44 }) {
  const color = riskColor(score)
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
      <Text style={[styles.number, { color, fontSize: size * 0.38 }]}>{score}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  number: {
    fontWeight: '500',
  },
})
