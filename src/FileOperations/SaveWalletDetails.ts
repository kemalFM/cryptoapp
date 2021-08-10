/**
 * This file saves wallet details
 * Converts JSON data to string and saves under DocumentDirectoryPath
 * If we already have this wallet information we are deleting it first in order the prevent writing extra information to that file (happens in android only)
 * The react-native-fs documentation can be found under this link
 * https://github.com/itinance/react-native-fs
 */

import RNFS from 'react-native-fs';
import {AddressType} from '../Repositories/WalletType';

export async function SaveWalletDetails(
  walletID: string,
  walletDetails: AddressType,
): Promise<boolean> {
  return await RNFS.exists(
    RNFS.DocumentDirectoryPath + '/' + walletID + '_details.crypto',
  )
    .then(async status => {
      if (status) {
        return await RNFS.unlink(
          RNFS.DocumentDirectoryPath + '/' + walletID + '_details.crypto',
        )
          .catch(async () => {
            return await SaveWalletDetails(walletID, walletDetails);
          })
          .then(async () => {
            return await WriteWallet(walletID, walletDetails);
          });
      } else {
        return await WriteWallet(walletID, walletDetails);
      }
    })
    .catch(async () => {
      return await SaveWalletDetails(walletID, walletDetails);
    });
}

async function WriteWallet(
  walletID: string,
  walletDetails: AddressType,
): Promise<boolean> {
  return await RNFS.writeFile(
    RNFS.DocumentDirectoryPath + '/' + walletID + '_details.crypto',
    JSON.stringify(walletDetails),
  )
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
