import RNFS from 'react-native-fs';
import {AddressType} from '../Repositories/WalletType';
import { TransactionInnerDetails } from "../Repositories/TransactionInfoType";

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
