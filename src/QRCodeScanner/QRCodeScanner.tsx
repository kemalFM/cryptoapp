/**
 * This view is used in both walletID scans and TransactionHash scans
 * The way it works changes by sending onBarCodeRead function.
 * When this component hits QRCode it calls OnBarcodeRead function and waits for the function
 * to return boolean value
 */

import React, {useCallback, useState} from 'react';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {useNavigation} from 'react-native-navigation-hooks';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CloseSVG from '../assets/close.svg';
import {useLanguageState} from '../State/LanguageState';
import {I18N} from '../I18N/I18N';
import { ScannerQRFinder } from "./ScannerQR";

type Props = {
  componentId: string;
  onBarCodeRead: (data: string) => boolean;
  type?: string;
};

function QRCodeScanner(props: Props) {
  const language = useLanguageState(state => state.language);
  const navigation = useNavigation(props.componentId);
  const [reading, setReading] = useState(true);

  /* *
   ** When reading qrcode, we are stopping read multiple times in order to prevent multiple request to the api.
   ** After checking if the qr code has valid WALLET ID, we are dismissing the modal
   ** If QRCode does not contains valid wallet id we are just letting user to be able to read another QRCODE
   ** Without closing and reopening view
   * */
  const whenRead = useCallback(
    async (event: BarCodeReadEvent) => {
      setReading(false);

      const readStatus = await props.onBarCodeRead(event.data);

      if (!readStatus) {
        await Alert.alert(
          I18N(
            props.type === 'transactionHash'
              ? 'QRScanner.hashNotFound'
              : 'QRScanner.walletNotFound',
            language,
          ),
          I18N('QRScanner.weCouldNotVerify', language, [
            {
              key: 'type',
              value: I18N(
                `QRScanner.${
                  props.type === 'transactionHash'
                    ? 'transactionHash'
                    : 'wallet'
                }`,
                language,
              ),
            },
          ]),
          [
            {
              text: I18N('QRScanner.OKButton', language),
              onPress: () => setReading(true),
            },
          ],
          {cancelable: false},
        );
      } else {
        await navigation.dismissModal();
      }
    },
    [props, navigation, language],
  );

  return (
    <RNCamera
      style={styles.camera}
      //Disabling audio capture to prevent asking for audio permission
      captureAudio={false}
      //Forcing only detect QRCodes
      barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      onBarCodeRead={reading ? whenRead : undefined}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.dismissModal()}>
        <CloseSVG fill="#fff" style={styles.closeSVG} />
      </TouchableOpacity>
      {!reading && (
        <View style={styles.loadingHolder}>
          <Text style={styles.loadingText}>
            {I18N('QRScanner.loading', language)}
          </Text>
        </View>
      )}
      <ScannerQRFinder
        width={250}
        height={250}
        borderColor={'#000'}
        borderWidth={2}
      />
    </RNCamera>
  );
}

const styles = StyleSheet.create({
  loadingHolder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeSVG: {
    width: 30,
    height: 30,
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: '#000',
    borderRadius: 5,
    top: 10,
    right: 10,
    padding: 10,
  },
  camera: {
    width: '100%',
    height: '100%',
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

export default QRCodeScanner;
