import React from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './locales/en';
import es from './locales/es';

i18n.translations = {
  en,
  es
};

i18n.locale = Localization.locale;

i18n.fallbacks = true;
 
export default i18n;