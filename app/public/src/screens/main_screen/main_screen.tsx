import { useState } from "react";
import Connect from "../../components/connect/connect";
import CreateModal from "../../components/create_modal/create_modal";
import OtcList from "../../components/otc_list/otc_list";
import Button from "@mui/material/Button";

function MainScreen() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="App">
      <Connect></Connect>
      <br />
      <br />
      <Button
        onClick={() => setCreateOpen(true)}
        variant="contained"
        size="small"
      >
        Create OTC trade
      </Button>
      <CreateModal
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
      ></CreateModal>
      <OtcList></OtcList>
    </div>
  );
}

export default MainScreen;
