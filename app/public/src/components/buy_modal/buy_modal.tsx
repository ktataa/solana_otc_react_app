import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { make_trade } from "../../web3/api";
import useOTCProgram from "../../web3/useOtcProgram";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function BuyModal(...props: any) {
  const { otcProgram, wallet } = useOTCProgram();
  const { connection } = useConnection();

  const [makerAmount, setMakerAmount] = useState(0);
  const { buyOpen, setBuyOpen, otcAddress } = props[0];

  const fill_trade = async () => {
    await make_trade({
      maker_amount: makerAmount,
      otc_account: new PublicKey(otcAddress!),
      connection,
      wallet,
      otcProgram,
    });

    setBuyOpen(false);
  };

  const handleClose = () => {
    setBuyOpen(false);
  };

  return (
    <div>
      <Dialog open={buyOpen!} onClose={handleClose}>
        <DialogTitle>Buy</DialogTitle>
        <DialogContent>
          <TextField
            value={otcAddress}
            autoFocus
            margin="dense"
            id="otc_account"
            label="otc account"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={(e: any) => setMakerAmount(() => e.target.value)}
            autoFocus
            margin="dense"
            id="amount"
            label="amount"
            type="number"
            fullWidth
            variant="standard"
          />
          <Button onClick={fill_trade} variant="contained" size="small">
            Fill
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BuyModal;
