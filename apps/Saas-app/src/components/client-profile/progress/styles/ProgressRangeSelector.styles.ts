import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 20,
    width: '100%',
  },
  presetsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  presetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activePresetBtn: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  activePresetText: {
    color: '#FFFFFF',
  },
  container: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoSection: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateRange: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '700',
  },
  editBtn: {
    padding: 6,
  },
  editBtnText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '700',
  }
});