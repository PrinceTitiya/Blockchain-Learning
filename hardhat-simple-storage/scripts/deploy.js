const { ConstructorFragment } = require("ethers")
const { ethers, run, network } = require("hardhat")

async function main() {
    const simpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log("deploying the contract....please wait!")

    const deploySimpleStorage = await simpleStorageFactory.deploy()
    await deploySimpleStorage.waitForDeployment()
    const deployed_address = await deploySimpleStorage.getAddress()
    console.log(`deployed contract to : ${deployed_address}`)
    //console.log(network.config)

    // // verifying the contract with the chainId (if it's any other network than hardhat) and Etherscan API key
    // if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    //     await deploySimpleStorage.waitForDeployment(1)
    //     await verify(deployed_address, []) //calling the verify function
    // }
    // retrieving the current value
    const currentValue = await deploySimpleStorage.retrieve()
    console.log(`current value is: ${currentValue}`)

    // updatind the stored value
    const transactionRespone = await deploySimpleStorage.store(145)
    await transactionRespone.wait(1)
    const updatedValue = await deploySimpleStorage.retrieve()
    console.log(`updated value is: ${updatedValue}`)
}

async function verify(contractAddres, args) {
    //args for constructors
    try {
        console.log("Verifying the contract....")
        await run("verify:verify", {
            // run("task:subtask",{parameters})
            address: contractAddres,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
