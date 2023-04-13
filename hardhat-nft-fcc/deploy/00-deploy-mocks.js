const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function (hre) {
    const { deployments, getNamedAccounts, network, ethers } = hre;

    const BASE_FEE = ethers.utils.parseEther("0.25");
    const GAS_PRICE_FEE = 1e9;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const args = [BASE_FEE, GAS_PRICE_FEE]

    if (developmentChains.includes(network.name)) {
        log("local network dtected..! deploying mocks")

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("mocks deployed..")
    }
}

module.exports.tags = ["all", "mocks"]