import { View, StyleSheet } from 'react-native'

export default function PieChart({ size = 220 }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]} />
  )
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#E5E7EB',
  },
})
