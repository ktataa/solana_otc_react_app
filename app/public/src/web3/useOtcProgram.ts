import { useConnection, useAnchorWallet, AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import * as idl from "./IDL/otc";
import { useMemo } from "react";

export default function useOTCProgram(): {otcProgram: anchor.Program<idl.OtcProgram>, wallet: AnchorWallet | undefined} {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();


  return useMemo(()=>{

    const options = anchor.AnchorProvider.defaultOptions();

    const provider = new anchor.AnchorProvider(
      connection,
      wallet as anchor.Wallet,
      options
    );
    anchor.setProvider(provider);
    return  {
      otcProgram: new anchor.Program(idl.IDL, idl.IDL.metadata.address, provider),
      wallet,
    };

  },[wallet,connection])
   

 
}
