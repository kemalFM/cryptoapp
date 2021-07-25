import {Navigation} from 'react-native-navigation';
import './shim';
import WelcomeScreen from './src/WelcomeScreen/WelcomeScreen';
import QRCodeScanner from './src/QRCodeScanner/QRCodeScanner';
import HomeScreen from './src/AppComponents/HomeScreen';
import TransactionDetails from './src/AppComponents/TransactionDetails';
import LoadingTransactions from './src/AppComponents/LoadingTransactions';
import {AppStartRoot} from './AppRoutes';
import {Alert} from 'react-native';
import {removeWalletID} from './src/State/WalletStore';
import {setRoot} from 'react-native-navigation-hooks';
import Transactions from "./src/AppComponents/Transactions";
Navigation.registerComponent('de.kfm.WelcomeScreen', () => WelcomeScreen);
Navigation.registerComponent('de.kfm.QRCodeScanner', () => QRCodeScanner);
Navigation.registerComponent('de.kfm.HomeScreen', () => HomeScreen);
Navigation.registerComponent('de.kfm.TransactionsScreenTab', () => Transactions);
Navigation.registerComponent(
  'de.kfm.TransactionDetails',
  () => TransactionDetails,
);
Navigation.registerComponent(
  'de.kfm.LoadingTransactions',
  () => LoadingTransactions,
);

Navigation.setDefaultOptions({
  animations: {
    setRoot: {
      alpha: {
        from: 0,
        to: 1,
        duration: 500,
      },
    },
  },
});

Navigation.events().registerBottomTabPressedListener(pressEvent => {
  if (pressEvent.tabIndex === 2) {
    Alert.alert('Logout ?', 'Do you really want to logout ?', [
      {
        text: 'Yes',
        style: 'default',
        onPress: async () => {
          await removeWalletID();
          await setRoot(AppStartRoot);
        },
      },
      {text: 'No', style: 'cancel'},
    ]);
  }
});

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot(AppStartRoot);
});
