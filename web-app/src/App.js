import React, { useState, useEffect } from "react";
import "./App.css";

import {
  Button,
  FormControl,
  Box,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";

import sendTransaction from "./sendTransaction";

// import Web3 from "web3";

function App() {
  const [account, setAccount] = useState("");
  const [account2, setAccount2] = useState("");
  const [vote, setVote] = useState(Boolean);
  window.ethereum.on("accountsChanged", function(accounts) {
    window.ethereum.enable().then(function(accounts) {
      setAccount(accounts[0]);
      setAccount2("0x90415E66A753010B7E453F489bBbf23848497936");
    });
  });
  const handleChange = event => {
    setVote(event.target.value);
  };

  const onClick = async () => {
    castVote();
  };

  const castVote = async () => {
    await sendTransaction({
      valueInEth: 0, //amountCandidate ? amountCandidate : amountCharity,
      gas: 4200000,
      destinationAddress: account2 // amountCandidate ? addressCandidate : addressCharity
    });
  };

  if (!window.ethereum || !window.ethereum.isMetaMask) {
    return <div>Please install MetaMask.</div>;
  } else
    return (
      <div className="App">
        <header className="App-header">
          <h1> Voting System </h1>
          <p>Do you believe in extraterrestrial life? </p>
        </header>
        <div id="vote-div">
          <FormControl component="fieldset">
            <FormLabel id="vote-label" component="legend">
              Vote
            </FormLabel>
            <RadioGroup
              aria-label="vote"
              name="vote1"
              value={vote}
              onChange={handleChange}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
              <Box m={2} />
              <Button id="voteButton" variant="contained" onClick={onClick}>
                {" "}
                Vote{" "}
              </Button>
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    );
}

export default App;
