const { run } = require("hardhat")

const verify = async (contractAddres, args) => {
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

module.exports = { verify }
