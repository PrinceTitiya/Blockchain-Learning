const { getNamedAccounts, ethers, deployments } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMeDeployment = await deployments.get("FundMe")
    const signer = await ethers.getSigner(deployer)
    const fundMe = await ethers.getContractAt(
        "FundMe",
        fundMeDeployment.address,
        signer
    )
    console.log("Funding......")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Got the funds back!!!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
