require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("./tasks/block-number")
require("hardhat-gas-reporter")
//require("@nomiclabs/hardhat-etherscan")

/** @type import('hardhat/config').HardhatUserConfig */

task("accounts", "Prints the list of accounts", async (_, hre) => {
    const accounts = await hre.ethers.getSigners()
    accounts.forEach((account) => console.log(account.address))
})

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

module.exports = {
    solidity: "0.8.28",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    solidity: "0.8.18",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        gasPriceApi: `https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${ETHERSCAN_API_KEY}`,
    },
}
