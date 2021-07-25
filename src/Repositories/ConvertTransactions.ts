import {TransactionType} from './WalletType';

export function ConvertToText(transactions: TransactionType[]): string {
  const stringTransactions = transactions.map(transaction =>
    JSON.stringify(transaction),
  );
  return stringTransactions.join('\n');
}

export function ConvertTOJSON(transactions: string): TransactionType[] {
  const newLineToJSON = transactions.split('\n');
  return newLineToJSON.map(transaction =>{
    return JSON.parse(transaction.replace('\\', '').replace('\n', ''))
    }
  );
}
