/**
 * This file is responsible for getting walletDetails after successful entry of walletID from WelcomeScreen
 * After getting wallet information it then gets transactions inside wallet, since api endpoint has 30 request per min limit, we are not able to send more than 30 requests in a minute
 * It also checks if we already have wallet information in our storage to prevent extra requests and wait times at reopening app.
 * It also checks that if user has new transactions since user opened the application, and gets and store them as well.
 * Shows minimal loading bar to give information to user what is really happening behind.
 */

import React, {useCallback, useEffect, useState} from 'react';

import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useWallet} from '../State/WalletState';
import GetTransactions from '../Repositories/GetTransactions';
import {AddressType, Wallet} from '../Repositories/WalletType';
import {SaveTransactions} from '../FileOperations/SaveTransactions';
import {ReadWalletDetails} from '../FileOperations/ReadWalletDetails';
import {setRoot} from 'react-native-navigation-hooks';
import { AppComponentRoutes, AppStartRoot } from "../../AppRoutes";
import {SaveWalletDetails} from '../FileOperations/SaveWalletDetails';
import DogeSVG from '../assets/dogecoin.svg';
import {ReadTransactions} from '../FileOperations/ReadTransactions';
import {GetMultipleTransactionInfo} from '../Repositories/GetTransactionInfo';
import {SaveTransactionInfo} from '../FileOperations/SaveTransactionInfo';
import GetExchangeRates from '../Repositories/ExchangeRates';
import {useExchangeRates} from '../State/ExchangeRates';
import {I18N} from '../I18N/I18N';
import {useLanguageState} from '../State/LanguageState';
import { removeWalletID } from "../State/WalletStore";

