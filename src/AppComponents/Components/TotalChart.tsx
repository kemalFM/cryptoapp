/**
 * This view is on home page that shows balance change in DogeCoins as well as
 * in United States Dollars
 * The usage is just by sending type as 'usd' or 'doge' refereed in the prop types
 * It uses the chart library for react native, documentation can be found under this url
 * https://github.com/indiespirit/react-native-chart-kit
 */

import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useWallet} from '../../State/WalletState';
import {ReadTransactions} from '../../FileOperations/ReadTransactions';
import {ReadTransactionInfo} from '../../FileOperations/ReadTransactionInfo';
import {ReadWalletDetails} from '../../FileOperations/ReadWalletDetails';
import {nFormatter} from './NumberFormetter';
import DogePriceFixer from './DogePriceFixer';
import CalculateTransactionValue from './CalculateTransactionValue';

interface Props {
  type: 'usd' | 'doge';
}

const windowWidth = Dimensions.get('window').width;

function TotalChart(props: Props) {
  const [transactions, setTransactions] = useState<
    {date: string; value: number}[]
  >([]);
  const walletID = useWallet(state => state.id);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * This is the function that reads the transactions as well as wallet details from storage
   * and parses them to be able to show in chart
   */

  const readTransaction = useCallback(async () => {
    const transactionList = await ReadTransactions(walletID);
    const walletData = await ReadWalletDetails(walletID);
    let balance = 0;
    if (walletData) {
      if (props.type === 'usd') {
        balance = walletData.balance_usd;
      } else {
        balance = walletData.balance;
      }
    }

    if (transactionList) {
      let transactionResponse = transactionList;
      transactionResponse.splice(7, transactionResponse.length);
      const transactionMap: {
        date: string;
        value: number;
        balance_change: number;
      }[] = [];
      for (const transaction of transactionResponse) {
        if (props.type === 'usd') {
          const transactionInfo = await ReadTransactionInfo(transaction.hash);
          if (transactionInfo) {
            let total = 0;
            total = CalculateTransactionValue(
              transaction,
              transactionInfo,
              walletID,
            );

            transactionMap.push({
              date:
                new Date(transactionInfo.transaction.date).getDate() +
                '/' +
                (Number(new Date(transactionInfo.transaction.date).getMonth()) +
                  1),
              value: total,
              balance_change: total,
            });
          }
        } else {
          console.log(transaction.balance_change);
          transactionMap.push({
            date:
              new Date(transaction.time.split(' ')[0]).getDate() +
              '/' +
              (Number(new Date(transaction.time.split(' ')[0]).getMonth()) + 1),
            value: 0,
            balance_change: transaction.balance_change,
          });
        }
      }

      // if(transactionMap[0].value > 0){
      //   transactionMap[1].value = balance - transactionMap[0].value;
      // }else{
      //   transactionMap[1].value = balance + Math.abs(transactionMap[0].value);
      // }
      transactionMap[0].value = balance;

      // transactionMap.map((transaction, index) => {
      //
      //   if(index === 0)
      //     return transaction;
      //
      //   if(transaction.value < 0){
      //     transaction.value = transactionMap[index - 1].value;
      //   }else{
      //
      //   }
      //
      //   return transaction;
      // });

      transactionMap.map((transaction, index) => {
        if (index === 0) {
          transaction.value = balance;
          if (transaction.balance_change < 0) {
            transactionMap[index + 1].value =
              balance + Math.abs(transaction.balance_change);
          } else {
            transactionMap[index + 1].value =
              balance - Math.abs(transaction.balance_change);
          }

          return transaction;
        }
        if (transactionMap[index + 1] !== undefined) {
          if (transaction.balance_change < 0) {
            transactionMap[index + 1].value =
              transaction.value + Math.abs(transaction.balance_change);
          } else {
            transactionMap[index + 1].value =
              transaction.value - transaction.balance_change;
          }
        }
      });

      // transactionMap.map((transaction, index) => {
      //   console.log(transaction, (transactionMap[index - 1]?.value));
      //   if (index > 1) {
      //     if(transaction.value < 0){
      //       transaction.value = transactionMap[index - 1]?.value - Math.abs(transaction.value);
      //     }else{
      //       transaction.value = (transactionMap[index - 1]?.value - transaction.value);
      //     }
      //   } else if (index === 1){
      //
      //   } else {
      //     if(transaction.value > 0){
      //       transactionMap[index + 1].value = balance - transaction.value;
      //     }else{
      //       transactionMap[index + 1].value = balance + Math.abs(transaction.value);
      //     }
      //     transaction.value = balance;
      //   }
      //   console.log(transaction.date, transaction.value);
      //
      //   return transaction;
      // });

      setTransactions(transactionMap.reverse());
    }
  }, [props.type, walletID]);

  useEffect(() => {
    readTransaction().then(undefined);
  }, [readTransaction, walletID]);

  useEffect(() => {
    if (isLoading) {
      if (transactions.length > 0) {
        setIsLoading(false);
      }
    }
  }, [isLoading, transactions]);

  return (
    <View>
      {isLoading && <Text style={styles.loadingChart}>Loading...</Text>}
      <LineChart
        data={{
          labels:
            transactions.length > 0
              ? transactions.map(transaction => transaction.date)
              : ['0'],
          datasets: [
            {
              data:
                transactions.length > 0
                  ? transactions.map(transaction =>
                      props.type === 'usd'
                        ? transaction.value
                        : !isNaN(
                            Number(DogePriceFixer(transaction.value, true)),
                          )
                        ? Number(DogePriceFixer(transaction.value, true))
                        : 0,
                    )
                  : [0],
            },
          ],
        }}
        width={Dimensions.get('window').width - 50}
        height={180}
        yAxisLabel={props.type === 'usd' ? '$' : ''}
        formatYLabel={label => nFormatter(Number(label), 2)}
        yAxisInterval={1}
        withDots={false}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#000',
          },
        }}
        bezier
        style={styles.chartStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingChart: {
    width: windowWidth - 40,
    position: 'absolute',
    zIndex: 99,
    height: 210,
    textAlign: 'center',
    lineHeight: 210,
    fontSize: 32,
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  chartStyle: {
    marginVertical: 30,
    borderRadius: 16,
  },
});

export default TotalChart;
