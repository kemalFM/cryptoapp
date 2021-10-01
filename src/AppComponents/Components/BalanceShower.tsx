import {StyleSheet, Text, View} from 'react-native';
import {I18N} from '../../I18N/I18N';
import PriceConverter from './PriceConverter';
import React, {useEffect, useState} from 'react';
import DogePriceFixer from './DogePriceFixer';
import {useLanguageState} from '../../State/LanguageState';
import {ReadWalletDetails} from '../../FileOperations/ReadWalletDetails';
import {AddressType} from '../../Repositories/WalletType';
import {useWallet} from '../../State/WalletState';
import {useExchangeRates} from '../../State/ExchangeRates';
import NumberFormat from 'react-number-format';

export default function BalanceShower() {
  const language = useLanguageState(state => state.language);
  const [balance, setBalance] = useState(0);
  const exchangeRates = useExchangeRates();

  const walletState = useWallet();

  useEffect(() => {
    ReadWalletDetails(walletState.id)
      .then(response => {
        if (response !== false) {
          const walletInfo = response as AddressType;
          setBalance(walletInfo.balance_usd);
        }
      })
      .catch(() => undefined);
  }, [walletState.id]);

  return (
    <View style={styles.holder}>
      <Text style={styles.taxFree}>{I18N('homeScreen.balance', language)}</Text>
      <Text style={styles.text}>
        <NumberFormat
          value={PriceConverter(
            balance,
            exchangeRates.currency,
            exchangeRates.rates,
          )}
          displayType={'text'}
          thousandSeparator={exchangeRates.currency === 'EUR' ? '.' : ','}
          decimalSeparator={exchangeRates.currency === 'EUR' ? ',' : '.'}
          decimalScale={2}
          renderText={text => <Text style={styles.text}>{text} </Text>}
        />
        {exchangeRates.currency}
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
