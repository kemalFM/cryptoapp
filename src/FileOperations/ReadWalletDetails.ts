/**
 * This file Reads wallet details by given walletID
 * It uses react-native-fs
 * The react-native-fs documentation can be found under this link
 * https://github.com/itinance/react-native-fs
 */
import RNFS from 'react-native-fs';
import {AddressType} from '../Repositories/WalletType';

export async function ReadWalletDetails(
  walletID: string,
): Promise<AddressType | false> {
  return await RNFS.exists(
    RNFS.DocumentDirectoryPath + '/' + walletID + '_details.crypto',
  ).then(async status => {
    if (status) {
      return await ReadWallet(walletID);
    } else {
      return false;
    }
  });
}

export async function ReadWallet(
  walletID: string,
): Promise<AddressType | false> {
  return await RNFS.readFile(
    RNFS.DocumentDirectoryPath + '/' + walletID + '_details.crypto',
  )
    .then(data => {
      return JSON.parse(data);
    })
    .catch(() => {
      return false;
    });
}
