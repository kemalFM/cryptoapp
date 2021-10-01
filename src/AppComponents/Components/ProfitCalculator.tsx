/**
 * This page is a tab on home screen where you can see how much profit you have made from the first day you bought DOGECoin.
 * The calculation is simple, the BlockChair api provides that how much in us dollars you have paid to get your DogeCoins and how much you spent in USD, so the calculation is
 * SPENT_IN_USD MINUS(-) RECEIVED_IN_USD PLUS(+) BALANCE RIGHT RIGHT NOW IN USD
 * **/

import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ReadWallet} from '../../FileOperations/ReadWalletDetails';
import {useWallet} from '../../State/WalletState';
import {useExchangeRates} from '../../State/ExchangeRates';
import PriceConverter from './PriceConverter';
import NumberFormat from 'react-number-format';
import {I18N} from '../../I18N/I18N';
import {useLanguageState} from '../../State/LanguageState';
import { AddressType } from "../../Repositories/WalletType";

export default function ProfitCalculator() {
  const language = useLanguageState(state => state.language);
  const [loading, setLoading] = useState(true);
  const [estimatedProfit, setEstimatedProfit] = useState(0);
  const exchangeRates = useExchangeRates();
  const [walletData, setWalletData] = useState<AddressType | null>(null);
  const walletInfo = useWallet();

  /**
   * Calculation function
   * Reading wallet from the Storage on the phone,
   * WalletID is coming from the state, which is defined at top as walletInfo;
   * If something goes wrong while getting wallet information we are just returning void and setting loading false and on screen the default value which is 0 will be shown
   *
   * **/
  const calculateEstimate = useCallback(async () => {
    const readWallet = await ReadWallet(walletInfo.id);
    if (!readWallet) {
      setLoading(false);
      return;
    }
    setWalletData(readWallet);
    const calculation =
      readWallet.spent_usd - readWallet.received_usd + readWallet.balance_usd;
    setEstimatedProfit(calculation);
    setLoading(false);
  }, [walletInfo]);

  useEffect(() => {
    calculateEstimate().then(undefined);
  }, [calculateEstimate]);

  return (
    <View style={styles.holder}>
      <Text style={styles.taxFree}>
        {I18N('profitCalculator.totalInvested', language)}
      </Text>
      <Text style={styles.text}>
      {walletData === null ? (
        I18N('profitCalculator.calculating', language)
      ) : (
        <NumberFormat
          value={PriceConverter(
            walletData.received_usd,
            exchangeRates.currency,
            exchangeRates.rates,
          )}
          displayType={'text'}
          thousandSeparator={exchangeRates.currency === 'EUR' ? '.' : ','}
          decimalSeparator={exchangeRates.currency === 'EUR' ? ',' : '.'}
          decimalScale={2}
          renderText={text => <Text style={styles.text}>{text} {exchangeRates.currency}</Text>}
        />
      )}
      </Text>

      <Text style={styles.taxFree}>
        {I18N('profitCalculator.totalCashOut', language)}
      </Text>
      <Text style={styles.text}>
        {walletData === null ? (
          I18N('profitCalculator.calculating', language)
        ) : (
          <NumberFormat
            value={PriceConverter(
              walletData.spent_usd,
              exchangeRates.currency,
              exchangeRates.rates,
            )}
            displayType={'text'}
            thousandSeparator={exchangeRates.currency === 'EUR' ? '.' : ','}
            decimalSeparator={exchangeRates.currency === 'EUR' ? ',' : '.'}
            decimalScale={2}
            renderText={text => <Text style={styles.text}>{text} {exchangeRates.currency}</Text>}
          />
        )}
      </Text>

      <Text style={styles.taxFree}>
        {I18N('profitCalculator.estimatedProfit', language)}
      </Text>
      <Text style={styles.text}>
        {loading ? (
          I18N('profitCalculator.calculating', language)
        ) : (
          <NumberFormat
            value={PriceConverter(
              estimatedProfit,
              exchangeRates.currency,
              exchangeRates.rates,
            )}
            displayType={'text'}
            thousandSeparator={exchangeRates.currency === 'EUR' ? '.' : ','}
            decimalSeparator={exchangeRates.currency === 'EUR' ? ',' : '.'}
            decimalScale={2}
            renderText={text => <Text style={styles.text}>{text}  {exchangeRates.currency}</Text>}
          />
        )}

      </Text>
    </View>
  );
}
// new Intl.NumberFormat('de-DE', {
//   currency: exchangeRates.currency,
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// }).format(
//   PriceConverter(
//     estimatedProfit,
//     exchangeRates.currency,
//     exchangeRates.rates,
//   ),
// ) +
// ' ' +
// exchangeRates.currency
const styles = StyleSheet.create({
  textSmall: {
    textAlign: 'center',
    fontSize: 17,
    paddingBottom: 20,
  },
  taxFree: {
    textAlign: 'center',
    fontSize: 22,
    paddingBottom: 5,
    paddingTop: 5,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  holder: {
    height: 240,
    justifyContent: 'center',
  },
});
