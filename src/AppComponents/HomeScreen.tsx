import React, {useEffect, useState} from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Options} from 'react-native-navigation/lib/src/interfaces/Options';
import TopBalance from './Components/TopBalance';
import Transaction from './Components/Transaction';
import {
  setRoot, showModal,
  useNavigation,
  useNavigationSearchBarUpdate
} from "react-native-navigation-hooks";
import {Navigation} from 'react-native-navigation';
import {useWallet} from '../State/WalletState';
import {removeWalletID} from '../State/WalletStore';
import {ReadTransactions} from '../FileOperations/ReadTransactions';
import {TransactionType} from '../Repositories/WalletType';
import TotalChart from "./Components/TotalChart";

type Props = {
  componentId: string;
};

function HomeScreen(props: Props) {
  const navigation = useNavigation(props.componentId);
  useNavigationSearchBarUpdate(console.log, props.componentId);
  const walletState = useWallet();
  const [lastTransactions, setLastTransactions] = useState<TransactionType[]>(
    [],
  );

  useEffect(() => {
    ReadTransactions(walletState.id).then(response => {
      if (response !== false) {
        response.splice(5, response.length);
        setLastTransactions(
          response.map(transaction => {
            const balanceLength = transaction.balance_change.toString().length;
            const splitBalance =
              transaction.balance_change
                .toString()
                .slice(0, balanceLength - 8) +
              '.' +
              transaction.balance_change.toString().slice(balanceLength - 8);
            return {
              ...transaction,
              balance_change: Number(splitBalance),
            };
          }),
        );
      }
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollViewStyle}>
        <TopBalance />
        <TotalChart />
        <Text style={styles.transactionText}>Transaction</Text>
        {lastTransactions.map(transaction => (
          <Transaction
            transaction={transaction}
            status={transaction.balance_change >= 0}
            navigation={navigation}
          />
        ))}
        <TouchableOpacity
          style={styles.buttonHolder}
          onPress={() => navigation.mergeOptions({
            bottomTabs: {
              currentTabIndex: 1
            }
          })}>
            <Text style={styles.buttonText}>Show More</Text>
        </TouchableOpacity>
        <View style={styles.fixScrollHeight} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonHolder: {
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
    backgroundColor: '#212121',
    height: 42,
    borderRadius: 8,
    padding: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 31,
    fontSize: 20,
  },
  fixScrollHeight: {
    height: 50,
  },
  transactionText: {
    fontSize: 30,
    lineHeight: 41,
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
    color: '#212121',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  scrollViewStyle: {
    paddingTop: 25,
    paddingHorizontal: 25,
  },
});

HomeScreen.options = {
  topBar: {
    title: {
      text: 'Crypto Brand',
    },
  },
} as Options;

export default HomeScreen;
