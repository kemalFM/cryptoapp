import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ArrowSVG from '../../assets/arrow.svg';
import {useWallet} from '../../State/WalletState';
import {ReadWalletDetails} from '../../FileOperations/ReadWalletDetails';
import {AddressType} from '../../Repositories/WalletType';

export default function TopBalance() {
  const walletState = useWallet();
  const [balance, setBalance] = useState(0);
  const [balanceDiff, setBalanceDiff] = useState(0);

  useEffect(() => {
    ReadWalletDetails(walletState.id).then(response => {
      if (response !== false) {
        const walletInfo = response as AddressType;
        setBalance(walletInfo.balance_usd);
        setBalanceDiff(1.75);
      }
    });
  }, []);

  return (
    <View style={styles.balanceHolder}>
      <View style={styles.balanceLeftHolder}>
        <Text style={styles.balanceText}>Balance</Text>
        <View style={styles.balanceTotalAndCurrency}>
          <Text style={styles.balanceTotal}>
            {new Intl.NumberFormat('en-US', {
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(balance)}{' '}
          </Text>
          <Text style={styles.balanceCurrency}>USD</Text>
        </View>
      </View>
      <View style={styles.arrowAndPercentage}>
        <ArrowSVG
          fill={balanceDiff < 0 ? '#D94D57' : '#248E38'}
          style={{
            transform: [{rotate: balanceDiff < 0 ? '0deg' : '180deg'}],
            ...styles.arrowStyle,
          }}
        />
        <Text
          style={
            balanceDiff < 0 ? styles.balanceDiffMinus : styles.balanceDiffPlus
          }>
          {balanceDiff.toFixed(2)} %
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
