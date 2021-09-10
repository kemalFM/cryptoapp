/**
 * This view is showing total balance
 * in DOGECoins
 * in USD
 * in EUR
 * Also shows the percentage changed on DogeCoin price on the right side of the view.
 */

import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ArrowSVG from '../../assets/arrow.svg';
import {useWallet} from '../../State/WalletState';
import {ReadWalletDetails} from '../../FileOperations/ReadWalletDetails';
import {AddressType} from '../../Repositories/WalletType';
import DogePriceFixer from './DogePriceFixer';
import {useExchangeRates} from '../../State/ExchangeRates';
import PriceConverter from './PriceConverter';
import {I18N} from '../../I18N/I18N';
import {useLanguageState} from '../../State/LanguageState';

export default function TopBalance(props: {
  balanceDiff: number;
  type: 'doge' | 'usd';
}) {
  const language = useLanguageState(state => state.language);
  const walletState = useWallet();
  const [balance, setBalance] = useState(0);

  const exchangeRates = useExchangeRates();

  useEffect(() => {
    ReadWalletDetails(walletState.id)
      .then(response => {
        if (response !== false) {
          const walletInfo = response as AddressType;
          if (props.type === 'usd') {
            setBalance(walletInfo.balance_usd);
          } else {
            setBalance(walletInfo.balance);
          }
        }
      })
      .catch(() => undefined);
  }, [props.type, walletState.id]);

  return (
    <View style={styles.balanceHolder}>
      <View style={styles.balanceLeftHolder}>
        <Text style={styles.balanceText}>
          {I18N('topBalance.balance', language)}
        </Text>
        <View style={styles.balanceTotalAndCurrency}>
          <Text style={styles.balanceTotal}>
            {props.type === 'doge'
              ? DogePriceFixer(balance)
              : new Intl.NumberFormat('en-US', {
                  currency: exchangeRates.currency,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  PriceConverter(
                    balance,
                    exchangeRates.currency,
                    exchangeRates.rates,
                  ),
                )}
          </Text>
          <Text style={styles.balanceCurrency}>
            {props.type === 'doge' ? 'DOGE' : exchangeRates.currency}
          </Text>
        </View>
      </View>
      <View style={styles.arrowAndPercentage}>
        <ArrowSVG
          fill={props.balanceDiff < 0 ? '#D94D57' : '#248E38'}
          style={{
            transform: [{rotate: props.balanceDiff < 0 ? '0deg' : '180deg'}],
            ...styles.arrowStyle,
          }}
        />
        <Text
          style={
            props.balanceDiff < 0
              ? styles.balanceDiffMinus
              : styles.balanceDiffPlus
          }>
          {props.balanceDiff.toFixed(2)} %
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceTotalAndCurrency: {
    flexDirection: 'row',
  },
  arrowStyle: {
    marginTop: 10,
    marginRight: 4,
  },
  arrowAndPercentage: {
    flexDirection: 'row',
    marginTop: 30,
  },
  balanceLeftHolder: {
    flexDirection: 'column',
  },
  balanceHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceText: {
    fontSize: 20,
    lineHeight: 27,
    color: '#212121',
    fontWeight: 'bold',
  },
  balanceTotal: {
    fontSize: 25,
    lineHeight: 34,
    color: '#212121',
    fontWeight: 'bold',
    position: 'relative',
  },
  balanceCurrency: {
    fontSize: 12,
    lineHeight: 17,
    color: '#212121',
    marginTop: 4,
  },
  balanceDiffPlus: {
    fontSize: 20,
    lineHeight: 27,
    color: '#248E38',
  },
  balanceDiffMinus: {
    color: '#D94D57',
    fontSize: 20,
    lineHeight: 27,
  },
});
