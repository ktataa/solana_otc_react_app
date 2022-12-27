import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { create_otc } from "../../web3/api";
import useOTCProgram from "../../web3/useOtcProgram";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

export const CreateModal = (...props: any) => {
  const { otcProgram, wallet } = useOTCProgram();
  const { connection } = useConnection();
  const [baseTokenMint, setBaseTokenMint] = useState("");
  const [quoteTokenMint, setQuoteTokenMint] = useState("");
  const [baseAmount, setBaseAmount] = useState(0);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const { createOpen, setCreateOpen } = props[0];

  const baseQuoteRate: number = useMemo(() => {
    return (baseAmount / quoteAmount) * 1e9;
  }, [quoteAmount, baseAmount]);

  const create = async () => {
    await create_otc({
      baseTokenMint: new PublicKey(baseTokenMint!)!,
      quoteTokenMint: new PublicKey(quoteTokenMint!)!,
      baseAmount: Number(baseAmount!)!,
      quoteAmount: Number(quoteAmount!)!,
      baseQuoteRate: Number(baseQuoteRate!)!,
      wallet,
      otcProgram,
      connection,
    });

    setCreateOpen(false);
  };

  const handleClose = () => {
    setCreateOpen(false);
  };

  return (
    <div>
      <Dialog open={createOpen!} onClose={handleClose}>
        <DialogTitle>Create</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e: any) => setBaseTokenMint(() => e.target.value)}
            autoFocus
            margin="dense"
            id="base_token_mint"
            label="base token mint"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={(e: any) => setBaseAmount(() => e.target.value)}
            autoFocus
            margin="dense"
            id="base_amount"
            label="base amount"
            type="number"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={(e: any) => setQuoteTokenMint(() => e.target.value)}
            autoFocus
            margin="dense"
            id="quote_token_mint"
            label="quote token mint"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={(e: any) => setQuoteAmount(() => e.target.value)}
            autoFocus
            margin="dense"
            id="quote_amount"
            label="quote amount"
            type="number"
            fullWidth
            variant="standard"
          />
          <Button onClick={create} variant="contained" size="small">
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateModal;
