/**
 *
 * This page is showing chart for latest dogecoin prices for a week.
 * Its located on HomePage at the end of the screen.
 * The chart library which is being used is
 * https://github.com/indiespirit/react-native-chart-kit
 * For getting latest dogecoin prices, app is using the same api as we get transactions which can be found under
 * /Repositories/GetStats.ts*GetPrices();
 *
 *
 */

import {LineChart} from 'react-native-chart-kit';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {GetPrices} from '../../Repositories/GetStats';
import ArrowSVG from '../../assets/arrow.svg';
import {useDogePrices} from '../../State/DogePrices';
import {useLanguageState} from '../../State/LanguageState';
import {I18N} from '../../I18N/I18N';

export default function DogePriceChart(props: {
  currentPrice: number;
  balanceDiff: number;
}) {
  const language = useLanguageState(state => state.language);
  const dogePrices = useDogePrices();

  /**
   * Sending request for the prices and setting it to the global state
   * since the app is using it on some other places as well
   * */
  useEffect(() => {
    GetPrices().then(response => {
      if (response) {
        dogePrices.setPrices(response);
      }
    });
  }, [dogePrices]);

  return (
    <View style={styles.topHolder}>
      <View style={styles.balanceHolder}>
        <View style={styles.balanceLeftHolder}>
          <Text style={styles.balanceText}>
            {I18N('dogePrice.current', language)}
          </Text>
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
            dogePrices.prices !== null
              ? dogePrices.prices.data.map(price => {
                  const date = new Date(price.date);
                  return date.getDate().toString();
                })
              : ['0'],
          datasets: [
            {
              data:
                dogePrices.prices !== null
                  ? dogePrices.prices.data.map(
                      price => price['price(doge_usd)'],
                    )
                  : [0],
            },
          ],
        }}
        width={Dimensions.get('window').width - 50}
        height={180}
        yAxisLabel="$"
        yLabelsOffset={5}
        withDots={true}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 5, // this is setting decimal places the default was 2
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#000',
          },
        }}
        bezier
        style={styles.chartStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartStyle: {
    marginVertical: 30,
    borderRadius: 16,
  },
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
