import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Options} from 'react-native-navigation';
import {TransactionType} from '../Repositories/WalletType';
import {
  InOutType,
  TransactionInfo
} from '../Repositories/TransactionInfoType';
import {GetTransactionInfo} from '../Repositories/GetTransactionInfo';
import {useWallet} from '../State/WalletState';
import {ReadTransactionInfo} from '../FileOperations/ReadTransactionInfo';
import {SaveTransactionInfo} from '../FileOperations/SaveTransactionInfo';

type Props = {
  componentId: string;
  transaction: TransactionType;
};

function TransactionDetails(props: Props) {
  const walletID = useWallet(state => state.id);

  const [transactionInfo, setTransactionInfo] =
    useState<TransactionInfo | null>(null);
  const [transactionDetails, setTransactionDetails] =
    useState<InOutType | null>(null);


  const getItFromApi = useCallback(async () => {
    GetTransactionInfo(props.transaction.hash).then(async response => {
      if (response !== false) {
        await SaveTransactionInfo(
          props.transaction.hash,
          response.data[props.transaction.hash],
        );

        const searchInputs = response.data[props.transaction.hash].inputs.find(
          input => input.recipient === walletID,
        );
        const searchOutputs = response.data[
          props.transaction.hash
        ].outputs.find(output => output.recipient === walletID);

        if (props.transaction.balance_change < 0) {
          if (searchInputs !== undefined) {
            setTransactionDetails(searchInputs);
          }
        } else {
          if (searchOutputs !== undefined) {
            setTransactionDetails(searchOutputs);
          }
        }

        setTransactionInfo(response.data[props.transaction.hash].transaction);
      }
    });
  }, [props.transaction.balance_change, props.transaction.hash, walletID]);


  useEffect(() => {
    ReadTransactionInfo(props.transaction.hash).then(response => {
      if (response) {
        const searchOutputs = response.outputs.find(
          output => output.recipient === walletID,
        );
        const searchInputs = response.inputs.find(
          input => input.recipient === walletID,
        );

        if (props.transaction.balance_change < 0) {
          if (searchInputs !== undefined) {
            setTransactionDetails(searchInputs);
          }
        } else {
          if (searchOutputs !== undefined) {
            setTransactionDetails(searchOutputs);
          }
        }
        setTransactionInfo(response.transaction);
      } else {
        getItFromApi().then(undefined);
      }
    });
  }, [walletID, props.transaction, getItFromApi]);

  return (
    <View style={styles.holder}>
      <View style={styles.item}>
        <Text style={styles.itemName}>BLOCK ID</Text>
        <Text style={styles.itemDescription}>{props.transaction.block_id}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.itemName}>TIME</Text>
        <View>
          <Text style={styles.itemDescription}>
            {props.transaction.time.split(' ')[0]}
          </Text>
          <Text style={styles.itemDescription}>
            {props.transaction.time.split(' ')[1]}
          </Text>
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.itemName}>AMOUNT</Text>
        <View>
          <View style={styles.priceHolder}>
            <Text style={styles.itemDescription}>
              {props.transaction.balance_change.toFixed(2)}
            </Text>
            <Text style={styles.currencyHolder}>DOGE</Text>
          </View>
          <View style={styles.priceHolder}>
            <Text style={styles.itemDescription}>
              {props.transaction.balance_change < 0 && '-'}
              {transactionDetails?.value_usd.toFixed(2)}
            </Text>
            <Text style={styles.currencyHolder}>USD</Text>
          </View>
        </View>
      </View>

      {/*<View style={styles.item}>*/}
      {/*  <Text style={styles.itemName}>BALANCE ??</Text>*/}
      {/*  <View style={styles.priceHolder}>*/}
      {/*    <Text style={styles.itemDescription}>0.009120</Text>*/}
      {/*    <Text style={styles.currencyHolder}>DOGE</Text>*/}
      {/*  </View>*/}
      {/*</View>*/}

      {/*<View style={styles.item}>*/}
      {/*  <Text style={styles.itemName}>BALANCE (USD) ??</Text>*/}
      {/*  <View style={styles.priceHolder}>*/}
      {/*    <Text style={styles.itemDescription}>123.15</Text>*/}
      {/*    <Text style={styles.currencyHolder}>USD</Text>*/}
      {/*  </View>*/}
      {/*</View>*/}

      <View style={styles.item}>
        <Text style={styles.itemName}>FEE</Text>
        <View style={styles.priceHolder}>
          <Text style={styles.itemDescription}>{transactionInfo?.fee_usd.toFixed(2)}</Text>
          <Text style={styles.currencyHolder}>USD</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  currencyHolder: {
    marginTop: 4,
    marginLeft: 3,
  },
  priceHolder: {
    flexDirection: 'row',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  itemName: {
    color: '#A0A0A0',
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: 27,
  },
  itemDescription: {
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 27,
  },
  holder: {
    paddingHorizontal: 25,
    paddingTop: 40,
  },
});

TransactionDetails.options = {
  topBar: {
    searchBar: {
      visible: false,
    },
  },
} as Options;

export default TransactionDetails;
