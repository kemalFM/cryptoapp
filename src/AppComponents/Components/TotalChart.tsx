import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {TransactionInnerDetails} from '../../Repositories/TransactionInfoType';
import {useWallet} from '../../State/WalletState';
import {ReadTransactions} from '../../FileOperations/ReadTransactions';
import {
  ReadTransaction,
  ReadTransactionInfo,
} from '../../FileOperations/ReadTransactionInfo';
import {ReadWalletDetails} from '../../FileOperations/ReadWalletDetails';
import {AddressType, Wallet} from '../../Repositories/WalletType';
import { nFormatter } from "./NumberFormetter";

interface Props {}

const today = new Date();

function TotalChart(props: Props) {
  const [transactions, setTransacitons] = useState<
    {date: string; usd: number}[]
  >([]);
  const walletID = useWallet(state => state.id);
  const [walletDetails, setWalletDetails] = useState<AddressType | null>(null);

  useEffect(() => {
    readTransaction().then(undefined);
  }, [walletID]);

  const readTransaction = useCallback(async () => {
    const transactionList = await ReadTransactions(walletID);
    const walletData = await ReadWalletDetails(walletID);
    let balanceUSD = 0;
    if (walletData) {
      setWalletDetails(walletData);
      balanceUSD = walletData.balance_usd;
    }

    if (transactionList) {
      let transactionResponse = transactionList;
      transactionResponse.splice(10, transactionResponse.length);
      const transactionMap: {date: string; usd: number}[] = [];
      for (const transaction of transactionResponse) {
        const transactionInfo = await ReadTransactionInfo(transaction.hash);
        if (transactionInfo) {
          let totalUS = 0;
          transactionInfo.inputs
            .filter(inputList => inputList.recipient === walletID)
            .forEach(input => (totalUS -= input.value_usd));
          transactionInfo.outputs
            .filter(outputList => outputList.recipient === walletID)
            .forEach(output => (totalUS += output.value_usd));
          transactionMap.push({
            date:
              new Date(transactionInfo.transaction.date).getDate() +
              '/' +
              (Number(new Date(transactionInfo.transaction.date).getMonth()) +
                1),
            usd: totalUS,
          });
        }
      }

      console.log(transactionMap);
      transactionMap.map((transaction, index) => {
        if (index !== 0) {
          transaction.usd += transactionMap[index - 1].usd;
        } else {
          transaction.usd = balanceUSD;
        }

        return transaction;
      });

      console.log(transactionMap);

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
                  ? transactions.map(transaction => Number(transaction.usd))
                  : [0],
            },
          ],
        }}
        width={Dimensions.get('window').width - 50} // from react-native
        height={180}
        yAxisLabel="$"
        formatYLabel={(label) => nFormatter(Number(label), 1)}
        yAxisInterval={1} // optional, defaults to 1
        withDots={false}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
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
