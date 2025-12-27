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
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#F1F5F9',
  },
  chartPlaceholder: {
    height: 100,
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  barColumn: {
    alignItems: 'center',
  },
  bar: {
    width: 24,
    borderRadius: 4,
  },
  barPositive: {
    backgroundColor: '#EF4444', // Red for over-eating
  },
  barNegative: {
    backgroundColor: '#3B82F6', // Blue for under-eating
  },
  barLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 6,
    color: '#64748B',
  },
  footerNote: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  }
});