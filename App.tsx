import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Localization from 'expo-localization';
import * as Location from 'expo-location';
import { I18n } from 'i18n-js';
import { useEffect, useState } from 'react';
import { LocationObject } from 'expo-location';

const translations = {
  en: { welcome: 'Hello', name: 'Charlie' },
  ja: { welcome: 'こんにちは' },
};
const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

export default function App() {
  const [lang, setLang] = useState('en');

  const handleChangeLang = () => {
    setLang(lang === 'en' ? 'ja' : 'en');
  }

  useEffect(() => {
    i18n.locale = lang;
  }, [lang])

  const [location, setLocation] = useState<null | LocationObject>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      console.log('location', location);
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text>{i18n.t('welcome')} {i18n.t('name')}</Text>
      <Text>{text}</Text>
      <Button onPress={handleChangeLang} title="Change lang" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
