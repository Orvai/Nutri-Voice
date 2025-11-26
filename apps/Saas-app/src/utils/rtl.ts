import { I18nManager } from 'react-native';

export const isRTL = () => I18nManager.isRTL;

export const forceRTL = () => {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
};