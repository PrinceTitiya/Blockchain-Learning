const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { DevelopmentChains } = require("../../helper-hardhat-config")

!DevelopmentChains.includes(network.name) // only runs on the local node
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          let sendValue = ethers.parseEther("1") // 1 ETH

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) // Deploy contracts

              const signer = await ethers.getSigner(deployer)

              // Fetch FundMe contract
              const fundMeDeployment = await deployments.get("FundMe")
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  fundMeDeployment.address,
                  signer
              )

              // Fetch MockV3Aggregator contract
              const mockV3Deployment = await deployments.get("MockV3Aggregator")
              mockV3Aggregator = await ethers.getContractAt(
                  "MockV3Aggregator",
                  mockV3Deployment.address,
                  signer
              )

              mockV3AggregatorAddress = mockV3Deployment.address // Assign the correct address
          })

          describe("constructor", function () {
              it("sets the aggregator addresses correctly!", async function () {
                  const response = await fundMe.s_priceFeed()

                  console.log(
                      "Expected MockV3Aggregator Address:",
                      mockV3AggregatorAddress
                  )
                  console.log("Received from FundMe PriceFeed:", response)

                  assert.equal(
                      response.toLowerCase(),
                      mockV3AggregatorAddress.toLowerCase()
                  )
              })
          })

          describe("fund", function () {
              it("Fails if you do not send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updates the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.addressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("Adds funder to array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.funders(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", function () {
              beforeEach(async function () {
                  // Fund the contract before withdrawing
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single founder", async function () {
                  // Arrange
                  const fundMeAddress = await fundMe.getAddress()
                  console.log("FundMe Contract Address:", fundMeAddress)

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Act - run withdraw function
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, gasPrice } = transactionReceipt //pull out objects from the transactionReceipt
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMeAddress
                  )

                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Assert
                  assert.equal(endingFundMeBalance.toString(), "0")
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
              })

              it("allows us to withdraw with multiple funders", async function () {
                  const accounts = await ethers.getSigners()

                  // Each of the first 5 accounts funds the contract
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const fundMeAddress = await fundMe.getAddress()
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMeAddress)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Act - Withdraw funds
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasPrice, gasUsed } = transactionReceipt
                  const gasCost = gasUsed * gasPrice

                  // Define endingFundMeBalance before using it
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMeAddress
                  )

                  //  Define endingDeployerBalance before using it
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Assertions
                  assert.equal(endingFundMeBalance.toString(), "0")
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )

                  // Ensure funders array is reset
                  await expect(fundMe.funders(0)).to.be.reverted

                  // Ensure all funders' balances in mapping are set to zero
                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.addressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("only allow owners to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(attackerConnectedContract.withdraw()).to.be
                      .reverted
              })
          })
      })
