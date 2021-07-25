import React, {useCallback, useEffect, useState} from 'react';

import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useWallet} from '../State/WalletState';
import GetTransactions from '../Repositories/GetTransactions';
import {AddressType, Wallet} from '../Repositories/WalletType';
import {SaveTransactions} from '../FileOperations/SaveTransactions';
import {ReadWalletDetails} from '../FileOperations/ReadWalletDetails';
import {setRoot} from 'react-native-navigation-hooks';
import {AppComponentRoutes} from '../../AppRoutes';
import {SaveWalletDetails} from '../FileOperations/SaveWalletDetails';
import DogeSVG from '../assets/dogecoin.svg';
import {ReadTransactions} from '../FileOperations/ReadTransactions';
import {GetMultipleTransactionInfo} from '../Repositories/GetTransactionInfo';
import {SaveTransactionInfo} from '../FileOperations/SaveTransactionInfo';

function LoadingTransactions() {
  const walletState = useWallet();

  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [loaded, setLoaded] = useState<number>(0);
  const [gettingTransactionsInfo, setGettingTransactionsInfo] = useState(false);

  const getTransactions = useCallback(async () => {
    let getWalletDetails = await GetTransactions(walletState.id, 1, 0);

    if (getWalletDetails !== false) {
      getWalletDetails = getWalletDetails as Wallet;

      setTransactionCount(
        getWalletDetails.data[walletState.id].address.transaction_count,
      );

      let walletData = await ReadWalletDetails(walletState.id);

      if (walletData !== false) {
        walletData = walletData as AddressType;

        if (
          walletData.transaction_count ===
          getWalletDetails.data[walletState.id].address.transaction_count
        ) {
          /// WE HAVE EVERYTHING WE NEED NO NEED TO UPDATE SETTING ROOT
          await SaveWalletDetails(
            walletState.id,
            getWalletDetails.data[walletState.id].address,
          );
          await setRoot(AppComponentRoutes);
        } else {
          //We have new transactions

          let getNewTransactions = await GetTransactions(
            walletState.id,
            getWalletDetails.data[walletState.id].address.transaction_count -
              walletData.transaction_count,
            0,
          );
          getNewTransactions = getNewTransactions as Wallet;

          let transactionList =
            getNewTransactions.data[walletState.id].transactions;

          await SaveTransactions(walletState.id, transactionList, 0);

          await SaveWalletDetails(
            walletState.id,
            getNewTransactions.data[walletState.id].address,
          );

          setGettingTransactionsInfo(true);
          setLoaded(0);
          setTransactionCount(0);
          await loadTransactionDetails(
            transactionList.map(transaction => transaction.hash),
          );

          await setRoot(AppComponentRoutes);
        }
      } else {
        //SAVING TRANSACTIONS FOR THE FIRST TIME

        let firstThousandTransaction = await GetTransactions(
          walletState.id,
          1000,
          0,
        );
        firstThousandTransaction = firstThousandTransaction as Wallet;
        let loadTotal = 0;
        await SaveTransactions(
          walletState.id,
          firstThousandTransaction.data[walletState.id].transactions,
        ).catch(() => undefined);
        setLoaded(
          loadTotal +
            firstThousandTransaction.data[walletState.id].transactions.length,
        );
        loadTotal +=
          firstThousandTransaction.data[walletState.id].transactions.length;
        for (
          let offset = 1000;
          offset <=
          firstThousandTransaction.data[walletState.id].address
            .transaction_count;
          offset += 1000
        ) {
          let transactions = await GetTransactions(
            walletState.id,
            1000,
            offset,
          );

          if (transactions !== false) {
            transactions = transactions as Wallet;
            await SaveTransactions(
              walletState.id,
              transactions.data[walletState.id].transactions,
            ).catch(() => undefined);
            setLoaded(
              loadTotal + transactions.data[walletState.id].transactions.length,
            );
            loadTotal += transactions.data[walletState.id].transactions.length;
          }
        }

        await SaveWalletDetails(
          walletState.id,
          firstThousandTransaction.data[walletState.id].address,
        );

        setGettingTransactionsInfo(true);
        setLoaded(0);
        setTransactionCount(0);
        await loadTransactionDetails();

        await setRoot(AppComponentRoutes);
      }
    }
  }, [walletState]);

  const loadTransactionDetails = useCallback(
    async (transactionsToGet?: string[]) => {
      return new Promise(async resolve => {
        let onlyHashList: string[] = [];
        if (transactionsToGet === undefined) {
          const transactionList = await ReadTransactions(walletState.id);
          if (transactionList === false) {
            return;
          }
          transactionList.splice(1000, transactionList.length);
          onlyHashList = transactionList.map(transaction => {
            return transaction.hash;
          });
        } else {
          onlyHashList = transactionsToGet;
        }

        const totalTransactions = onlyHashList.length;
        setTransactionCount(onlyHashList.length);

        let hashSplit = [];
        const splitLimit = 10;

        while (onlyHashList.length > 0) {
          const chunk = onlyHashList.splice(0, splitLimit);
          hashSplit.push(chunk);
        }

        let totalLoaded = 0;

        hashSplit.forEach(tenTransactionHash => {
          GetMultipleTransactionInfo(tenTransactionHash).then(data => {
            if (data !== false) {
              setLoaded(totalLoaded + tenTransactionHash.length);
              totalLoaded += tenTransactionHash.length;
              tenTransactionHash.forEach(hash => {
                SaveTransactionInfo(hash, data.data[hash]);
              });
            }else{
              setLoaded(totalLoaded + tenTransactionHash.length);
              totalLoaded += tenTransactionHash.length;
              console.log('error occured');
            }
            if (totalLoaded >= totalTransactions) {
              resolve();
            }
          });
        });
      });
    },
    [walletState],
  );

  useEffect(() => {
    getTransactions().then(undefined);
  }, [walletState]);

  // Calculating percentage for total transactions we have saved / total transactions (saved*100/totalTransactions)
  const calculatePercentage = useCallback((load, total) => {
    if (load === 0 || total === 0) {
      return 0;
    }

    return ((load * 100) / total).toFixed(0);
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.holder}>
        <DogeSVG style={styles.doge} />

        <Text style={styles.actionText}>
          {gettingTransactionsInfo
            ? 'Getting Transaction Details'
            : 'Getting Wallet Information'}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={{
              ...styles.progressBG,
              width: `${calculatePercentage(loaded, transactionCount)}%`,
            }}
          />
          <Text style={styles.transactionCount}>
            {loaded === 0
              ? 'Please Wait...'
              : `${loaded} / ${transactionCount}`}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  transactionCount: {
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 20,
  },
  progressBG: {
    backgroundColor: '#e1b303',
    position: 'absolute',
    height: 38,
  },
  progressBar: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#000',
    width: '80%',
    height: 40,
  },
  holder: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  doge: {
    width: 150,
    height: 150,
  },
});

LoadingTransactions.options = {
  topBar: {
    visible: false,
  },
  bottomTabs: {
    visible: false,
  },
};

export default LoadingTransactions;
