import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import QRScanSVG from '../../assets/scan.svg';
import {showModal} from 'react-native-navigation-hooks';
import { useWallet } from "../../State/WalletState";
import { ReadTransactions } from "../../FileOperations/ReadTransactions";
import { NavigationCommands } from "react-native-navigation-hooks/dist/helpers/createNavigationCommands";
import { GetTransactionInfo } from "../../Repositories/GetTransactionInfo";

export default function TopQRScan(props: {
  navigation: NavigationCommands
}) {

  const walletState = useWallet();


  const onReadTransaction = useCallback(async (hash: string) => {
    const transactions = await ReadTransactions(walletState.id);

    if(transactions){

      const search =  transactions.find((transaction) => {
        return transaction.hash === hash;
      });

      if(search !== undefined){
        await props.navigation.push('de.kfm.TransactionDetails', {
          transaction: search,
        });
        return true;
      }
    }

    return await checkOnline(hash);

  }, []);


  const checkOnline = useCallback(async (hash: string) => {

    const transactionInfo = await GetTransactionInfo(hash);

    if(transactionInfo){

      await props.navigation.push('de.kfm.TransactionDetails', {
        transaction: transactionInfo.data[hash].transaction
      })

      return true;
    }

    return false;
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        showModal('de.kfm.QRCodeScanner', {
          onBarCodeRead: onReadTransaction,
          type: 'Transaction Hash',
        });
      }}
      style={styles.position}>
      <QRScanSVG fill={'#000'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  position: {
    marginRight: 15,
  },
});
