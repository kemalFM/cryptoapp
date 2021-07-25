import RNFS from 'react-native-fs';
import {TransactionInnerDetails } from "../Repositories/TransactionInfoType";

export async function SaveTransactionInfo(
  transactionHash: string,
  transactionDetails: TransactionInnerDetails,
): Promise<boolean> {
  return await RNFS.writeFile(
    RNFS.DocumentDirectoryPath + '/' + transactionHash + '_transaction.crypto',
    JSON.stringify(transactionDetails),
  )
    .then(async () => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
