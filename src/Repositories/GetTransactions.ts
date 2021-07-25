import axios from 'axios';
import {BLOCK_CHAIR_API} from './RepositoryConstants';
import {Wallet} from './WalletType';

export default async function GetTransactions(
  walletID: string,
  limit: number = 1000,
  offset: number = 0,
) {
  return await axios
    .get<Wallet>(BLOCK_CHAIR_API + '/dashboards/address/' + walletID, {
      params: {
        transaction_details: true,
        offset: offset,
        limit: limit,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(() => {
      return false;
    });
}
