/**
 * This function is responsible for calculating correct
 * amount for received and sent transactions.
 */

import {TransactionInnerDetails} from '../../Repositories/TransactionInfoType';
import {TransactionType} from '../../Repositories/WalletType';

export default function CalculateTransactionValue(
  transaction: TransactionType,
  transactionInfo: TransactionInnerDetails,
  walletId: string,
): number {
  /**
   *  Output means where the Dogecoins goes to
   *  Filtering by wallet ID
   */
  const receiversFiltered = transactionInfo.outputs.filter(
    out => out.recipient === walletId,
  );

  /**
   *  Output means where the Dogecoins comes from
   *  Filtering by wallet ID
   */
  const sendersFiltered = transactionInfo.inputs.filter(
    ins => ins.recipient === walletId,
  );

  /**
   *   Adding up all the filtered amounts
   *   since we can be both in sender and receiver
   *   its not calculating only one of them but both of them
   */
  const sender = sendersFiltered.reduce((a, b) => a + b.value_usd, 0);
  const receiver = receiversFiltered.reduce((a, b) => a + b.value_usd, 0);

  /**
   * We are checking that if we are the one only in transaction,
   * which happens when the blocks are getting merged.
   * Ex Transaction: https://blockchair.com/dogecoin/transaction/35ca9dfe2dd53a9be258aa1375d13bce0d086054df6fb03243f5f1559de6d8ae
   * At that time we should only display the transaction fee.
   */

  if (
    sendersFiltered.length === transactionInfo.inputs.length &&
    receiversFiltered.length === transactionInfo.outputs.length
  ) {
    return transactionInfo.transaction.fee_usd;
  }

  //When we are not in the senders we are just returning the received amount
  if (sender === 0) {
    return receiver;
  }
  // When we are not the receiver returning the amount we sent.
  if (receiver === 0) {
    return sender;
  }

  /**
   * When the walletID presents both in receiver and sender
   * We are checking if the balance change which can be minus or plus depending on the transaction and if we are putting more than we receive
   * We should be paying the transaction fee
   * And also calculating the money which we sent to others than our wallet id.
   *
   * */

  if (transaction.balance_change < 0) {
    return -(
      transactionInfo.outputs
        .filter(out => out.recipient !== walletId)
        .reduce((a, b) => a + b.value_usd, 0) +
      transactionInfo.transaction.fee_usd
    );
  } else {
    return receiver;
  }
}
