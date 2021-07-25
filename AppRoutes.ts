import {LayoutRoot} from 'react-native-navigation';

export const AppComponentRoutes: LayoutRoot = {
  root: {
    bottomTabs: {
      children: [
        {
          stack: {
            id: 'de.kfm.HomeScreenTabComponent',
            children: [
              {
                component: {
                  name: 'de.kfm.HomeScreen',
                },
              },
            ],
            options: {
              topBar: {
                searchBar: {
                  visible: false,
                  hideOnScroll: false,
                  hideTopBarOnFocus: false
                }
              },
              bottomTab: {
                text: 'Home',
                icon: require('./src/assets/home.png'),
                selectedTextColor: "#F06E22",
                iconColor: "#A0A0A0",
                selectedIconColor: "#F06E22",
                textColor: "#A0A0A0"
              },
              layout: {
                backgroundColor: '#fff',
                componentBackgroundColor: '#fff',
              },
            },
          },
        },
        {
          stack: {
            id: 'de.kfm.TransactionsScreenTabComponent',
            children: [
              {
                component: {
                  name: 'de.kfm.TransactionsScreenTab',
                },
              },
            ],
            options: {
              topBar: {
                searchBar: {
                  visible: true,
                  hideOnScroll: true,
                  hideTopBarOnFocus: true
                }
              },
              bottomTab: {
                text: 'Transactions',
                icon: require('./src/assets/money.png'),
                selectedTextColor: "#F06E22",
                iconColor: "#A0A0A0",
                selectedIconColor: "#F06E22",
                textColor: "#A0A0A0"
              },
              layout: {
                backgroundColor: '#fff',
                componentBackgroundColor: '#fff',
              },
            },
          },
        },
        {
          stack: {
            id: 'de.kfm.HomeScreenTab',
            children: [
              {
                component: {
                  name: 'de.kfm.HomeScreen',
                },
              },
            ],
            options: {
              topBar: {
                searchBar: {
                  visible: true,
                  hideOnScroll: true,
                  hideTopBarOnFocus: true
                },
                background: {
                  color: "#fff",
                }
              },
              bottomTab: {
                text: 'Logout',
                icon: require('./src/assets/logout.png'),
                selectedTextColor: "#F06E22",
                iconColor: "#A0A0A0",
                selectedIconColor: "#F06E22",
                textColor: "#A0A0A0",
                selectTabOnPress: false,
              },
              layout: {
                backgroundColor: '#fff',
                componentBackgroundColor: '#fff',
              },
            },
          },
        },
      ],
    },
  },
};

export const LoadTransactionsRoute: LayoutRoot = {
  root: {
    stack: {
      children: [
        {
          component: {
            name: 'de.kfm.LoadingTransactions',
          },
        },
      ],
      options: {
        layout: {
          backgroundColor: "#fff",
          componentBackgroundColor: "#fff"
        }
      }
    },
  },
}


export const AppStartRoot: LayoutRoot = {
  root: {
    stack: {
      children: [
        {
          component: {
            name: 'de.kfm.WelcomeScreen',
          },
        },
      ],
        options: {
        layout: {
          backgroundColor: "#fff",
            componentBackgroundColor: "#fff"
        }
      }
    },
  },
}
