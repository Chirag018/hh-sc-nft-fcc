const networkConfig = {
    31337: {
        name: "localhost",
        ethUsdPriceFeed: "",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        subscriptionId: "588",
        mintFee: "1 0000 0000 0000 0000",// 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
    },
    80001: {
        name: "mumbai",
        ethUsdPriceFeed: "",
        subscriptionId: "4057", //initially let's consider 0, will change it!
        gasLane: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
        callbackGasLimit: "500000",
        mintFee: "1 0000 0000 0000 0000",// 0.01 ETH
        vrfCoordinatorV2: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    },
}
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = "18";
const INITIAL_PRICE = "200000000000000000000"

module.exports = {
    networkConfig, developmentChains, DECIMALS, INITIAL_PRICE,
}