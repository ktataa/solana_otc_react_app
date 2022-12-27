import * as anchor from "@project-serum/anchor";
import * as otc_utils from "../utils/index";
import { Connection, PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Program } from "@project-serum/anchor";
import { OtcProgram } from "../IDL/otc";

export interface ICreate {
  baseAmount: number;
  quoteAmount: number;
  baseQuoteRate: number;
  baseTokenMint: PublicKey;
  quoteTokenMint: PublicKey;
  wallet?: AnchorWallet;
  otcProgram: Program<OtcProgram>;
  connection: Connection;
}

export async function create_otc(args: ICreate): Promise<string> {
  const otc_account = otc_utils.generate_otc_account();
  const otc_base_token_account = otc_utils.generate_otc_base_token_account();
  const quote_token_account = await otc_utils.get_quote_ata(
    args.quoteTokenMint,
    args.wallet?.publicKey!
  );
  const quote_decimals = await otc_utils.get_decimals(
    args.quoteTokenMint,
    args.connection
  );
  const base_decimals = await otc_utils.get_decimals(
    args.baseTokenMint,
    args.connection
  );

  return args.otcProgram?.methods
    .createOtc(
      new anchor.BN(Number(args.baseAmount * 10 ** base_decimals)),
      new anchor.BN(Number(args.quoteAmount * 10 ** quote_decimals)),
      new anchor.BN(Number(args.baseQuoteRate))
    )
    .accounts({
      owner: args.wallet?.publicKey,
      otcAccount: otc_account.publicKey,
      otcBaseTokenAccount: otc_base_token_account.publicKey,
      quoteTokenAccount: quote_token_account,
      quoteTokenMint: args.quoteTokenMint,
      baseTokenAccount: await otc_utils.get_base_ata(
        args.baseTokenMint,
        args.wallet?.publicKey!
      ),
      baseTokenMint: args.baseTokenMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([otc_account, otc_base_token_account])
    .rpc();
}
