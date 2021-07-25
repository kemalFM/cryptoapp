export interface TransactionInfoType {
  data: {
    [transactionHash: string]: TransactionInnerDetails;
  };
}

export type TransactionInnerDetails = {
  transaction: TransactionInfo;
  inputs: InOutType[];
  outputs: InOutType[];
}

export type TransactionInfo = {
  block_id: number;
  id: number;
  hash: string;
  date: string;
  time: string;
  size: number;
  version: number;
  lock_time: number;
  is_coinbase: boolean;
  input_count: number;
  output_count: number;
  input_total: number;
  input_total_usd: number;
  output_total: number;
  output_total_usd: number;
  fee: number;
  fee_usd: number;
  fee_per_kb: number;
  fee_per_kb_usd: number;
  cdd_total: number;
};

export type InOutType = {
  block_id: number;
  transaction_id: number;
  index: number;
  transaction_hash: string;
  date: string;
  time: string;
  value: number;
  value_usd: number;
  recipient: string;
  type: 'pubkeyhash';
  script_hex: string;
  is_from_coinbase: boolean;
  is_spendable: null | boolean;
  is_spent: boolean;
  spending_block_id: number;
  spending_transaction_id: number;
  spending_index: number;
  spending_transaction_hash: string;
  spending_date: string;
  spending_time: string;
  spending_value_usd: number;
  spending_sequence: number;
  spending_signature_hex: string;
  lifespan: number;
  cdd: number;
};
