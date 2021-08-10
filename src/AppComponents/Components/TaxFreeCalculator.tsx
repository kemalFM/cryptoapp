/**
 * This view calculates total tax free dogecoins you may cash out at the current time.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ReadWallet} from '../../FileOperations/ReadWalletDetails';
import {ReadTransactions} from '../../FileOperations/ReadTransactions';
import {useWallet} from '../../State/WalletState';
import DogePriceFixer from './DogePriceFixer';
import {useExchangeRates} from '../../State/ExchangeRates';
import {useDogePrices} from '../../State/DogePrices';
import PriceConverter from './PriceConverter';

export default function TaxFreeCalculator() {
  const [totalFree, setTotalFree] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalFreeInUSD, setTotalFreeInUSD] = useState(0);
  const exchangeRates = useExchangeRates();
  const dogePrices = useDogePrices();
  const walletInfo = useWallet();

  /**
   * Calculates the tax free in dogecoins and in USD or EUR currencies
   * Firstly reads wallet from the storage by given walletID at start
   * Loads all the transactions, since in german laws you may cash out without tax after a year
   * this function calculates total you invested a year ago, and total invested in a year also calculates the spendings
   * to calculate exact amount you may be able to cash out at current time.
   */
  const calculateTotal = useCallback(async () => {
    const readWallet = await ReadWallet(walletInfo.id);
    if (!readWallet) {
      setLoading(false);
      return;
    }

    const readTransactions = await ReadTransactions(walletInfo.id);

    if (!readTransactions) {
      setLoading(false);
      return;
    }

    // Converting date strings inside transactions to Date object

    const mappedDates = readTransactions.map(transaction => {
      return {
        ...transaction,
        time: new Date(transaction.time.split(' ')[0]),
      };
    });

    // Getting current date and 1 year ago from today.
    const today = new Date();
    const oneYearAgo = new Date(
      new Date().setFullYear(today.getFullYear() - 1),
    );

    /** Calculating total balance changes in one year and older than a year
     *balance_change holds (+) and (-) for changes for example if you have spent
     * 1000 dogecoins it holds -1000 and if you get 1000 dogecoins it holds 1000
     * FULL REF TO DOCUMENTATION OF TRANSACTION API CAN BE FOUND HERE:
     * https://blockchair.com/api/docs#link_M2
     * Also types can be found under /Repositories/WalletType.ts(*TransactionType)
     */
    const insideOneYear = mappedDates
      .filter(transaction => transaction.time >= oneYearAgo)
      .reduce((a, b) => a + b.balance_change, 0);
    const olderThanAYear = mappedDates
      .filter(transaction => transaction.time < oneYearAgo)
      .reduce((a, b) => a + b.balance_change, 0);

    if (olderThanAYear === 0) {
      setTotalFree(0);
      setTotalFreeInUSD(0);
    } else {
      const calculation = olderThanAYear - Math.abs(insideOneYear);

      if (calculation <= 0) {
        setTotalFree(0);
        setTotalFreeInUSD(0);
      } else {
        setTotalFree(calculation);
        if (dogePrices.prices !== null) {
          const latestPriceInUSD =
            dogePrices.prices.data[dogePrices.prices.data.length - 1][
              'price(doge_usd)'
            ];
          setTotalFreeInUSD(
            (DogePriceFixer(calculation, true) as number) * latestPriceInUSD,
          );
        }
      }
    }

    setLoading(false);
  }, [dogePrices, walletInfo]);

  useEffect(() => {
    calculateTotal().then(undefined);
  }, [calculateTotal]);

  return (
    <View style={styles.holder}>
      <Text style={styles.taxFree}>Tax Free Total</Text>
      <Text style={styles.text}>
        {loading
          ? 'Calculating...'
          : new Intl.NumberFormat('en-US', {
              currency: exchangeRates.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(
              PriceConverter(
                totalFreeInUSD,
                exchangeRates.currency,
                exchangeRates.rates,
              ),
            ) +
            ' ' +
            exchangeRates.currency}
      </Text>
      <Text style={styles.text}>
        {loading ? 'Calculating...' : DogePriceFixer(totalFree) + ' DOGE'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
