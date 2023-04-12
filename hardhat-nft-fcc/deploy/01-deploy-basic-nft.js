const { network } = require("hardhat");
const { develoymentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    arguments = [];
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!develoymentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log('verifying..')
        await verify(basicNft.address, arguments);
    }
}