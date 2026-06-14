import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import Logo from '../components/Logo'
import RiskBadge from '../components/RiskBadge'
import { Colors } from '../constants/colors'

function timeAgo(date) {
  const mins = Math.floor((Date.now() - new Date(date)) / 60000)
  if (mins < 1) return 'Now'
  if (mins < 60) return `${mins} mins ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return 'Today'
}

function AlertRow({ alert, onPress, expanded }) {
  return (
    <TouchableOpacity style={styles.alertCard} onPress={() => onPress(alert)}>
      <View style={styles.alertLeft}>
        <RiskBadge score={alert.score} size={40} />
        <View style={styles.alertInfo}>
          <Text style={styles.alertTitle}>{alert.type}</Text>
          <Text style={styles.alertSub}>{alert.location}</Text>
        </View>
      </View>
      <View style={styles.alertRight}>
        <Text style={styles.alertTime}>{timeAgo(alert.date)}</Text>
        <Text style={styles.arrow}>↓</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function ActivityScreen({ navigation, alerts = [] }) {
  const [newExpanded, setNewExpanded] = useState(false)

  const newAlerts = alerts.filter(a => !a.read)
  const oldAlerts = alerts.filter(a => a.read)

  function openAlert(alert) {
    navigation.navigate('AlertDetail', { alert })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoRow}>
          <Logo />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.heading}>Activity</Text>
          <TouchableOpacity>
            <Text style={styles.filterIcon}>≡</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Recent / New Alerts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Recent</Text>
          {newExpanded && (
            <TouchableOpacity onPress={() => setNewExpanded(false)}>
              <Text style={styles.collapseText}>Collapse</Text>
            </TouchableOpacity>
          )}
        </View>

        {!newExpanded ? (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => setNewExpanded(true)}
          >
            <View style={styles.alertLeft}>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>{newAlerts.length}</Text>
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertTitle}>New Alerts</Text>
                <Text style={styles.alertSub}>
                  {newAlerts.map(a => a.location).join(', ') || 'None'}
                </Text>
              </View>
            </View>
            <View style={styles.alertRight}>
              <Text style={styles.alertTime}>Now</Text>
              <Text style={styles.arrow}>↓</Text>
            </View>
          </TouchableOpacity>
        ) : (
          newAlerts.map(alert => (
            <AlertRow key={alert.id} alert={alert} onPress={openAlert} />
          ))
        )}

        {/* Previous */}
        {oldAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Previous</Text>
            </View>
            {oldAlerts.map(alert => (
              <AlertRow key={alert.id} alert={alert} onPress={openAlert} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { padding: 24, paddingTop: 12 },
  logoRow: { alignItems: 'center', marginBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: { fontSize: 36, fontWeight: '700', color: Colors.black },
  filterIcon: { fontSize: 22, color: Colors.black },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: { fontSize: 14, color: Colors.gray },
  collapseText: { fontSize: 14, color: Colors.gray },
  alertCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  alertInfo: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  alertSub: { fontSize: 13, color: Colors.gray, marginTop: 2 },
  alertRight: { alignItems: 'flex-end', gap: 6 },
  alertTime: { fontSize: 13, color: Colors.gray },
  arrow: { fontSize: 16, color: Colors.black },
  newBadge: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.blue,
    alignItems: 'center', justifyContent: 'center',
  },
  newBadgeText: { fontSize: 16, fontWeight: '600', color: Colors.blue },
})
