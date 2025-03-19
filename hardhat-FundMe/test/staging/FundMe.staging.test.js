const { getNamedAccounts, ethers, network } = require("hardhat")
const { DevelopmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

DevelopmentChains.includes(network.name) //only runs on the testnet
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let delpoyer
          let sendValue = ethers.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              //await deployments.fixture(["all"]) // Deploy contracts
              const signer = await ethers.getSigner(deployer)
              // Fetch FundMe contract
              const fundMeDeployment = await deployments.get("FundMe")
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  fundMeDeployment.address,
                  signer
              )
          })

          it("allows to people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()

              const fundMeAddress = await fundMe.getAddress()
              const endingBalance = await ethers.provider.getBalance(
                  fundMeAddress
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
