import React, {useCallback, useState} from 'react';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {useNavigation} from 'react-native-navigation-hooks';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CloseSVG from '../assets/close.svg';

type Props = {
  componentId: string;
  onBarCodeRead: (data: string) => boolean;
  type?: string;
};

function QRCodeScanner(props: Props) {
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
          'Wallet Not Found',
          `Sorry we could not verify your ${props.type === undefined ? 'Wallet ID' : props.type}. Please try again`,
          [{text: 'OK', onPress: () => setReading(true)}],
          {cancelable: false},
        );
      } else {
        await navigation.dismissModal();
      }
    },
    [props, navigation],
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
        <CloseSVG style={styles.closeSVG} />
      </TouchableOpacity>
      {!reading && (
        <View style={styles.loadingHolder}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
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
    width: 40,
    height: 40,
  },
  closeButton: {
    position: 'absolute',
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
