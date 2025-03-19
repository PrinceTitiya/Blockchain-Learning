const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    137: {
        name: "polygon",
        ethUsdPriceFeedAddress: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
}

const DevelopmentChains = ["hardhat", "localhost"]
const DECIMALS = 8 //constructor parameters passed into args, to deploy mocks, fetch from the mockV3Aggregator.sol
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    DevelopmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
