export type StatsType = {
  data: {
    blocks: number;
    transactions: number;
    outputs: number;
    circulation: number;
    blocks_24h: number;
    transactions_24h: number;
    difficulty: number;
    volume_24h: number;
    mempool_transactions: number;
    mempool_size: number;
    mempool_tps: number;
    mempool_total_fee_usd: number;
    best_block_height: number;
    best_block_hash: string;
    best_block_time: string;
    blockchain_size: number;
    average_transaction_fee_24h: number;
    inflation_24h: number;
    median_transaction_fee_24h: number;
    cdd_24h: number;
    mempool_outputs: number;
    largest_transaction_24h: {
      hash: string;
      value_usd: number;
    };
    nodes: number;
    hashrate_24h: string;
    inflation_usd_24h: number;
    average_transaction_fee_usd_24h: number;
    median_transaction_fee_usd_24h: number;
    market_price_usd: number;
    market_price_btc: number;
    market_price_usd_change_24h_percentage: number;
    market_cap_usd: number;
    market_dominance_percentage: number;
    suggested_transaction_fee_per_byte_sat: number;
    hodling_addresses: number;
  };
  context: {
    code: number;
    source: string;
    state: number;
    market_price_usd: number;
  };
};
