import {BLOCK_CHAIR_API} from './RepositoryConstants';
import axios from 'axios';
import {TransactionInfoType} from './TransactionInfoType';
import { API_KEY } from "../../env";

export async function GetTransactionInfo(
  transactionHash: string,
): Promise<TransactionInfoType | false> {
  return await axios
    .get<TransactionInfoType>(
      `${BLOCK_CHAIR_API}/dashboards/transaction/${transactionHash}?key=${API_KEY}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(() => {
      return false;
    });
}

export async function GetMultipleTransactionInfo(
  transactionHash: string[],
): Promise<TransactionInfoType | false> {
  const transactionHashesCommaSeperated = transactionHash.join(',');

  return await axios
    .get<TransactionInfoType>(
      `${BLOCK_CHAIR_API}/dashboards/transactions/${transactionHashesCommaSeperated}`,
      {
        params: {
          key: API_KEY,
        },
      },
    )
    .then(response => {
      return response.data;
    })
    .catch(() => {
      return false;
    });
}
