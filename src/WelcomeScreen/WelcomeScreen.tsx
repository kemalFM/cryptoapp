import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DogeCoinSVG from '../assets/dogecoin.svg';
import {setRoot, showModal} from 'react-native-navigation-hooks';
import ValidateWallet from '../Repositories/ValidateWallet';
import {LoadTransactionsRoute } from "../../AppRoutes";
import { useWallet } from "../State/WalletState";
import { getWalletID, storeWalletID } from "../State/WalletStore";

interface Props {
  componentId: string;
}

function WelcomeScreen(props: Props) {
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
          walletState.setWallet(walletString);
          await setRoot(LoadTransactionsRoute);
        }
        return checkWallet;
      } else {
        if (!checkWallet) {
          Alert.alert(
            'Wallet Not Found',
            'Sorry we could not verify your WalletID. Please try again',
          );
          return;
        } else {
          await storeWalletID(walletString);
          walletState.setWallet(walletString);
          await setRoot(LoadTransactionsRoute);
        }
      }
    },
    [walletID],
  );


  const checkIfAlreadyLoggedIN = useCallback(async () => {

    const walletID = await getWalletID();

    if(walletID !== null){
      walletState.setWallet(walletID);
      await setRoot(LoadTransactionsRoute);
    }

  }, []);


  useEffect(() => {
    checkIfAlreadyLoggedIN().then(undefined)
  }, [checkIfAlreadyLoggedIN]);

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        style={styles.viewHolder}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <DogeCoinSVG style={styles.logo} />

        <Text style={styles.headline}>Headline Placeholder</Text>

        <Text style={styles.headlineText}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt.
        </Text>

        <TextInput
          onChangeText={setWalletID}
          style={styles.walletIDInput}
          placeholder="Enter your wallet ID"
        />

        <TouchableOpacity
          style={styles.buttonHolder}
          onPress={
            walletID === ''
              ? () =>
                  showModal('de.kfm.QRCodeScanner', {
                    onBarCodeRead: checkWalletID,
                  })
              : () => checkWalletID()
          }>
          {walletID === '' ? (
            <Text style={styles.buttonText}>Scan QR Code</Text>
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
