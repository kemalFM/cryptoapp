/**
 * This file is the entry point to the application,
 * Checks if user is already logged in validates walletID
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import QRCodeSVG from '../assets/qr.svg';
import DogeCoinSVG from '../assets/dogecoin.svg';
import {setRoot, showModal} from 'react-native-navigation-hooks';
import ValidateWallet from '../Repositories/ValidateWallet';
import {LoadTransactionsRoute} from '../../AppRoutes';
import {useWallet} from '../State/WalletState';
import {getWalletID, storeWalletID} from '../State/WalletStore';
import {useLanguageState} from '../State/LanguageState';
import {I18N} from '../I18N/I18N';

function WelcomeScreen() {
  const language = useLanguageState(state => state.language);
  const [walletID, setWalletID] = useState('');

  const walletState = useWallet();

  const checkWalletID = useCallback(
    async (walletIDQR?: string) => {
      let walletString = walletID;

      if (walletIDQR !== undefined) {
        walletString = walletIDQR;
      }

      const checkWallet = await ValidateWallet(walletString);
      if (walletIDQR !== undefined) {
        if (checkWallet) {
          await storeWalletID(walletString);
          walletState.setWallet(walletString);
          await setRoot(LoadTransactionsRoute);
        }
        return checkWallet;
      } else {
        if (!checkWallet) {
          Alert.alert(
            I18N('QRScanner.walletNotFound', language),
            I18N('QRScanner.weCouldNotVerify', language, [
              {key: 'type', value: I18N('QR.Scanner.wallet', language)},
            ]),
          );
          return;
        } else {
          await storeWalletID(walletString);
          walletState.setWallet(walletString);
          await setRoot(LoadTransactionsRoute);
        }
      }
    },
    [walletID, language],
  );

  useEffect(() => {
    if (walletID.length === 34) {
      checkWalletID().then(undefined);
    }
  }, [checkWalletID, walletID]);

  const checkIfAlreadyLoggedIN = useCallback(async () => {
    const walletID = await getWalletID();

    if (walletID !== null) {
      walletState.setWallet(walletID);
      await setRoot(LoadTransactionsRoute);
    }
  }, []);

  useEffect(() => {
    checkIfAlreadyLoggedIN().then(undefined);
  }, [checkIfAlreadyLoggedIN]);

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        style={styles.viewHolder}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <DogeCoinSVG style={styles.logo} />

        <Text style={styles.headline}>
          {I18N('welcomeScreen.headlineTitle', language)}
        </Text>

        <Text style={styles.headlineText}>
          {I18N('welcomeScreen.headlineText', language)}
        </Text>

        <TextInput
          onChangeText={setWalletID}
          style={styles.walletIDInput}
          placeholderTextColor={'#000000'}
          placeholder={I18N('welcomeScreen.enterWallet', language)}
        />

        <TouchableOpacity
          style={styles.qrCodeButton}
          onPress={
            walletID === ''
              ? () =>
                  showModal('de.kfm.QRCodeScanner', {
                    onBarCodeRead: checkWalletID,
                  })
              : () => checkWalletID()
          }>
          {walletID === '' ? (
            <QRCodeSVG />
          ) : (
            <ActivityIndicator color="#fff" size="large" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  qrCodeButton: {
    borderRadius: 60,
    height: 60,
    width: 60,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  viewHolder: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 30,
  },
  logo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  headline: {
    marginBottom: 20,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headlineText: {
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 30,
  },
  walletIDInput: {
    borderWidth: 1,
    color: "#000000",
    borderColor: '#212121',
    width: '90%',
    height: 42,
    padding: 10,
    borderRadius: 8,
  },
  buttonHolder: {
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

WelcomeScreen.options = {
  topBar: {
    visible: false,
  },
  bottomTabs: {
    visible: false,
  },
};

export default WelcomeScreen;
