import SolnSquareVerifier from "./SolnSquareVerifier.json";
import Web3 from "web3";
const { proof, inputs } = require("./proof.json");

// const wallet = "0xeeF08f7545822AE5Df4d7B121013B931d8971466";
const contractAddress = "0x7602766dA2d3b0db8bdA1B9C9D8CABc54595c9C5";

const Contract = {
  web3: null,
  accounts: null,
  meta: null,
  initialized: false,
  deployedNetwork: null,
  networkId: null,

  initialize: async function () {
    // const { web } = this;
    if (window.ethereum) {
      // use MetaMask's provider
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.enable(); // get permission to access accounts
    } else {
      console.warn(
        "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live"
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:9545")
      );
    }

    try {
      // get contract instance
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = SolnSquareVerifier.networks[this.networkId];
      this.meta = new this.web3.eth.Contract(
        SolnSquareVerifier.abi,
        contractAddress
      );
      // get accounts
      this.accounts = await this.web3.eth.getAccounts();
      const event = new CustomEvent("contractInitialized");

      window.dispatchEvent(event);
      console.log("Contract initialized");
      this.initialized = true;
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  mint: async function (tokenId, wallet) {
    const { mintNFT } = this.meta.methods;
    const result = await mintNFT(
      proof.a,
      proof.b,
      proof.c,
      inputs,
      tokenId,
      wallet
    ).send({ from: wallet });
    console.log("Aqui está el token: ", result);
  }
};

export default Contract;
