import * as anchor from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import * as idl from "../IDL/otc";

export interface IOTCAccount {
  address: PublicKey;

  owner: PublicKey;

  baseTokenMint: PublicKey;

  quoteTokenMint: PublicKey;

  baseTokenAccount: PublicKey;

  baseAmount: anchor.BN;

  quoteAmount: anchor.BN;

  sold: anchor.BN;

  baseQuoteRate: anchor.BN;

  otcBaseTokenAccount: PublicKey;

  ownerQuoteTokenAccount: PublicKey;
}

export function generate_otc_account(): anchor.web3.Keypair {
  return anchor.web3.Keypair.generate();
}

export function generate_otc_base_token_account(): anchor.web3.Keypair {
  return anchor.web3.Keypair.generate();
}

export async function get_base_ata(
  base_token_mint: PublicKey,
  publicKey: PublicKey
): Promise<PublicKey> {
  return await getAssociatedTokenAddress(base_token_mint, publicKey);
}

export async function get_quote_ata(
  quote_token_mint: PublicKey,
  publicKey: PublicKey
): Promise<PublicKey> {
  return await getAssociatedTokenAddress(quote_token_mint, publicKey);
}

export async function get_decimals(
  token_mint: PublicKey,
  connection: Connection
) {
  return (
    (await connection.getParsedAccountInfo(token_mint)).value
      ?.data as ParsedAccountData
  )["parsed"]["info"]["decimals"];
}

export async function generate_otc_authority_account(
  otc_account_address: PublicKey,
  otcProgram: anchor.Program<idl.OtcProgram>
): Promise<[anchor.web3.PublicKey, number]> {
  return new Promise(async (resolve, reject) => {
    resolve(
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("otc_authority")),
          otc_account_address.toBuffer(),
        ],
        otcProgram?.programId!
      )
    );
  });
}
export async function get_one_otc_details(
  otc_account_address: PublicKey,
  otcProgram: anchor.Program<idl.OtcProgram>
): Promise<IOTCAccount> {
  return {
    ...(await otcProgram.account.otcAccount.fetch(otc_account_address)!),
    address: otc_account_address,
  };
}
export async function get_all_otc_details(
  otcProgram: anchor.Program<idl.OtcProgram>,
  connection: Connection
): Promise<IOTCAccount[]> {
  let all_accounts = await connection.getProgramAccounts(
    otcProgram.programId,
    "singleGossip"
  );

  let otc_accounts = all_accounts
    .map((a) => (a.account.data.length >= 232 ? a : null))
    .filter(Boolean);
  return Promise.all(
    otc_accounts.map(async (otc_account: any): Promise<IOTCAccount> => {
      return {
        ...(await otcProgram.account.otcAccount.fetch(
          new PublicKey(otc_account.pubkey).toBase58()
        )),
        address: otc_account.pubkey,
      };
    })
  );
}
