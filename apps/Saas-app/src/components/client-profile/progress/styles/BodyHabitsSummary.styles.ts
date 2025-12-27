import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { marginBottom: 40 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: 12, textAlign: 'right' },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  gridItem: { width: '31%', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  gridLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  gridValue: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
});