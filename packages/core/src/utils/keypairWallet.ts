import { TransactionOrVersionedTransaction } from "../types";
import type { BaseWallet } from "../types/wallet";
import {
  ConfirmOptions,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */
export const isVersionedTransaction = (
  tx: Transaction | VersionedTransaction,
): tx is VersionedTransaction => {
  return "version" in tx;
};

/**
 * A wallet implementation using a Keypair for signing transactions
 */
export class KeypairWallet implements BaseWallet {
  publicKey: PublicKey;
  private payer: Keypair;

  /**
   * Constructs a KeypairWallet with a given Keypair
   * @param keypair - The Keypair to use for signing transactions
   */
  constructor(keypair: Keypair) {
    this.publicKey = keypair.publicKey;
    this.payer = keypair;
  }

  defaultOptions: ConfirmOptions = {
    preflightCommitment: "processed",
    commitment: "processed",
  };

  async signTransaction<
    T extends
      | Transaction
      | VersionedTransaction
      | TransactionOrVersionedTransaction,
  >(transaction: T): Promise<T> {
    if (isVersionedTransaction(transaction)) {
      transaction.sign([this.payer]);
    } else {
      transaction.partialSign(this.payer);
    }

    return transaction;
  }

  async signAllTransactions<
    T extends
      | Transaction
      | VersionedTransaction
      | TransactionOrVersionedTransaction,
  >(txs: T[]): Promise<T[]> {
    return txs.map((t) => {
      if (isVersionedTransaction(t)) {
        t.sign([this.payer]);
      } else {
        t.partialSign(this.payer);
      }
      return t;
    });
  }

  async sendTransaction<
    T extends
      | Transaction
      | VersionedTransaction
      | TransactionOrVersionedTransaction,
  >(transaction: T): Promise<string> {
    const connection = new Connection(process.env.RPC_URL as string);

    if (transaction instanceof VersionedTransaction)
      transaction.sign([this.payer]);
    else transaction.partialSign(this.payer);

    return await connection.sendRawTransaction(transaction.serialize());
  }
}
