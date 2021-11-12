/**
 * This file validates walletID at first with the local check which uses multicoin-address-validator which can be found here
 * https://github.com/christsim/multicoin-address-validator
 * And if the local check passes it checks if wallet exists in blockchain by sending request to the endpoint
 * the documantation for this endpoint can be found under this url
 * https://dogechain.info/api/blockchain_api
 */

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
