import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Options} from 'react-native-navigation/lib/src/interfaces/Options';
import TopBalance from './Components/TopBalance';
import Transaction from './Components/Transaction';
import {
  useNavigation,
  useNavigationSearchBarUpdate,
} from 'react-native-navigation-hooks';
import {useWallet} from '../State/WalletState';
import {ReadTransactions} from '../FileOperations/ReadTransactions';
import {TransactionType} from '../Repositories/WalletType';

type Props = {
  componentId: string;
};

function Transactions(props: Props) {
  const navigation = useNavigation(props.componentId);

  const walletState = useWallet();
  const [beforeSearch, setBeforeSearch] = useState<TransactionType[]>([]);
  const [lastTransactions, setLastTransactions] = useState<TransactionType[]>(
    [],
  );


  useEffect(() => {

    navigation.mergeOptions({
      topBar: {
        rightButtons: [
          {
            id: 'de.kfm.TopQRCodeScanRight',
            component: {
              name: 'de.kfm.TopQRCodeScan',
              passProps: {
                navigation: navigation
              }
            }
          }
        ]
      }
    })

  }, []);

  useEffect(() => {
    ReadTransactions(walletState.id).then(response => {
      if (response !== false) {
        const transactionList = response.map(transaction => {
          const balanceLength = transaction.balance_change.toString().length;
          const splitBalance =
            transaction.balance_change.toString().slice(0, balanceLength - 8) +
            '.' +
            transaction.balance_change.toString().slice(balanceLength - 8);
          return {
            ...transaction,
            balance_change: Number(splitBalance),
          };
        });
        setLastTransactions(transactionList);
        setBeforeSearch(transactionList);
      }
    });
  }, []);

  useNavigationSearchBarUpdate(text => {
    if (text.text.length === 0) {
      setLastTransactions(beforeSearch);
      return;
    }
    const filtered = beforeSearch.filter(transaction => {
      return transaction.hash === text.text;
    });
    setLastTransactions(filtered);
  }, props.componentId);

  return (
    <SafeAreaView>
      <View>
        <FlatList
          style={styles.scrollViewStyle}
          data={lastTransactions}
          keyExtractor={item => item.hash}
          renderItem={item => (
            <Transaction
              status={item.item.balance_change >= 0}
              navigation={navigation}
              transaction={item.item}
              key={item.item.hash}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  transactionText: {
    paddingHorizontal: 25,
    paddingTop: 25,
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

Transactions.options = {
  topBar: {
    title: {
      text: 'Transactions',
    },
  },
} as Options;

export default Transactions;
