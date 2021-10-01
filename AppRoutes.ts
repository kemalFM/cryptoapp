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
              bottomTab: {
                text: 'Home',
                icon: require('./src/assets/home.png'),
              }
            },
          },
        },
        // {
        //   stack: {
        //     id: 'de.kfm.TransactionsScreenTabComponent',
        //     children: [
        //       {
        //         component: {
        //           name: 'de.kfm.TransactionsScreenTab',
        //         },
        //       },
        //     ],
        //     options: {
        //       topBar: {
        //         searchBar: {
        //           visible: true,
        //           hideOnScroll: true,
        //           hideTopBarOnFocus: true
        //         }
        //       },
        //       bottomTab: {
        //         text: 'Transactions',
        //         icon: require('./src/assets/money.png'),
        //       },
        //     },
        //   },
        // },
        {
          stack: {
            id: 'de.kfm.Settings',
            children: [
              {
                component: {
                  name: 'de.kfm.Settings',
                },
              },
            ],
            options: {
              topBar: {
                searchBar: {
                  visible: false,
                  hideOnScroll: true,
                  hideTopBarOnFocus: true
                }
              },
              bottomTab: {
                text: 'Settings',
                icon: require('./src/assets/settings.png')
              },
            },
          },
        },
        {
          stack: {
            id: 'de.kfm.exit',
            children: [
              {
                component: {
                  name: 'de.kfm.exit',
                }
              }
            ],
            options: {
              bottomTab: {
                selectTabOnPress: false,
                text: 'Exit',
                icon: require('./src/assets/exit.png')
              }
            }
          }
        }
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
