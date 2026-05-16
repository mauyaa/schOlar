import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8546",
    },
    // add your testnet/mainnet here
    // sepolia: { url: process.env.SEPOLIA_RPC!, accounts: [process.env.PRIVATE_KEY!] }
  }
};

export default config;
