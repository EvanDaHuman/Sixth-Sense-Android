import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

export default function Logo({ title }) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <View style={styles.center} />
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.blue,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.black,
  },
})
