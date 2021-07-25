export interface Wallet {
  data: {
    [walletID: string]: {
      address: AddressType;
      transactions: TransactionType[];
    };
  };
}

export type TransactionType = {
  block_id: number;
  hash: string;
  time: string;
  balance_change: number;
};
export type AddressType = {
  type: string;
  script_hex: string;
  balance: number;
  balance_usd: number;
  received: number;
  received_usd: number;
  spent: number;
  spent_usd: number;
  output_count: number;
  unspent_output_count: number;
  first_seen_receiving: Date;
  last_seen_receiving: Date;
  first_seen_spending: Date;
  last_seen_spending: Date;
  scripthash_type: null;
  transaction_count: number;
};
