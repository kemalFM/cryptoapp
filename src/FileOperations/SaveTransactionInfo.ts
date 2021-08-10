/**
 * This files saves transaction info into file
 * Deletes first if file exists because on android when you write to the same file and the new texts' length lower than the one on the file
 * it just leaves some data at the end of the file.
 * The react-native-fs documentation can be found under this link
 * https://github.com/itinance/react-native-fs
 */

import RNFS from 'react-native-fs';
import {TransactionInnerDetails} from '../Repositories/TransactionInfoType';

export async function SaveTransactionInfo(
  transactionHash: string,
  transactionDetails: TransactionInnerDetails,
): Promise<boolean> {
  return await RNFS.exists(
    RNFS.DocumentDirectoryPath + '/' + transactionHash + '_transaction.crypto',
  )
    .then(async status => {
      if (status) {
        return await RNFS.unlink(
          RNFS.DocumentDirectoryPath +
            '/' +
            transactionHash +
            '_transaction.crypto',
        )
          .catch(async () => {
            return await SaveTransactionInfo(
              transactionHash,
              transactionDetails,
            );
          })
          .then(async () => {
            return await SaveTInfo(transactionHash, transactionDetails);
          });
      } else {
        return await SaveTInfo(transactionHash, transactionDetails);
      }
    })
    .catch(async () => {
      return await SaveTransactionInfo(transactionHash, transactionDetails);
    });
}

async function SaveTInfo(
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
