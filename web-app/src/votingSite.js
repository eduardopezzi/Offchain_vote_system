import React, { useState, useEffect } from "react";
import Web3 from "web3";
import {
  STOCK_ORACLE_ABI,
  STOCK_ORACLE_ADDRESS,
  APIKEY
} from "./quotecontract";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 200
    }
  },
  result: {
    "& > *": {
      margin: theme.spacing(2),
      width: 200
    }
  }
}));

//www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=QIHOUY8RAT3SPAK7

function App() {
  const web3 = new Web3(window.web3.currentProvider);

  const accounts = web3.eth.getAccounts();

  var stockQuote = new web3.eth.Contract(
    STOCK_ORACLE_ABI,
    STOCK_ORACLE_ADDRESS
  );

  const classes = useStyles();
  const [data, setData] = useState("");
  const [volume, setVolume] = useState("");
  const [price, setPrice] = useState("");
  const [volumeCheck, setVolumeCheck] = useState("");
  const [priceCheck, setPriceCheck] = useState("");
  const [input, setInput] = useState("");
  const [symbol, setSymbol] = useState("MSFT");
  const [loaded, setLoaded] = useState(false);

  const updateData = async () => {
    const accounts = await new web3.eth.getAccounts();
    const fetchData = await stockQuote.methods
      .setStock(web3.utils.fromAscii(symbol), price, volume)
      .send({ from: accounts[0] });
  };
  const checkOracle = async () => {
    const accounts = await new web3.eth.getAccounts();
    const checkPrice = await stockQuote.methods
      .getStockPrice(web3.utils.fromAscii(symbol))
      .call()
      .then(res => setPriceCheck(res / 100));
    const checkVolume = await stockQuote.methods
      .getStockVolume(web3.utils.fromAscii(symbol))
      .call()
      .then(res => setVolumeCheck(res));
    window.alert(
      `stock ${data["01. symbol"]}, price ${priceCheck}, Volume ${volumeCheck}`
    );
  };

  useEffect(() => {
    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${APIKEY}`
    )
      .then(res => res.json())
      .then(res => {
        const newData = res["Global Quote"];
        setPrice(parseInt(newData["05. price"] * 100));
        setVolume(parseInt(newData["06. volume"]));
        setData(newData);
        setLoaded(true);
      });
  }, [symbol]);

  function handlingChange(event) {
    event.preventDefault();
    setInput(event.target.value);
  }

  function onclick(event) {
    event.preventDefault();
    setSymbol(input);
  }
  if (loaded === false) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Stock Prices Oracle</h1>
        <div>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="Stock-form-search"
              label="Stock Symbol"
              variant="outlined"
              size="small"
              onChange={handlingChange}
            />

            <div>
              <Button variant="contained" color="primary" onClick={onclick}>
                Get Quote
              </Button>{" "}
            </div>
            <div>
              <Button variant="contained" color="primary" onClick={updateData}>
                Store Oracle
              </Button>{" "}
            </div>
            <div>
              <Button variant="contained" color="primary" onClick={checkOracle}>
                Check Oracle
              </Button>{" "}
            </div>
          </form>
          <div>
            <TextField
              className={classes.result}
              id="Stock-form-symbol"
              label="Symbol"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              value={data["01. symbol"]}
            ></TextField>
          </div>
          <div>
            <TextField
              className={classes.result}
              id="Stock-form-price"
              label="Price"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              value={data["05. price"]}
            ></TextField>
          </div>
          <div>
            <TextField
              className={classes.result}
              id="Stock-form-volume"
              label="Volume"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              value={data["06. volume"]}
            ></TextField>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
