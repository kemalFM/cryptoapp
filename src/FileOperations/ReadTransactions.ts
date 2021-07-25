import React from 'react';
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
