import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 12,
    textAlign: 'right',
  },
  list: { gap: 10 },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  positiveBadge: { backgroundColor: '#DCFCE7' },
  negativeBadge: { backgroundColor: '#FEE2E2' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#166534' },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
  },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '800', color: '#334155' },
  verticalDivider: { width: 1, backgroundColor: '#E2E8F0' },
});