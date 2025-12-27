import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  insightBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  indicator: {
    width: 4,
    height: 24,
    backgroundColor: '#8B5CF6', // Insight Purple
    borderRadius: 2,
    marginLeft: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'right',
  }
});