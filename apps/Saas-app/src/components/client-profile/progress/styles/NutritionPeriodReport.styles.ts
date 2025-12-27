import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 12,
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  calorieSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avgLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avgValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 4,
  },
  unit: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  macroGrid: {
    flexDirection: 'row-reverse',
    gap: 8,
    width: '100%',
  },
  tag: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  tagLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tagValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
});