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
  Alert, Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {Options} from 'react-native-navigation/lib/src/interfaces/Options';
import TopBalance from './Components/TopBalance';
import Transaction from './Components/Transaction';
import {
  setRoot,
  useNavigation,
  useNavigationSearchBarUpdate
} from "react-native-navigation-hooks";
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
import {useLanguageState} from '../State/LanguageState';
import {I18N} from '../I18N/I18N';
import BalanceShower from "./Components/BalanceShower";
import { removeWalletID } from "../State/WalletStore";
import { AppStartRoot } from "../../AppRoutes";
import PlusSVG from '../assets/plus.svg';

type Props = {
  componentId: string;
};

function HomeScreen(props: Props) {
  const language = useLanguageState(state => state.language);
  const navigation = useNavigation(props.componentId);
  useNavigationSearchBarUpdate(() => {}, props.componentId);
  const walletState = useWallet();
  const exchangeRates = useExchangeRates();
  const [lastTransactions, setLastTransactions] = useState<TransactionType[]>(
    [],
  );
  const [stats, setStats] = useState<StatsType | null>(null);

  const [activeTab, setActiveTab] = useState<'profit' | 'tax' | 'doge' | 'usd'>(
    'doge',
  );

  useEffect(() => {
    navigation.mergeOptions({
      topBar: {
        title: {
          text: I18N('homeScreen.topText', language),
        },
        subtitle: {
          text: walletState.id,
        }
      },
      bottomTab: {
        text: I18N('navigation.home', language)
      }
    });
  }, [language, navigation]);

  useEffect(() => {
    const resData: TransactionType[] = [];
    ReadTransactions(walletState.id).then(response => {
      if (response !== false) {
        if (response.length > 2) {
          resData.push(response[0]);
          resData.push(response[response.length - 1]);
        } else if (response.length === 1) {
          resData.push(response[0]);
        }
        setLastTransactions(
          resData.map(transaction => {
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
            }}
            value={exchangeRates.currency === 'USD'}
          />
          <Text style={styles.pricingText}>USD</Text>
        </View>

        {(activeTab === 'usd' || activeTab === 'doge') && (
          <React.Fragment>
            <React.Fragment>
              <TopBalance
                type="doge"
                balanceDiff={
                  stats === null
                    ? 0
                    : stats.data.market_price_usd_change_24h_percentage
                }
              />
              <BalanceShower />
            </React.Fragment>
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
            onPress={() => setActiveTab('usd')}
            style={
              activeTab === 'usd' || activeTab === 'doge'
                ? styles.tabActive
                : styles.tab
            }>
            <Text
              style={
                activeTab === 'usd' || activeTab === 'doge'
                  ? styles.tabTextActive
                  : styles.tabText
              }>
              {I18N('homeScreen.balance', language)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setActiveTab('profit')}
            style={activeTab === 'profit' ? styles.tabActive : styles.tab}>
            <Text
              style={
                activeTab === 'profit' ? styles.tabTextActive : styles.tabText
              }>
              {I18N('homeScreen.profit', language)}
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
              {I18N('homeScreen.taxFree', language)}
            </Text>
          </TouchableOpacity>

        </View>

        {lastTransactions.length > 0 ? (
          <React.Fragment>
            <Text style={styles.transactionText}>{I18N('homeScreen.lastTransaction', language)}</Text>
            <Transaction
              key={lastTransactions[0].hash}
              transaction={lastTransactions[0]}
              status={lastTransactions[0].balance_change >= 0}
              navigation={navigation}
            />
            <Text style={styles.transactionText}>{I18N('homeScreen.firstTransaction', language)}</Text>
            {lastTransactions[1] !== undefined && (
              <Transaction
                key={lastTransactions[1].hash}
                transaction={lastTransactions[1]}
                status={lastTransactions[1].balance_change >= 0}
                navigation={navigation}
              />
            )}

            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() =>
                Linking.openURL('https://blockchair.com/dogecoin/address/'+walletState.id)
              }>
             <PlusSVG fill={"#fff"} width={25} height={25} />
            </TouchableOpacity>
          </React.Fragment>
        ): (
          <Text style={styles.noTransactionText}>{I18N('homeScreen.noTransactionFound', language)}</Text>
          )}

        <View style={styles.fixScrollHeight} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  showMoreButton: {
    alignSelf: "center",
    borderRadius: 60,
    height: 60,
    width: 60,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
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
  noTransactionText: {
    fontSize: 28,
    textAlign: "center",
    lineHeight: 41,
    marginTop: 20,
    color: '#212121',
    fontWeight: 'bold',
    marginVertical: 10,
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
    width: 260,
    alignSelf: 'center',
    backgroundColor: 'rgba(107,107,107, .1)',
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
      text: 'Wallet ID',
    },
  },
} as Options;

export default HomeScreen;
