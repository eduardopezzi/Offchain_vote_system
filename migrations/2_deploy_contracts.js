const Voting = artifacts.require("Voting");
const voteTree = require("../resources/voter-tree");
const fs = require("fs");

let addressesFile = "../resources/addresses.txt";
let addresses = fs
  .readFileSync(addressesFile, "utf-8")
  .split("\n")
  .map(a => a.replace(/#.*/, "").trim())
  .filter(a => a.length > 0);

let root = voteTree.merkleRoot(addresses);

module.exports = function(deployer) {
  deployer.deploy(Voting, root);
};
