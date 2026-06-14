import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import Logo from '../components/Logo'
import RiskBadge from '../components/RiskBadge'
import { Colors, riskColor, riskLabel } from '../constants/colors'

export default function AlertDetailScreen({ navigation, route }) {
  const alert = route?.params?.alert ?? {
    location: 'Kitchen',
    type: 'Fire detected',
    score: 9,
    time: 'Now',
    description: 'Rapid motion and audio spike detected. AI analysis indicates high probability of conflict.',
  }

  const color = riskColor(alert.score)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoRow}>
          <Logo title="Alert" />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.location}>{alert.location}</Text>
              <Text style={styles.type}>{alert.type}</Text>
            </View>
            <Text style={styles.time}>{alert.time}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.riskRow}>
            <RiskBadge score={alert.score} size={48} />
            <Text style={[styles.riskLabel, { color }]}>{riskLabel(alert.score)}</Text>
          </View>

          <View style={styles.descriptionBlock}>
            <Text style={styles.bullet}>• {alert.description}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { padding: 24, paddingTop: 12 },
  logoRow: { alignItems: 'center', marginBottom: 32 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  location: { fontSize: 20, fontWeight: '700', color: Colors.black },
  type: { fontSize: 14, color: Colors.gray, marginTop: 2 },
  time: { fontSize: 14, color: Colors.gray },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 16 },
  riskRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  riskLabel: { fontSize: 26, fontWeight: '700' },
  descriptionBlock: { marginTop: 4 },
  bullet: { fontSize: 15, color: Colors.black, lineHeight: 22 },
  dismissBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dismissText: { fontSize: 16, fontWeight: '500', color: Colors.black },
})
