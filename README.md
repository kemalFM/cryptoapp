### CryptoApp - DogeCoin Wallet Viewer, Profit and TaxFree Calculator APP

# Description

This repository contains an application that works both in iOS and Android, shows information about your DogeCoin wallet.

The information that shows and calculates;

- Taxfree DogeCoins you may cash out
- Total profit or loss from the day you bought DogeCoin
- 1 Week Chart of your balance in euros, usd or in dogecoins

# License

CryptoApp is released under the GPL v3 (or later) license

# Requirements

#### For development
- [React Native Environment Setup]( https://reactnative.dev/docs/environment-setup "React Native Env Setup")
- After installing required pieces of software for react-native that matches with your system first run
- `npm install`
  
- `npm run android` -- For Android
 
- `npm run ios`  -- For iOS

#### For Using

- APPSTORE LINK
- PLAYSTORE LINK
- Link to release tab


### Packages that are used

[React Native Camera](https://github.com/react-native-camera/react-native-camera "React Native Camera")  for QRCode scans.

[React Native FS](https://github.com/itinance/react-native-fs "React Native FS") for storing files and caching

[React Native ASYNC Storage](https://github.com/react-native-async-storage/async-storage "React Native Async Storage") for key value storage

[React Native Navigation](https://github.com/wix/react-native-navigation "React Native Navigation") & [React Native Navigation Hooks](https://github.com/underscopeio/react-native-navigation-hooks "React Native Navigation Hooks") for navigating the application to the pages and native experience.

[React Native SVG](https://github.com/react-native-svg/react-native-svg "React Native SVG") for using svg files

[Zustand](https://github.com/pmndrs/zustand "Zustand") for Global state management



### Folder Structure

- Api Requests and Repositories with types /src/Repositories
- States /src/States (global states by zustand)
- Storage and caching is /src/FileOperations
- QRCode Scanner is under /src/QRCodeScanner
- WelcomeScreen is under /src/WelcomeScreen (responsible for first entry)
- Other files for the app which are HomeScreen Calculation files are under /src/AppComponents