function LoadingTransactions() {
  const language = useLanguageState(state => state.language);
  const walletState = useWallet();
  const exchangeRatesState = useExchangeRates();
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [loaded, setLoaded] = useState<number>(0);
  const [gettingTransactionsInfo, setGettingTransactionsInfo] = useState(false);

  const getTransactions = useCallback(async () => {
    /**
     * Sending request to the endpoint in order to check if we already have the wallet or not.
     */
    let getWalletDetails = await GetTransactions(walletState.id, 1, 0).catch(
      err => {
        console.log(err, 'getWalletDetails');
      },
    );

    console.log(getWalletDetails, walletState.id);

    if (getWalletDetails !== false) {
      getWalletDetails = getWalletDetails as Wallet;

      setTransactionCount(
        getWalletDetails.data[walletState.id].address.transaction_count,
      );
      //Reading wallet details from storage to compare and check if we have the details correctly or not
      let walletData = await ReadWalletDetails(walletState.id).catch(err => {
        console.log(err, 'readWalletDetails');
      });

      //If we have the wallet data in storage this part will be working
      if (walletData !== false) {
        walletData = walletData as AddressType;

        console.log(walletData);
        //Checking if the app has the correct amount of transactions to understand if there is new transactions.
        if (
          walletData.transaction_count ===
          getWalletDetails.data[walletState.id].address.transaction_count
        ) {
          /// When everything is matching with the chain we are just updating the latest wallet information which also holds current balance in usd and sending user to homepage.
          await SaveWalletDetails(
            walletState.id,
            getWalletDetails.data[walletState.id].address,
          ).catch(err => {
            console.log(err, 'saveWalletDetails');
          });
          await setRoot(AppComponentRoutes);
        } else {
          // When user has some new transactions since their last login this part will be working, sending request to the endpoint retrieving new transactions and storing them.
          let getNewTransactions = await GetTransactions(
            walletState.id,
            getWalletDetails.data[walletState.id].address.transaction_count -
              walletData.transaction_count,
            0,
          ).catch(err => {
            console.log(err, 'getNewTransactions');
          });
          getNewTransactions = getNewTransactions as Wallet;

          let transactionList =
            getNewTransactions.data[walletState.id].transactions;

          await SaveTransactions(walletState.id, transactionList, 0);

          await SaveWalletDetails(
            walletState.id,
            getNewTransactions.data[walletState.id].address,
          ).catch(err => {
            console.log(err, 'saveWalletDetails line 96');
          });

          setGettingTransactionsInfo(true);
          setLoaded(0);
          setTransactionCount(0);

          // Saving details for new transactions only

          await loadTransactionDetails(
            transactionList.map(transaction => transaction.hash),
          );

          await setRoot(AppComponentRoutes);
        }
      } else {
        // When the walletID entered for the first time this part will be working
        let firstThousandTransaction = await GetTransactions(
          walletState.id,
          1000,
          0,
        ).catch(err => {
          console.log(err, 'firstThousandTransaction');
        });
        console.log(firstThousandTransaction);
        firstThousandTransaction = firstThousandTransaction as Wallet;
        let loadTotal = 0;
        await SaveTransactions(
          walletState.id,
          firstThousandTransaction.data[walletState.id].transactions,
        ).catch(err => {
          console.log(err, 'saveTransactions line 126');
        });
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
          ).catch(err => {
            console.log(err, 'transactions line 138');
          });

          if (transactions !== false) {
            transactions = transactions as Wallet;
            await SaveTransactions(
              walletState.id,
              transactions.data[walletState.id].transactions,
            ).catch(err => {
              console.log(err, 'line 155');
            });
            setLoaded(
              loadTotal + transactions.data[walletState.id].transactions.length,
            );
            loadTotal += transactions.data[walletState.id].transactions.length;
          }
        }

        await SaveWalletDetails(
          walletState.id,
          firstThousandTransaction.data[walletState.id].address,
        ).catch(err => {
          console.log(err, 'saveWalletDetails line 166');
        });

        setGettingTransactionsInfo(true);
        setLoaded(0);
        setTransactionCount(0);
        //After everything is finished we are loading transaction details
        await loadTransactionDetails().catch(err =>
          console.log(err, 'loadtra'),
        );

        await setRoot(AppComponentRoutes);
      }
    } else {
      Alert.alert(
        I18N('error', language),
        I18N('loadingTransactions.errorConnection', language),
      );
      await removeWalletID();
      await setRoot(AppStartRoot);
    }
  }, [walletState, language]);

  const loadTransactionDetails = useCallback(
    async (transactionsToGet?: string[]) => {
      return new Promise(async resolve => {
        let onlyHashList: string[] = [];
        if (transactionsToGet === undefined) {
          const transactionList = await ReadTransactions(walletState.id);

          if (transactionList === false) {
            resolve();
            return;
          }
          const firstTransaction = transactionList[transactionList.length - 1];
          transactionList.splice(99, transactionList.length);
          onlyHashList = transactionList.map(transaction => {
            return transaction.hash;
          });
          if(firstTransaction !== undefined){
              onlyHashList.push(firstTransaction.hash);
          }
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
          GetMultipleTransactionInfo(tenTransactionHash)
            .then(data => {
              if (data !== false) {
                setLoaded(totalLoaded + tenTransactionHash.length);
                totalLoaded += tenTransactionHash.length;
                tenTransactionHash.forEach(hash => {
                  SaveTransactionInfo(hash, data.data[hash]).catch(err =>
                    console.log('multierr line 224', err),
                  );
                });
              } else {
                setLoaded(totalLoaded + tenTransactionHash.length);
                totalLoaded += tenTransactionHash.length;
              }
              if (totalLoaded >= totalTransactions) {
                resolve();
              }
            })
            .catch(err => console.log('multierr line 233', err));
        });
      });
    },
    [walletState],
  );

  const loadExchangeRates = useCallback(async () => {
    const rateList = await GetExchangeRates();
    if (rateList !== false) {
      exchangeRatesState.setRates(rateList);
    }
  }, [exchangeRatesState]);

  useEffect(() => {
    getTransactions()
      .then(undefined)
      .catch(co => console.log(co));
    loadExchangeRates().catch(co => console.log(co));
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
            ? I18N('loadingTransactions.gettingDetails', language)
            : I18N('loadingTransactions.gettingWallet', language)}
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
              ? I18N('loadingTransactions.pleaseWait', language)
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
