import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: 12, textAlign: 'right' },
  row: { flexDirection: 'row-reverse', gap: 12 },
  smallCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  icon: { fontSize: 24, marginBottom: 8 },
  corrValue: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  corrLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },
});