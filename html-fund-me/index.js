//in node.js : "require" keyword import dependencies
//Frontend javacsript you can't use the require , use "import" instead
import { ethers } from "./ethers.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    const connectButton = document.getElementById("connectButton")

    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "Connected!!"
        } catch (error) {
            console.error("Error connecting:", error)
            connectButton.innerHTML = "Connection failed!"
        }
    } else {
        connectButton.innerHTML = "No MetaMask installed!"
    }
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(`${ethers.utils.formatEther(balance)} ETH in a contract!`)
        console.log(`contrat address is ${contractAddress}`)
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("withdrawing......")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

//fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        //provider //connection to the blockChain
        // signer //wallet / someone with somw gas
        //contract that we gonna interacting with
        //abi & address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() //wallet address of the user
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer) //fetching deployed contract
        try {
            //creating a transaction (funding)
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}.....`)
    //listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

//withdraw function
