/**
 * This view shows transaction details
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Options} from 'react-native-navigation';
import {TransactionType} from '../Repositories/WalletType';
import {TransactionInfo} from '../Repositories/TransactionInfoType';
import {GetTransactionInfo} from '../Repositories/GetTransactionInfo';
import {useWallet} from '../State/WalletState';
import {ReadTransactionInfo} from '../FileOperations/ReadTransactionInfo';
import {SaveTransactionInfo} from '../FileOperations/SaveTransactionInfo';
import CalculateTransactionValue from './Components/CalculateTransactionValue';
import {useNavigationScreenPop} from 'react-native-navigation-hooks';
import {useLanguageState} from '../State/LanguageState';
import {I18N} from '../I18N/I18N';

type Props = {
  componentId: string;
  transaction: TransactionType;
  sendNewTransaction?: (transaction: TransactionInfo | null) => void;
};

function TransactionDetails(props: Props) {
  const language = useLanguageState(state => state.language);

  const walletID = useWallet(state => state.id);

  const [transactionInfo, setTransactionInfo] =
    useState<TransactionInfo | null>(null);

  const [loading, setLoading] = useState(true);

  const [totalUSD, setTotalUSD] = useState(0);

  useNavigationScreenPop(
    () => {
      if (props.sendNewTransaction !== undefined) {
        props.sendNewTransaction(transactionInfo);
      }
    },
    {componentId: props.componentId},
  );

  /**
   * This function gets transaction details from api endpoint and caches them for further requests to that transaction
   */
  const getItFromApi = useCallback(async () => {
    GetTransactionInfo(props.transaction.hash)
      .then(async response => {
        if (response !== false) {
          await SaveTransactionInfo(
            props.transaction.hash,
            response.data[props.transaction.hash],
          );

          setTotalUSD(
            CalculateTransactionValue(
              props.transaction,
              response.data[props.transaction.hash],
              walletID,
            ),
          );
          setTransactionInfo(response.data[props.transaction.hash].transaction);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [props.transaction, walletID]);

  /**
   * This function when the view loaded getting transaction details from cache if the app already has
   * If not sending request to the endpoint
   */
  useEffect(() => {
    ReadTransactionInfo(props.transaction.hash).then(response => {
      if (response) {
        const calculate = CalculateTransactionValue(
          props.transaction,
          response,
          walletID,
        );
        setTotalUSD(calculate);
        setLoading(false);
        setTransactionInfo(response.transaction);
      } else {
        getItFromApi().then(undefined);
      }
    });
  }, [walletID, props.transaction, getItFromApi]);

  return (
    <View style={styles.holder}>
      <View style={styles.item}>
        <Text style={styles.itemName}>
          {I18N('transactionDetails.blockID', language)}
        </Text>
        <Text style={styles.itemDescription}>{props.transaction.block_id}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.itemName}>{I18N('transactionDetails.time', language)}</Text>
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
        <Text style={styles.itemName}>
          {I18N('transactionDetails.amount', language)}
        </Text>
        <View>
          <View style={styles.priceHolder}>
            <Text style={styles.itemDescription}>
              {props.transaction.balance_change.toFixed(2)}
            </Text>
            <Text style={styles.currencyHolder}>DOGE</Text>
          </View>
          <View style={styles.priceHolder}>
            <Text style={styles.itemDescription}>
              {loading ? (
                <ActivityIndicator
                  color={Platform.OS === 'android' ? '#0000ff' : undefined}
                />
              ) : (
                totalUSD.toFixed(2)
              )}
            </Text>
            {!loading && <Text style={styles.currencyHolder}>USD</Text>}
          </View>
        </View>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemName}>
          {I18N('transactionDetails.fee', language)}
        </Text>
        <View style={styles.priceHolder}>
          <Text style={styles.itemDescription}>
            {loading ? (
              <ActivityIndicator
                color={Platform.OS === 'android' ? '#0000ff' : undefined}
              />
            ) : (
              transactionInfo?.fee_usd.toFixed(2)
            )}
          </Text>
          {!loading && <Text style={styles.currencyHolder}>USD</Text>}
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
