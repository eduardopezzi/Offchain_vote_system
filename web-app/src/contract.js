export const CONTRACT_ADDRESS = "0x9199F7b6f6df96aEF26A59b76aD95b3226700E40";

export const ABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "eligibleVotersMerkleRoot_",
        type: "bytes32"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bool",
        name: "myVote",
        type: "bool"
      }
    ],
    name: "Voted",
    type: "event"
  },
  {
    constant: true,
    inputs: [],
    name: "eligibleVotersMerkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isStopped",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "noVotes",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "stopContract",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "path",
        type: "uint256"
      },
      {
        internalType: "bytes32[]",
        name: "witnesses",
        type: "bytes32[]"
      },
      {
        internalType: "bool",
        name: "myVote",
        type: "bool"
      }
    ],
    name: "vote",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "yesVotes",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
