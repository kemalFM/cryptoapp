import React, { useCallback, useEffect, useState } from "react";
import {StyleSheet, Text, View} from 'react-native';
import { ReadWallet } from "../../FileOperations/ReadWalletDetails";
import { ReadTransactions } from "../../FileOperations/ReadTransactions";
import { useWallet } from "../../State/WalletState";
import DogePriceFixer from "./DogePriceFixer";

export default function TaxFreeCalculator() {

  const [totalFree, setTotalFree] = useState(0);
  const [loading, setLoading] = useState(true);
  const walletInfo = useWallet();

  useEffect(() => {

    calculateTotal().then(undefined);

  }, []);


  const calculateTotal = useCallback(async () => {

    const readWallet = await ReadWallet(walletInfo.id);
    if(!readWallet){
      setLoading(false);
      return;
    }

    const readTransactions = await ReadTransactions(walletInfo.id);

    if(!readTransactions){
      setLoading(false);
      return;
    }


    const mappedDates = readTransactions.map((transaction) => {
      return {
        ...transaction,
        time: new Date(transaction.time.split(' ')[0])
      }
    });

    const today = new Date();
    const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

    const insideOneYear = mappedDates.filter((transaction) => transaction.time >= oneYearAgo).reduce((a, b) => a + b.balance_change, 0);
    const olderThanAYear = mappedDates.filter(transaction => transaction.time < oneYearAgo).reduce((a, b) => a + b.balance_change, 0);


    if(olderThanAYear === 0){
      setTotalFree(0);
    }else{
      const calculation = olderThanAYear - Math.abs(insideOneYear);

      if(calculation <= 0){
        setTotalFree(0);
      }else{
        setTotalFree(calculation);
      }

    }

    setLoading(false);

  }, [walletInfo]);

  return (
    <View style={styles.holder}>
      <Text style={styles.taxFree}>Tax Free Total</Text>
      <Text style={styles.text}>{loading ? "Calculating..." : DogePriceFixer(totalFree) + "\nDOGE"}</Text>
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
    fontWeight: "bold",
    textAlign: 'center',
    alignSelf: 'center',
  },
  holder: {
    height: 240,
    justifyContent: 'center',
  },
});
