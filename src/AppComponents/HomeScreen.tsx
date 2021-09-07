/**
 * This is a view for homescreen where the
 * Charts,
 * Last 5 transactions,
 * Tax Free,
 * Profit
 * Views are shown.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Options} from 'react-native-navigation/lib/src/interfaces/Options';
import TopBalance from './Components/TopBalance';
import Transaction from './Components/Transaction';
import {
  useNavigation,
  useNavigationSearchBarUpdate,
} from 'react-native-navigation-hooks';
import {useWallet} from '../State/WalletState';
import {ReadTransactions} from '../FileOperations/ReadTransactions';
import {TransactionType} from '../Repositories/WalletType';
import TotalChart from './Components/TotalChart';
import {GetStats} from '../Repositories/GetStats';
import {StatsType} from '../Repositories/StatsType';
import TaxFreeCalculator from './Components/TaxFreeCalculator';
import DogePriceChart from './Components/DogePriceChart';
import {useExchangeRates} from '../State/ExchangeRates';
import ProfitCalculator from './Components/ProfitCalculator';

type Props = {
  componentId: string;
};

function HomeScreen(props: Props) {
  const navigation = useNavigation(props.componentId);
  useNavigationSearchBarUpdate(console.log, props.componentId);
  const walletState = useWallet();
  const exchangeRates = useExchangeRates();
  const [lastTransactions, setLastTransactions] = useState<TransactionType[]>(
    [],
  );
  const [stats, setStats] = useState<StatsType | null>(null);

  const [activeTab, setActiveTab] = useState<'profit' | 'tax' | 'doge' | 'usd'>(
    'usd',
  );

  const [activeInnerTab, setActiveInnerTab] = useState<'doge' | 'usd'>('doge');

  useEffect(() => {
    ReadTransactions(walletState.id).then(response => {
      if (response !== false) {
        response.splice(5, response.length);
        setLastTransactions(
          response.map(transaction => {
            const balanceLength = transaction.balance_change.toString().length;
            const splitBalance =
              transaction.balance_change
                .toString()
                .slice(0, balanceLength - 8) +
              '.' +
              transaction.balance_change.toString().slice(balanceLength - 8);
            return {
              ...transaction,
              balance_change: Number(splitBalance),
            };
          }),
        );
      }
    });
  }, []);

  useEffect(() => {
    getStatsFromApi();
    const interval = setInterval(getStatsFromApi, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatsFromApi = useCallback(() => {
    GetStats().then(response => {
      if (response) {
        setStats(response);
      }
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.topSwitch}>
          <Text style={styles.pricingText}>EUR</Text>
          <Switch
            onValueChange={status => {
              exchangeRates.setCurrency(status ? 'USD' : 'EUR');
              setActiveInnerTab('usd');
            }}
            value={exchangeRates.currency === 'USD'}
          />
          <Text style={styles.pricingText}>USD</Text>
        </View>

        {(activeTab === 'usd' || activeTab === 'doge') && (
          <React.Fragment>
            {activeInnerTab === 'doge' ? (
              <React.Fragment>
                <TopBalance
                  type="doge"
                  balanceDiff={
                    stats === null
                      ? 0
                      : stats.data.market_price_usd_change_24h_percentage
                  }
                />
                <TotalChart type="doge" />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <TopBalance
                  type="usd"
                  balanceDiff={
                    stats === null
                      ? 0
                      : stats.data.market_price_usd_change_24h_percentage
                  }
                />
                <TotalChart type="usd" />
              </React.Fragment>
            )}

            <View style={styles.tabInnerHolder}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setActiveInnerTab('doge')
                  setActiveTab('doge');
                }}
                style={
                  activeInnerTab === 'doge' ? styles.tabActiveInner : styles.tabInner
                }>
                <Text
                  style={
                    activeInnerTab === 'doge'
                      ? styles.tabTextActiveInner
                      : styles.tabTextInner
                  }>
                  Balance Doge
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setActiveInnerTab('usd');
                  setActiveTab('usd');
                }}
                style={
                  activeInnerTab === 'usd' ? styles.tabActiveInner : styles.tabInner
                }>
                <Text
                  style={
                    activeInnerTab === 'usd'
                      ? styles.tabTextActiveInner
                      : styles.tabTextInner
                  }>
                  Balance {exchangeRates.currency}
                </Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        )}

        {activeTab === 'tax' && (
          <React.Fragment>
            <TopBalance
              type="doge"
              balanceDiff={
                stats === null
                  ? 0
                  : stats.data.market_price_usd_change_24h_percentage
              }
            />
            <TaxFreeCalculator />
          </React.Fragment>
        )}

        {activeTab === 'profit' && (
          <React.Fragment>
            <TopBalance
              type="usd"
              balanceDiff={
                stats === null
                  ? 0
                  : stats.data.market_price_usd_change_24h_percentage
              }
            />
            <ProfitCalculator />
          </React.Fragment>
        )}

        <View style={styles.tabsHolder}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setActiveTab('profit')}
            style={activeTab === 'profit' ? styles.tabActive : styles.tab}>
            <Text
              style={
                activeTab === 'profit' ? styles.tabTextActive : styles.tabText
              }>
              Profit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setActiveTab('tax')}
            style={activeTab === 'tax' ? styles.tabActive : styles.tab}>
            <Text
              style={
                activeTab === 'tax' ? styles.tabTextActive : styles.tabText
              }>
              Tax Free
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setActiveTab('usd')}
            style={(activeTab === 'usd' || activeTab === 'doge') ? styles.tabActive : styles.tab}>
            <Text
              style={
                (activeTab === 'usd' || activeTab === 'doge') ? styles.tabTextActive : styles.tabText
              }>
              Balance
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.transactionText}>Last 5 Transactions</Text>
        {lastTransactions.map(transaction => (
          <Transaction
            key={transaction.hash}
            transaction={transaction}
            status={transaction.balance_change >= 0}
            navigation={navigation}
          />
        ))}
        <TouchableOpacity
          style={styles.buttonHolder}
          onPress={() =>
            navigation.mergeOptions({
              bottomTabs: {
                currentTabIndex: 1,
              },
            })
          }>
          <Text style={styles.buttonText}>Show More</Text>
        </TouchableOpacity>

        <DogePriceChart
          balanceDiff={
            stats === null
              ? 0
              : stats.data.market_price_usd_change_24h_percentage
          }
          currentPrice={stats === null ? 0 : stats.data.market_price_usd}
        />

        <View style={styles.fixScrollHeight} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonHolder: {
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
    backgroundColor: '#212121',
    height: 42,
    borderRadius: 8,
    padding: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 31,
    fontSize: 20,
  },
  fixScrollHeight: {
    height: 50,
  },
  transactionText: {
    fontSize: 30,
    lineHeight: 41,
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
    color: '#212121',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  scrollViewStyle: {
    paddingTop: 25,
    paddingHorizontal: 25,
  },
  tabsHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tabTextActive: {
    fontSize: 17,
    color: '#F06E22',
    textAlign: 'center',
  },
  tabText: {
    fontSize: 17,
    color: '#000',
    textAlign: 'center',
  },
  tab: {
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
    paddingBottom: 6,
  },
  tabActive: {
    borderBottomColor: '#F06E22',
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  tabInner: {
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
    paddingBottom: 6,

    paddingHorizontal: 15,
  },
  tabActiveInner: {
    borderBottomColor: '#F06E22',
    paddingBottom: 6,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(240,110,34, 0.1)',
    paddingHorizontal: 15,
  },
  tabInnerHolder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    backgroundColor: 'rgba(107,107,107, .1)',
    marginHorizontal: 40,
  },
  tabTextActiveInner: {
    fontSize: 17,
    color: '#F06E22',
    textAlign: 'center',
  },
  tabTextInner: {
    fontSize: 17,
    color: '#000',
    textAlign: 'center',
  },
  topSwitch: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  pricingText: {
    lineHeight: 31,
    marginRight: 5,
    marginLeft: 5,
  },
});

HomeScreen.options = {
  topBar: {
    title: {
      text: 'Crypto Brand',
    },
  },
} as Options;

export default HomeScreen;
