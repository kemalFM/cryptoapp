/**
 * This file reads transaction by transactionHash from localstorage
 * The first function check weather we have the file or not, and the second one is reading and parsing file to JSON and returning
 * It uses React-native-fs which can be found with full documentation under this link
 * https://github.com/itinance/react-native-fs
 */

import RNFS from 'react-native-fs';
import {TransactionInnerDetails} from '../Repositories/TransactionInfoType';

export async function ReadTransactionInfo(
  transactionHash: string,
): Promise<TransactionInnerDetails | false> {
  return await RNFS.exists(
    RNFS.DocumentDirectoryPath + '/' + transactionHash + '_transaction.crypto',
  ).then(async status => {
    if (status) {
      return await ReadTransaction(transactionHash);
    } else {
      return false;
    }
  });
}

export async function ReadTransaction(
  transactionHash: string,
): Promise<TransactionInnerDetails | false> {
  return await RNFS.readFile(
    RNFS.DocumentDirectoryPath + '/' + transactionHash + '_transaction.crypto',
  )
    .then(data => {
      return JSON.parse(data);
    })
    .catch(() => {
      return false;
    });
}
