const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory, deploySimpleStorage
    beforeEach(async function () {
        //tells us what to do before each bunch 'it'
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        deploySimpleStorage = await simpleStorageFactory.deploy()
    })

    it("It should start with a favorite number set to zero", async function () {
        const currentValue = await deploySimpleStorage.retrieve()
        const expectedvalue = "0"
        //assert or exepect
        assert.equal(currentValue.toString(), expectedvalue)
        //expect(currentValue.toString()).to.equal(expectedvalue)
    })
    it("It should update when we call store function", async function () {
        //it.only to run a only specific task
        const expectedvalue = "7"
        const transactionRespone =
            await deploySimpleStorage.store(expectedvalue)
        await transactionRespone.wait(1)

        const currentValue = await deploySimpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedvalue)
    })
})
