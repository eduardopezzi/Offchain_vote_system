import React, { useState, useEffect } from "react";
import "./App.css";

import {
  Button,
  FormControl,
  Box,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField
} from "@material-ui/core";

import web3 from "./web3";
import { ABI, CONTRACT_ADDRESS } from "./contract";
// import votingJS from "./resources/voter-tree";

function App() {
  var votingContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  /// State ///
  const [account, setAccount] = useState("");
  const [vote, setVote] = useState("");
  const [path, setPath] = useState("");
  const [witnessess, setWitnessess] = useState([]);
  const [root, setRoot] = useState("");

  // interacting with metamask
  useEffect(() => {
    window.ethereum.enable().then(function(accounts) {
      setAccount(accounts[0]);
    });
  });

  window.ethereum.on("accountsChanged", function(accounts) {
    window.ethereum.enable().then(function(accounts) {
      setAccount(accounts[0]);
    });
  });

  // app functions
  const handleChange = event => {
    setVote(event.target.value);
  };
  const onClick = async () => {
    castVote();
  };
  const handleChangePath = event => {
    setPath(event.target.value);
  };
  const handleChangeWit = event => {
    const array = JSON.parse(event.target.value);
    setWitnessess(array);
  };
  const handleChangeRoot = event => {
    setRoot(event.target.value);
  };
  const castVote = async () => {
    await votingContract.methods
      .vote(path, witnessess, vote)
      .send({ from: account, gas: 6000000 });
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
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
              <Box m={1} />
              <Button id="voteButton" variant="contained" onClick={onClick}>
                {" "}
                Vote{" "}
              </Button>
            </RadioGroup>
          </FormControl>
        </div>
        <Box m={2} />
        <div>
          <form id="merkle-data">
            <TextField
              id="input-path"
              label="Path"
              variant="outlined"
              value={path}
              onChange={handleChangePath}
            />
            <Box m={1} />
            <TextField
              id="input-Witnessess"
              label="Witnessess"
              variant="outlined"
              value={witnessess}
              onChange={handleChangeWit}
            />
            <Box m={1} />
            <TextField
              id="input-Root"
              label="Merkle-Root"
              variant="outlined"
              value={root}
              onChange={handleChangeRoot}
            />
          </form>
        </div>
      </div>
    );
}

export default App;
