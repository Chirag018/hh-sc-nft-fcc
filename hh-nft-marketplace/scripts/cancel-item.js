const { ethers, network } = require("hardhat");
const { moveBlock } = require("../utils/move-blocks");

const TOKEN_ID = 0;

async function cancel() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
    await tx.wait(1);
    console.log('nft cancelled!');
    if ((network.config.chainId == '31337')) {
        await moveBlock(2, (sleepAmount = 1000))
    }
}

cancel().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})