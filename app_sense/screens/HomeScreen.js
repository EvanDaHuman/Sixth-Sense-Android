import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import Logo from '../components/Logo'
import PieChart from '../components/PieChart'
import { Colors } from '../constants/colors'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning.'
  if (h < 17) return 'Good afternoon.'
  return 'Good evening.'
}

export default function HomeScreen({ navigation, alerts = [] }) {
  const unread = alerts.filter(a => !a.read).length
  const high = alerts.filter(a => a.score >= 7).length
  const medium = alerts.filter(a => a.score >= 4 && a.score < 7).length
  const low = alerts.filter(a => a.score < 4).length

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoRow}>
          <Logo title="Home" />
        </View>

        <Text style={styles.greeting}>{greeting()}</Text>

        {/* Unread alerts card */}
        <View style={styles.card}>
          <View style={styles.blueLine} />
          <Text style={styles.cardLabel}>{unread} unread alert{unread !== 1 ? 's' : ''}</Text>
          <TouchableOpacity
            style={styles.blackBtn}
            onPress={() => navigation.navigate('Activity')}
          >
            <Text style={styles.blackBtnText}>Check</Text>
          </TouchableOpacity>
        </View>

        {/* Pie chart */}
        <View style={styles.chartCard}>
          <PieChart high={high} medium={medium} low={low} size={220} />
          <View style={styles.legend}>
            {[['High', Colors.high], ['Medium', Colors.medium], ['Low', Colors.low]].map(([l, c]) => (
              <View key={l} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: c }]} />
                <Text style={styles.legendText}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* This month's stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This month's stats</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Overview')}>
            <Text style={styles.viewLink}>View</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { padding: 24, paddingTop: 12 },
  logoRow: { alignItems: 'center', marginBottom: 32 },
  greeting: { fontSize: 40, fontWeight: '700', color: Colors.black, marginBottom: 24 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
  },
  blueLine: {
    width: 36,
    height: 3,
    backgroundColor: Colors.blue,
    borderRadius: 2,
    marginBottom: 10,
  },
  cardLabel: { fontSize: 18, fontWeight: '500', color: Colors.black, marginBottom: 16 },
  blackBtn: {
    backgroundColor: Colors.black,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
  },
  blackBtnText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  legend: { flexDirection: 'row', gap: 20, marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: Colors.gray },
  cardTitle: { fontSize: 16, fontWeight: '600', color: Colors.black, marginBottom: 8 },
  viewLink: { fontSize: 14, color: Colors.blue, fontWeight: '500' },
})
