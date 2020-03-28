const Voting = artifacts.require("Voting");
const { expect } = require("chai");
const fs = require("fs");
const voteTree = require("../resources/voter-tree");
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");

// preparing address file
let addressesFile = "./resources/addresses.txt";
let addresses = fs
  .readFileSync(addressesFile, "utf-8")
  .split("\n")
  .map(a => a.replace(/#.*/, "").trim())
  .filter(a => a.length > 0);

// Merkle Root
let root = voteTree.merkleRoot(addresses);
console.log("root:", root);

//Voter Account >>>> in a web application should be using Meta Mask account
// let Account1 = "0x90415E66A753010B7E453F489bBbf23848497936";

contract("Voting", accounts => {
  let voting;
  let Account1 = accounts[1];
  // Witnesses array and path
  let proofPath = voteTree.merkleProof(addresses, Account1).path;
  let proofWitnesses = voteTree.merkleProof(addresses, Account1).witnesses;

  before(() => {
    return Voting.deployed().then(instance => {
      voting = instance;
    });
  });

  it("0- Test eligibleVotersMerkleRoot is correct", async () => {
    let rootHash = await voting.eligibleVotersMerkleRoot.call();
    assert.equal(rootHash, root, "merkleRoot is different from contract");
  });

  it("1- voting() should have address", async () => {
    assert.ok(voting.address, "Contract not deployed");
  });
  it("2- voting() should call Owner address", async () => {
    let owner = await voting.owner.call();
    const account0 = await accounts[0];
    assert.equal(
      owner,
      account0,
      "owners function returns another owner address"
    );
  });

  it("3 - voting() should cast a vote", async () => {
    let tx = await voting.vote.sendTransaction(
      proofPath,
      proofWitnesses,
      false,
      {
        from: Account1
      }
    );
    /// Event Voted EMITTED ///
    truffleAssert.eventEmitted(tx, "Voted", async ev => {
      assert.ok(
        ev["_from"] == Account1 && ev["myVote"] == false,
        "Voted has NOT emitted"
      );
    });
    /// Checking if vote was added to results
    let voteResult = await voting.noVotes();
    assert.equal(voteResult, 1, "User vote does NOT recorded");
  });
});
