import React from 'react';
import RNFS from 'react-native-fs';
import {TransactionType} from '../Repositories/WalletType';
import {ConvertToText} from '../Repositories/ConvertTransactions';

export async function SaveTransactions(
  walletID: string,
  transactions: TransactionType[],
  position: number = -1,
) {
  await RNFS.exists(
    RNFS.DocumentDirectoryPath + '/' + walletID + '_transactions.crypto',
  ).then(async status => {
    if (status) {
      return await SaveToExistingFile(walletID, transactions, position);
    } else {
      return await SaveToEmptyFile(walletID, transactions);
    }
  });
}

export async function SaveToExistingFile(
  walletID: string,
  transactions: TransactionType[],
  position: number = -1,
) {
  const stringTransactions = ConvertToText(transactions);

  await RNFS.write(
    RNFS.DocumentDirectoryPath + '/' + walletID + '_transactions.crypto',
    position === 0 ? stringTransactions : '\n' + stringTransactions,
    position,
  ).catch(err => {
    console.log(err);
  });
}

export async function SaveToEmptyFile(
  walletID: string,
  transactions: TransactionType[],
) {
  const stringTransactions = ConvertToText(transactions);

  await RNFS.writeFile(
    RNFS.DocumentDirectoryPath + '/' + walletID + '_transactions.crypto',
    stringTransactions,
  ).catch(err => console.log(err));
}
