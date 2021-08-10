/**
 * This view is for scanning qr codes for transactions
 * At first initial scan the qr code scanner checks if the app already has information about the transaction
 * If app have details for that transaction the app just returning user to TransactionDetails page
 * If not App sends request to the endpoint that gives information about the transaction.
 * If the transactionHash is correct and there is a data regarding to that transactionHASH
 * the app returning user to TransactionDetails page with that information and caches data for the next requests.
 */
import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import QRScanSVG from '../../assets/scan.svg';
import {showModal} from 'react-native-navigation-hooks';
import {useWallet} from '../../State/WalletState';
import {ReadTransactions} from '../../FileOperations/ReadTransactions';
import {NavigationCommands} from 'react-native-navigation-hooks/dist/helpers/createNavigationCommands';
import {GetTransactionInfo} from '../../Repositories/GetTransactionInfo';

export default function TopQRScan(props: {navigation: NavigationCommands}) {
  const walletState = useWallet();

  /**
   * The function works after successful read of qr code holds data.
   * The concept is explained on the top of the page.
   */

  const onReadTransaction = useCallback(async (hash: string) => {
    const transactions = await ReadTransactions(walletState.id);

    if (transactions) {
      const search = transactions.find(transaction => {
        return transaction.hash === hash;
      });

      if (search !== undefined) {
        await props.navigation.push('de.kfm.TransactionDetails', {
          transaction: search,
        });
        return true;
      }
    }

    return await checkOnline(hash);
  }, []);


  /**
   * Checking if the transaction exists on DogeChain
   */
  const checkOnline = useCallback(async (hash: string) => {
    const transactionInfo = await GetTransactionInfo(hash);

    if (transactionInfo) {
      await props.navigation.push('de.kfm.TransactionDetails', {
        transaction: transactionInfo.data[hash].transaction,
      });

      return true;
    }

    return false;
  }, []);

  return (
    <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  position: {
    width: 50,
  },
});
