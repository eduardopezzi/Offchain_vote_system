const fs = require("fs");
const ethers = require("ethers");

// if (process.argv.length < 4) {
//   console.error("Voter-list merkle tree calculator v1.0.0");
//   console.error("    node voter-tree.js root <addresses-file>");
//   console.error(
//     "    node voter-tree.js proof <addresses-file> <address-to-prove>"
//   );
//   process.exit(1);
// }

// let mode = process.argv[2];
let addressesFile = "./addresses.txt";

let addresses = fs
  .readFileSync(addressesFile, "utf-8")
  .split("\n")
  .map(a => a.replace(/#.*/, "").trim())
  .filter(a => a.length > 0);

// if (mode === "root") {
//   console.log("root: " + merkleRoot(addresses));
// } else if (mode === "proof") {
//   if (process.argv.length < 5) throw "must pass in address to prove";

//   let proof = merkleProof(addresses, process.argv[4]);

//   console.log("path: " + proof.path);
//   console.log("witnesses: " + JSON.stringify(proof.witnesses));
// } else {
//   throw "unrecognized mode: " + mode;
// }

// interface functions

function merkleRoot(addresses) {
  if (addresses.length === 0)
    throw "can't build merkle tree with empty addresses";

  let level = addresses.map(leafHash);

  while (level.length > 1) {
    level = hashLevel(level);
  }
  //console.log(level[0]);
  return level[0];
}

function merkleProof(item) {
  let index = addresses.findIndex(i => i === item);
  if (index === -1) throw "Voter not found in Voter List: " + item;

  let path = [];
  let witnesses = [];

  let level = addresses.map(leafHash);

  while (level.length > 1) {
    // Get proof for this level

    let nextIndex = Math.floor(index / 2);

    if (nextIndex * 2 === index) {
      // left side
      if (index < level.length - 1) {
        // only if we're not the last in a level with odd number of nodes
        path.push(0);
        witnesses.push(level[index + 1]);
      }
    } else {
      // right side
      path.push(1);
      witnesses.push(level[index - 1]);
    }

    index = nextIndex;
    level = hashLevel(level);
  }

  return {
    path: path.reduceRight((a, b) => (a << 1) | b, 0),
    witnesses
  };
}

// internal utility functions

function hashLevel(level) {
  let nextLevel = [];

  for (let i = 0; i < level.length; i += 2) {
    if (i === level.length - 1) nextLevel.push(level[i]);
    // odd number of nodes at this level
    else nextLevel.push(nodeHash(level[i], level[i + 1]));
  }

  return nextLevel;
}

function leafHash(leaf) {
  return ethers.utils.keccak256(ethers.utils.concat(["0x00", leaf]));
}

function nodeHash(left, right) {
  return ethers.utils.keccak256(ethers.utils.concat(["0x01", left, right]));
}

exports.merkleRoot = merkleRoot;
exports.merkleProof = merkleProof;
