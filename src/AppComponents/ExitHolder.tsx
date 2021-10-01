import React, {useCallback, useEffect} from 'react';
import {Alert, Text, View} from 'react-native';
import {useLanguageState} from '../State/LanguageState';
import {setRoot, useNavigation} from 'react-native-navigation-hooks';
import {I18N} from '../I18N/I18N';
import {Navigation} from 'react-native-navigation';
import {removeWalletID} from '../State/WalletStore';
import {AppStartRoot} from '../../AppRoutes';

export default function ExitHolder(props: {componentId: string}) {
  const navigation = useNavigation(props.componentId);
  const language = useLanguageState();

  useEffect(() => {
    navigation.mergeOptions({
      bottomTab: {
        text: I18N('settings.logout.title', language.language),
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
  }, [language]);

  useEffect(() => {
    const nav = Navigation.events().registerBottomTabPressedListener(event => {
      if (event.tabIndex === 2) {
        onLogoutRequest();
      }
    });

    return () => {
      nav.remove();
    };
  }, [onLogoutRequest]);

  return (
    <View>
      <Text>Not visible Exit Holder</Text>
    </View>
  );
}
