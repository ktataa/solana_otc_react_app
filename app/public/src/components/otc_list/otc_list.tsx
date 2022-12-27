import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useConnection } from "@solana/wallet-adapter-react";
import useOTCProgram from "../../web3/useOtcProgram";
import { get_all_otc_details, get_decimals, IOTCAccount } from "../../web3/utils";
import BuyModal from "../buy_modal/buy_modal";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function OtcList() {
  const [buyOpen, setBuyOpen] = useState(false);
  const [otcAddress, setOtcAddress] = useState("");

  const { connection } = useConnection();
  const { otcProgram } = useOTCProgram();
  const [otc_data, setOtcData] = useState(Array<IOTCAccount>);
 

  useEffect(() => {
    (async () => {
      let otc_details: IOTCAccount[] = await get_all_otc_details(
        otcProgram,
        connection
      );
      setOtcData(otc_details);
      console.log(otc_details);
    })();
  }, [connection]);

  const classes = useStyles();
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Base token address</TableCell>
              <TableCell align="right">Quote token address</TableCell>
              <TableCell align="right">To be sold</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Sold</TableCell>
              <TableCell align="right">Buy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {otc_data.map((row) => (
              <TableRow key={row.owner.toBase58()}>
                <TableCell component="th" scope="row">
                  {row.baseTokenMint.toBase58()}
                </TableCell>
                <TableCell align="right">
                  {row.quoteTokenMint.toBase58()}
                </TableCell>
                <TableCell align="right">{Number(row.baseAmount)}</TableCell>
                <TableCell align="right">{Number(row.baseQuoteRate)}</TableCell>
                <TableCell align="right">{Number(row.sold)}</TableCell>
                <TableCell align="right">
                  <button
                    onClick={() => {
                      setOtcAddress(() => row.address.toBase58());
                      setBuyOpen(true);
                    }}
                  >
                    Buy
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BuyModal
        buyOpen={buyOpen}
        setBuyOpen={setBuyOpen}
        otcAddress={otcAddress}
        setOtcAddress={setOtcAddress}
      ></BuyModal>
    </>
  );
}
export default OtcList;
