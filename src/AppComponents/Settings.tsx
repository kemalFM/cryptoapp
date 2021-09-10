import React, {useEffect} from 'react';
import {setRoot, useNavigation} from 'react-native-navigation-hooks';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLanguageState} from '../State/LanguageState';
import {I18N} from '../I18N/I18N';
import {useCallback} from 'react';
import {removeWalletID} from '../State/WalletStore';
import {AppStartRoot} from '../../AppRoutes';

function SettingsPage(props: {componentId: string}) {
  const navigation = useNavigation(props.componentId);
  const language = useLanguageState();

  useEffect(() => {
    navigation.mergeOptions({
      topBar: {
        title: {
          text: I18N('settings.settings', language.language),
        },
      },
      bottomTab: {
        text: I18N('navigation.settings', language.language),
      },
    });
  }, [language, navigation]);

  const onLogoutRequest = useCallback(() => {
    Alert.alert(
      I18N('settings.logout.title', language.language),
      I18N('settings.logout.question', language.language),
      [
        {
          text: I18N('settings.logout.yes', language.language),
          style: 'default',
          onPress: async () => {
            await removeWalletID();
            await setRoot(AppStartRoot);
          },
        },
        {text: I18N('settings.logout.no', language.language), style: 'cancel'},
      ],
    );
  }, []);

  const onLanguageChangeRequest = useCallback(() => {
    Alert.alert(
      I18N('settings.language.title', language.language),
      I18N('settings.language.question', language.language),
      [
        {
          text: I18N('settings.language.en', language.language),
          style: 'default',
          onPress: async () => {
            language.setLanguage('en');
          },
        },
        {
          text: I18N('settings.language.hr', language.language),
          style: 'default',
          onPress: async () => {
            language.setLanguage('hr');
          },
        },
        {
          text: I18N('settings.language.de', language.language),
          style: 'default',
          onPress: async () => {
            language.setLanguage('de');
          },
        },
      ],
    );
  }, []);

  return (
    <View style={styles.bodyHolder}>
      <TouchableOpacity
        style={styles.buttonHolder}
        onPress={onLanguageChangeRequest}>
        <Text style={styles.buttonText}>
          {I18N('settings.language.language', language.language)}:{' '}
          {I18N('settings.language.' + language.language, language.language)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonHolder} onPress={onLogoutRequest}>
        <Text style={styles.buttonText}>
          {I18N('settings.logout.logout', language.language)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyHolder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonHolder: {
    // borderWidth: 1,
    // borderColor: "rgba(0,0,0,.5)",
    // paddingVertical: 5,
    // paddingHorizontal: 10,
    // width: '98%',
    // height: 50,
    // borderRadius: 5,
    // marginBottom: 10,
    textAlign: 'center',
    width: '90%',
    marginTop: 20,
    backgroundColor: '#212121',
    height: 42,
    borderRadius: 8,
    padding: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 31,
    fontSize: 20,
  },
});

export default SettingsPage;
