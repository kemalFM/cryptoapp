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
import {useLanguageState} from '../../State/LanguageState';
import {I18N} from '../../I18N/I18N';

export default function TaxFreeCalculator() {
  const language = useLanguageState(state => state.language);
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
   * this function calculates total you invested a year ago, and total invested in a year also calculates chronologically the spendings
   * to calculate exact amount you may be able to cash out at current time.
   */
  const calculateTotal = useCallback(async () => {
    const readWallet = await ReadWallet(walletInfo.id);
    if (!readWallet) {
      setLoading(false);
      return;
    }

    /**
     * Reading real wallet data
     */
    const readTransactions = await ReadTransactions(walletInfo.id);

    if (!readTransactions) {
      setLoading(false);
      return;
    }

    // Converting date strings inside transactions to Date object

    const mappedDates = readTransactions.map(transaction => {
      const splitDate = transaction.time.split(' ');
      const newDate = splitDate[0].split('-');
      const newTime = splitDate[1].split(':');
      const newParsedDate = new Date(
        new Date().setUTCFullYear(
          Number(newDate[0]),
          Number(newDate[1]) - 1,
          Number(newDate[2]),
        ),
      ).setUTCHours(Number(newTime[0]), Number(newTime[1]), Number(newTime[2]));
      return {
        ...transaction,
        time: new Date(newParsedDate),
      };
    });

    // Getting current date and 1 year ago from today.
    const oneYearAgo: Date = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    );

    /** Calculating total balance changes in one year and older than a year
     *balance_change holds (+) and (-) for changes for example if you have spent
     * 1000 dogecoins it holds -1000 and if you get 1000 dogecoins it holds 1000
     * FULL REF TO DOCUMENTATION OF TRANSACTION API CAN BE FOUND HERE:
     * https://blockchair.com/api/docs#link_M2
     * Also types can be found under /Repositories/WalletType.ts(*TransactionType)
     */

    let olderThanAYear = mappedDates
      .filter(transaction => transaction.time < oneYearAgo)
      .reduce((a, b) => a + b.balance_change, 0);

    let calculation = 0;

    mappedDates
      .filter(transaction => transaction.time >= oneYearAgo)
      .reverse()
      .forEach(transaction => {
        calculation += transaction.balance_change;
        if (calculation < 0) {
          olderThanAYear += calculation;
        }
      });

    if (olderThanAYear === 0) {
      setTotalFree(0);
      setTotalFreeInUSD(0);
    } else {
      // const calculation = olderThanAYear - Math.abs(insideOneYear);

      if (olderThanAYear <= 0) {
        setTotalFree(0);
        setTotalFreeInUSD(0);
      } else {
        setTotalFree(olderThanAYear);
        if (dogePrices.prices !== null) {
          const latestPriceInUSD =
            dogePrices.prices.data[dogePrices.prices.data.length - 1][
              'price(doge_usd)'
            ];
          setTotalFreeInUSD(
            (DogePriceFixer(olderThanAYear, true) as number) * latestPriceInUSD,
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
      <Text style={styles.taxFree}>{I18N('taxFree.total', language)}</Text>
      <Text style={styles.text}>
        {loading
          ? I18N('taxFree.calculating', language)
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
        {loading
          ? I18N('taxFree.calculating', language)
          : DogePriceFixer(totalFree) + ' DOGE'}
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
