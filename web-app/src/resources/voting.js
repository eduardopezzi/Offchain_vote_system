const fs = require("fs");
const voteTree = require("./voter-tree");

if (process.argv.length < 4) {
  console.error("Voter System  v1.0.0");
  // test account "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c";
  console.error("    node voting.js  <addresses> 'vote'");
  process.exit(1);
}

let addressesFile = "./addresses.txt";
let addresses = fs
  .readFileSync(addressesFile, "utf-8")
  .split("\n")
  .map(a => a.replace(/#.*/, "").trim())
  .filter(a => a.length > 0);

// Merkle Root
let root = voteTree.merkleRoot(addresses);
console.log("root:", root);

//Voter Account >>>> in a web application should be using Meta Mask account
let Account = process.argv[2]; // test account "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c";
console.log("account", Account);
// Witnesses array
let proofPath = voteTree.merkleProof(addresses, process.argv[2]).path;
console.log(proofPath);

let proofWitnesses = voteTree.merkleProof(addresses, process.argv[2]).witnesses;
console.log("witnesses", JSON.stringify(proofWitnesses));

// let proof = voteTree.merkleProof(addresses, Account);
// console.log(proof.path);
// console.log("path: ", proof.path);

// Vote to be cast
let Vote = JSON.stringify(process.argv[3]);
console.log("Vote:", Vote);

module.exports = { root, proofWitnesses, proofPath };
