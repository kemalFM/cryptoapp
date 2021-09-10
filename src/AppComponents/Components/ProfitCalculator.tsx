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
import {I18N} from '../../I18N/I18N';
import {useLanguageState} from '../../State/LanguageState';

export default function ProfitCalculator() {
  const language = useLanguageState(state => state.language);
  const [loading, setLoading] = useState(true);
  const [estimatedProfit, setEstimatedProfit] = useState(0);
  const exchangeRates = useExchangeRates();
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
        {I18N('totalEstimatedProfit', language)}
      </Text>
      <Text style={styles.text}>
        {loading
          ? I18N('profitCalculator.calculating', language)
          : new Intl.NumberFormat('en-US', {
              currency: exchangeRates.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(
              PriceConverter(
                estimatedProfit,
                exchangeRates.currency,
                exchangeRates.rates,
              ),
            ) +
            ' ' +
            exchangeRates.currency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textSmall: {
    textAlign: 'center',
    fontSize: 17,
    paddingBottom: 20,
  },
  taxFree: {
    textAlign: 'center',
    fontSize: 22,
    paddingBottom: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  holder: {
    height: 240,
    justifyContent: 'center',
  },
});
