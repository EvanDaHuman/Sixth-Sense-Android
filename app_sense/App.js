import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'

import HomeScreen from './screens/HomeScreen'
import ActivityScreen from './screens/ActivityScreen'
import ConflictOverviewScreen from './screens/ConflictOverviewScreen'
import AlertDetailScreen from './screens/AlertDetailScreen'
import { Colors } from './constants/colors'

const MOCK_ALERTS = [
  {
    id: '1',
    type: 'Fire Detected',
    location: 'Kitchen',
    score: 9,
    date: new Date().toISOString(),
    read: false,
    description: 'Rapid motion and audio spike detected. AI analysis indicates high probability of fire hazard.',
  },
  {
    id: '2',
    type: 'Verbal Conflict Detected',
    location: 'Living Room',
    score: 2,
    date: new Date(Date.now() - 17 * 60000).toISOString(),
    read: false,
    description: 'Elevated voice patterns detected over a 30-second window.',
  },
  {
    id: '3',
    type: 'Motion Alert',
    location: 'Hallway',
    score: 5,
    date: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    description: 'Unusual movement pattern detected during quiet hours.',
  },
]

const TABS = ['Home', 'Activity', 'Overview']

export default function App() {
  const [tab, setTab] = useState('Home')
  const [modal, setModal] = useState(null) // { screen, params }
  const [alerts] = useState(MOCK_ALERTS)

  const navigation = {
    navigate: (screen, params = {}) => {
      if (TABS.includes(screen)) {
        setTab(screen)
        setModal(null)
      } else {
        setModal({ screen, params })
      }
    },
    goBack: () => setModal(null),
  }

  function renderTab() {
    if (tab === 'Home') return <HomeScreen navigation={navigation} alerts={alerts} />
    if (tab === 'Activity') return <ActivityScreen navigation={navigation} alerts={alerts} />
    if (tab === 'Overview') return <ConflictOverviewScreen navigation={navigation} alerts={alerts} />
    return null
  }

  function renderModal() {
    if (!modal) return null
    if (modal.screen === 'AlertDetail') {
      return (
        <View style={StyleSheet.absoluteFill}>
          <AlertDetailScreen navigation={navigation} route={{ params: modal.params }} />
        </View>
      )
    }
    return null
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.content}>
        {renderTab()}
      </View>

      <View style={styles.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={styles.tabItem} onPress={() => { setTab(t); setModal(null) }}>
            <Text style={[styles.tabLabel, tab === t && styles.tabActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderModal()}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 12, fontWeight: '500', color: Colors.gray },
  tabActive: { color: Colors.blue },
})
