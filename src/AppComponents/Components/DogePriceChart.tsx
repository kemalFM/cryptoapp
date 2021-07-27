import {LineChart} from 'react-native-chart-kit';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DogePriceType} from '../../Repositories/DogePriceType';
import {GetPrices} from '../../Repositories/GetStats';
import ArrowSVG from '../../assets/arrow.svg';

export default function DogePriceChart(props: {
  currentPrice: number;
  balanceDiff: number;
}) {
  const [prices, setPrices] = useState<DogePriceType | null>(null);

  useEffect(() => {
    GetPrices().then(response => {
      if (response) {
        setPrices(response);
      }
    });
  }, []);

  return (
    <View style={styles.topHolder}>
      <View style={styles.balanceHolder}>
        <View style={styles.balanceLeftHolder}>
          <Text style={styles.balanceText}>Current Price</Text>
          <View style={styles.balanceTotalAndCurrency}>
            <Text style={styles.balanceTotal}>{props.currentPrice}</Text>
            <Text style={styles.balanceCurrency}>USD</Text>
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
      <LineChart
        data={{
          labels:
            prices !== null
              ? prices.data.map(price => {
                  const date = new Date(price.date);
                  return date.getDate().toString();
                })
              : ['0'],
          datasets: [
            {
              data:
                prices !== null
                  ? prices.data.map(price => price['price(doge_usd)'])
                  : [0],
            },
          ],
        }}
        width={Dimensions.get('window').width - 50} // from react-native
        height={180}
        yAxisLabel="$"
        yAxisInterval={1} // optional, defaults to 1
        withDots={false}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#000',
          },
        }}
        bezier
        style={{
          marginVertical: 30,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topHolder: {
    marginTop: 25,
  },
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
