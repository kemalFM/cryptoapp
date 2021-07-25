import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeWalletID = async (value: string) => {
  try {
    await AsyncStorage.setItem('@walletID', value);
  } catch (e) {
    await storeWalletID(value);
  }
};

export const getWalletID = async (): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem('@walletID');
    if (value !== null) {
      return value;
    }
    return null;
  } catch (e) {
    return getWalletID();
  }
};

export const removeWalletID = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('@walletID');
  } catch (e) {
    await removeWalletID();
  }
};
