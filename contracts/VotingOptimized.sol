pragma solidity ^0.5.0;

contract Voting {
    address public owner;
    bytes32 public eligibleVotersMerkleRoot;
    uint64 public yesVotes;
    uint64 public noVotes;
    bool public isStopped = false;

    mapping(address => bool) voted;

    modifier stopped {
        require(!isStopped);
        _;
    }

    modifier onlyAuthorized {
        require(!isStopped, "Is Stopped");
        _;
    }

    function stopContract() public onlyAuthorized {
        if (!isStopped) {
            isStopped = true;
        } else {
            isStopped = false;

        }
    }

    constructor(bytes32 eligibleVotersMerkleRoot_) public {
        eligibleVotersMerkleRoot = eligibleVotersMerkleRoot_;
        owner = msg.sender;
    }

    function vote(uint256 path, bytes32[] memory witnesses, bool myVote)
        public
        stopped
    {
        //validate the proof!
        bytes32 node = leafHash(msg.sender);
        // bytes32 node;
        for (uint16 i = 0; i < witnesses.length; i++) {
            if ((path & 0x01) == 1) {
                node = nodeHash(witnesses[i], node);
            } else {
                node = nodeHash(node, witnesses[i]);
            }
            path /= 2;
        }
        require(node == eligibleVotersMerkleRoot, "merkel tree not validated");
        require(!voted[msg.sender], "already voted");
        voted[msg.sender] = true;

        if (myVote) yesVotes++;
        else noVotes++;
        emit Voted(msg.sender, myVote);
    }

    /// INTERNAL FUNCTIONS ///

    function leafHash(address leaf) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(uint8(0x00), leaf));
    }

    function nodeHash(bytes32 left, bytes32 right)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(uint8(0x01), left, right));
    }
    event Voted(address indexed _from, bool indexed myVote);

}
