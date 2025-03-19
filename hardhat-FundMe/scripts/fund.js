const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMeDeployment = await deployments.get("FundMe") // Get deployed contract info
    const signer = await ethers.getSigner(deployer) //  Get the signer object
    const fundMe = await ethers.getContractAt(
        "FundMe",
        fundMeDeployment.address,
        signer
    )

    console.log("funding Contract...")
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("0.1"),
    })
    await transactionResponse.wait(1)
    console.log("Funded!!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
