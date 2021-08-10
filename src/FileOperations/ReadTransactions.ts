/**
 * This file reads transactions from the local storage, and returns them in JSON format
 * The react-native-fs documentation can be found under this link
 * https://github.com/itinance/react-native-fs
 */

import RNFS from 'react-native-fs';
import {ConvertTOJSON} from '../Repositories/ConvertTransactions';

export async function ReadTransactions(walletID: string) {
  return await RNFS.exists(
    RNFS.DocumentDirectoryPath + '/' + walletID + '_transactions.crypto',
  ).then(async status => {
    if (status) {
      return await RNFS.readFile(
        RNFS.DocumentDirectoryPath + '/' + walletID + '_transactions.crypto',
      ).then(data => {
        return ConvertTOJSON(data);
      });
    } else {
      return false;
    }
  });
}
