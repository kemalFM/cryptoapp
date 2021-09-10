/**
 * This file is a view for transactions tab,
 * Shows all transactions in FlatList
 * If we already have the transaction details it also shows the transaction in USD
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Options} from 'react-native-navigation/lib/src/interfaces/Options';
import Transaction from './Components/Transaction';
import {
  useNavigation,
  useNavigationSearchBarUpdate,
} from 'react-native-navigation-hooks';
import {useWallet} from '../State/WalletState';
import {ReadTransactions} from '../FileOperations/ReadTransactions';
import {TransactionType} from '../Repositories/WalletType';
import UpArrowSVG from '../assets/uparrow.svg';
import {I18N} from '../I18N/I18N';
import {useLanguageState} from '../State/LanguageState';

type Props = {
  componentId: string;
};

function Transactions(props: Props) {
  const language = useLanguageState(state => state.language);
  const navigation = useNavigation(props.componentId);

  const walletState = useWallet();
  const [beforeSearch, setBeforeSearch] = useState<TransactionType[]>([]);
  const [lastTransactions, setLastTransactions] = useState<TransactionType[]>(
    [],
  );

  const listRef = useRef<FlatList<TransactionType>>(null);

  useEffect(() => {
    navigation.mergeOptions({
      bottomTab: {
        text: I18N('navigation.transactions', language)
      },
      topBar: {
        title: {
          text: I18N('transactions', language),
        },
        rightButtons: [
          {
            id: 'de.kfm.TopQRCodeScanRight',
            component: {
              name: 'de.kfm.TopQRCodeScan',
              passProps: {
                navigation: navigation,
              },
            },
          },
        ],
      },
    });
  }, [navigation, language]);

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
  }, [walletState.id]);

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

  const goToTop = useCallback(() => {
    if (listRef.current !== null) {
      listRef.current.scrollToIndex({
        animated: true,
        index: 0,
      });
    }
  }, [listRef]);

  return (
    <SafeAreaView>
      <View style={styles.flatHolder}>
        <FlatList
          ref={listRef}
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
      <TouchableOpacity onPress={goToTop} style={styles.goTopHolder}>
        <UpArrowSVG fill="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flatHolder: {
    height: '100%',
  },
  goTopHolder: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    zIndex: 999,
    bottom: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#0e0e0e',
    padding: 5,
    elevation: 9,
    borderRadius: 8,
  },
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
    zIndex: 9,
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
