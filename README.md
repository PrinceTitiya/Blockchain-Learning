
---

## 📌 Projects

### 1️⃣ hardhat-fundme

A simple **crowdfunding smart contract** built with Solidity and Hardhat.  
- Deployable to local or test networks.
- Includes deployment and interaction scripts.
- Comes with automated tests.

**Use case:** Learn how to write, deploy, and test a contract where users can fund a project and the owner can withdraw the funds.

---

### 2️⃣ hardhat-simple-storage

A basic **storage smart contract** that lets you:
- Store a favorite number.
- Retrieve the stored value.
- Understand state variables and functions.

**Use case:** Great for absolute Solidity beginners to grasp contract basics and unit testing.

---

### 3️⃣ html-fundme

A simple **frontend (HTML/JS)** to interact with the `FundMe` smart contract.  
- Connects to MetaMask.
- Lets users fund the contract and withdraw funds if they are the owner.
- Built with plain HTML and JavaScript.

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/).
- [Hardhat](https://hardhat.org/).
- [MetaMask](https://metamask.io/) for frontend interaction.

---

### Clone the repo

```bash
git clone https://github.com/PrinceTitiya/Blockchain-Learning.git
cd Blockchain-Learning


cd hardhat-fundme   # or hardhat-simple-storage
yarn install

yarn hardhat test  # local testing
yarn hardhat node      # Run a local blockchain
yarn hardhat run scripts/deploy.js --network localhost
