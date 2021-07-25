import axios from 'axios';
import {DOGE_CHAIN_API} from './RepositoryConstants';
// @ts-ignore
import WAValidator from 'multicoin-address-validator';

type WalletResponse =
  | {balance: string; success: 1}
  | {error: string; success: 0};

export default async function ValidateWallet(
  walletID: string,
): Promise<boolean> {
  // Validating address with crypto tools before sending actual request to API endpoints
  const validateLocally = WAValidator.validate(walletID, 'doge');

  if (validateLocally) {
    return await axios
      .get<WalletResponse>(`${DOGE_CHAIN_API}/address/balance/${walletID}`)
      .then(response => {
        return !!response.data.success;
      })
      .catch(() => {
        return false;
      });
  } else {
    return false;
  }
}
