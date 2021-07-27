import { Navigation } from 'react-native-navigation';
import './shim';
import WelcomeScreen from './src/WelcomeScreen/WelcomeScreen';
import QRCodeScanner from './src/QRCodeScanner/QRCodeScanner';
import HomeScreen from './src/AppComponents/HomeScreen';
import TransactionDetails from './src/AppComponents/TransactionDetails';
import LoadingTransactions from './src/AppComponents/LoadingTransactions';
import { AppStartRoot } from './AppRoutes';
import { Alert, Platform } from 'react-native';
import { removeWalletID } from './src/State/WalletStore';
import { setRoot } from 'react-native-navigation-hooks';
import Transactions from "./src/AppComponents/Transactions";
import 'intl';
import 'intl/locale-data/jsonp/en';
import TopQRScan from "./src/AppComponents/Components/TopQRScan";
Navigation.registerComponent('de.kfm.WelcomeScreen', () => WelcomeScreen);
Navigation.registerComponent('de.kfm.QRCodeScanner', () => QRCodeScanner);
Navigation.registerComponent('de.kfm.HomeScreen', () => HomeScreen);
Navigation.registerComponent('de.kfm.TransactionsScreenTab', () => Transactions);
Navigation.registerComponent('de.kfm.TopQRCodeScan', () => TopQRScan);
Navigation.registerComponent(
  'de.kfm.TransactionDetails',
  () => TransactionDetails,
);
Navigation.registerComponent(
  'de.kfm.LoadingTransactions',
  () => LoadingTransactions,
);

Navigation.setDefaultOptions({
  layout: {
    backgroundColor: '#fff',
    componentBackgroundColor: '#fff',
  },
  bottomTab: {
    selectedTextColor: "#F06E22",
    iconColor: "#A0A0A0",
    selectedIconColor: "#F06E22",
    textColor: "#A0A0A0"
  },
  topBar: {
    background: {
      color: "#fff",
    },
    borderColor: "#00000050",
    title: {
      color: "#000"
    }
  },
  bottomTabs: {
    backgroundColor: "#fff",
    borderColor: "#00000050"
  },
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
      { text: 'No', style: 'cancel' },
    ]);
  }
});

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot(AppStartRoot);
});
