import * as anchor from "@project-serum/anchor";
import * as otc_utils from "../utils/index";
import { Connection, PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import * as idl from "../IDL/otc";

interface IMakeTrade {
  otc_account: PublicKey;
  maker_amount: number;
  connection: Connection;
  wallet: AnchorWallet | undefined;
  otcProgram: anchor.Program<idl.OtcProgram>;
}

export async function make_trade(
  args: IMakeTrade
): Promise<string | undefined> {
  let otc_details = await otc_utils.get_one_otc_details(
    args.otc_account,
    args.otcProgram
  );
  const quote_decimals = await otc_utils.get_decimals(
    otc_details.quoteTokenMint,
    args.connection
  );

  return await args.otcProgram?.methods
    .makeTrade(new anchor.BN(args.maker_amount * 10 ** quote_decimals))
    .accounts({
      owner: args.wallet?.publicKey,
      otcAccount: args.otc_account,
      quoteTokenMint: otc_details.quoteTokenMint,
      quoteTokenAccount: await otc_utils.get_quote_ata(
        otc_details.quoteTokenMint,
        args.wallet?.publicKey!
      ),
      ownerQuoteTokenAccount: otc_details.ownerQuoteTokenAccount,
      baseTokenMint: otc_details.baseTokenMint,
      otcBaseTokenAccount: otc_details.otcBaseTokenAccount,
      ownerBaseTokenAccount: await otc_utils.get_base_ata(
        otc_details.baseTokenMint,
        args.wallet?.publicKey!
      ),
      otcAuthorityAccount: (
        await otc_utils.generate_otc_authority_account(
          args.otc_account,
          args.otcProgram
        )
      )[0],
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
}
