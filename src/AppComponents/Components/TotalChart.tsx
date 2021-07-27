import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useWallet} from '../../State/WalletState';
import {ReadTransactions} from '../../FileOperations/ReadTransactions';
import {ReadTransactionInfo} from '../../FileOperations/ReadTransactionInfo';
import {ReadWalletDetails} from '../../FileOperations/ReadWalletDetails';
import {nFormatter} from './NumberFormetter';
import DogePriceFixer from './DogePriceFixer';

interface Props {
  type: 'usd' | 'doge';
}

function TotalChart(props: Props) {
  const [transactions, setTransacitons] = useState<
    {date: string; value: number}[]
  >([]);
  const walletID = useWallet(state => state.id);

  useEffect(() => {
    readTransaction().then(undefined);
  }, [walletID]);

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
      transactionResponse.splice(10, transactionResponse.length);
      const transactionMap: {date: string; value: number}[] = [];
      for (const transaction of transactionResponse) {
        if (props.type === 'usd') {
          const transactionInfo = await ReadTransactionInfo(transaction.hash);
          if (transactionInfo) {
            let total = 0;
            transactionInfo.inputs
              .filter(inputList => inputList.recipient === walletID)
              .forEach(input => (total -= input.value_usd));
            transactionInfo.outputs
              .filter(outputList => outputList.recipient === walletID)
              .forEach(output => (total += output.value_usd));

            transactionMap.push({
              date:
                new Date(transactionInfo.transaction.date).getDate() +
                '/' +
                (Number(new Date(transactionInfo.transaction.date).getMonth()) +
                  1),
              value: total,
            });
          }
        } else {
          transactionMap.push({
            date:
              new Date(transaction.time.split(' ')[0]).getDate() +
              '/' +
              (Number(new Date(transaction.time.split(' ')[0]).getMonth()) + 1),
            value: transaction.balance_change,
          });
        }
      }

      transactionMap.map((transaction, index) => {
        if (index !== 0) {
          transaction.value += transactionMap[index - 1].value;
        } else {
          transaction.value = balance;
        }

        return transaction;
      });

      setTransacitons(transactionMap.reverse());
    }
  }, [walletID]);

  return (
    <View>
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
                        : Number(DogePriceFixer(transaction.value, true)),
                    )
                  : [0],
            },
          ],
        }}
        width={Dimensions.get('window').width - 50} // from react-native
        height={180}
        yAxisLabel={props.type === 'usd' ? '$' : ''}
        formatYLabel={label => nFormatter(Number(label), 1)}
        yAxisInterval={1} // optional, defaults to 1
        withDots={false}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#000',
          },
        }}
        bezier
        style={{
          marginVertical: 30,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

export default TotalChart;
