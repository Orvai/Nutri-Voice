import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: 12, textAlign: 'right' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#F59E0B', borderWidth: 1, borderColor: '#E2E8F0' },
  statusRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 },
  indicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F59E0B', marginLeft: 8 },
  statusText: { fontSize: 15, fontWeight: '700', color: '#92400E' },
  distributionContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  levelItem: { alignItems: 'center' },
  levelLabel: { fontSize: 10, color: '#64748B', marginBottom: 4 },
  levelCount: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
});