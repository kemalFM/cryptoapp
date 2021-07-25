import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationCommands} from 'react-native-navigation-hooks/dist/helpers/createNavigationCommands';
import {TransactionType} from '../../Repositories/WalletType';
import {TransactionInnerDetails} from '../../Repositories/TransactionInfoType';
import {ReadTransactionInfo} from '../../FileOperations/ReadTransactionInfo';
import {useWallet} from '../../State/WalletState';

export default function Transaction(props: {
  status: boolean;
  navigation: NavigationCommands;
  transaction: TransactionType;
}) {
  const [transactionInfo, setTransactionInfo] =
    useState<TransactionInnerDetails | null>(null);
  const [totalInUSD, setTotalInUSD] = useState(0);
  const walletID = useWallet(state => state.id);

  useEffect(() => {
    ReadTransactionInfo(props.transaction.hash).then(response => {
      if (response !== false) {
        setTransactionInfo(response);

        let totalUS = 0;
        response.inputs
          .filter(inputList => inputList.recipient === walletID)
          .forEach(input => (totalUS -= input.value_usd));
        response.outputs
          .filter(outputList => outputList.recipient === walletID)
          .forEach(output => (totalUS += output.value_usd));

        setTotalInUSD(totalUS);
      }
    });
  }, [walletID]);

  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.push('de.kfm.TransactionDetails', {
          transaction: props.transaction,
        })
      }
      style={
        props.status
          ? {...styles.holderPlus, ...styles.holder}
          : {...styles.holderMinus, ...styles.holder}
      }>
      <Text style={styles.transactionTime}>{props.transaction.time}</Text>
      <View style={styles.receiveSendHolder}>
        <Text style={styles.receiveSendText}>Block ID</Text>
        <Text style={styles.transactionID}>{props.transaction.block_id}</Text>
      </View>
      <View style={styles.transactionAmountHolder}>
        <View style={styles.transactionTotalAndCurrencyHolder}>
          <Text style={styles.transactionAmount}>
            {props.transaction.balance_change.toFixed(2)}
          </Text>
          <Text style={styles.transactionCurrency}>DOGE</Text>
        </View>

        <View style={styles.transactionTotalAndCurrencyHolder}>
          <Text style={styles.transactionAmount}>
            {totalInUSD === 0
              ? '...'
              : new Intl.NumberFormat('en-US', {
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totalInUSD)}
          </Text>
          <Text style={styles.transactionCurrency}>USD</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  transactionTime: {
    fontSize: 13,
    color: '#A0A0A0',
    marginBottom: 5,
  },
  transactionAmountHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionTotalAndCurrencyHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiveSendText: {
    fontSize: 20,
    lineHeight: 27,
    color: '#A0A0A0',
  },
  transactionID: {
    fontSize: 20,
    lineHeight: 27,
    color: '#A0A0A0',
  },
  transactionAmount: {
    fontSize: 20,
    lineHeight: 27,
    color: '#212121',
    fontWeight: 'bold',
  },
  transactionCurrency: {
    fontSize: 12,
    lineHeight: 17,
    color: '#212121',
    marginTop: 2,
  },
  receiveSendHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  holderPlus: {
    borderLeftColor: '#248E38',
    borderLeftWidth: 10,
  },
  holderMinus: {
    borderLeftColor: '#D94D57',
    borderLeftWidth: 10,
  },
  holder: {
    borderRadius: 5,
    padding: 20,
    color: '#fff',
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 5,
  },
});
