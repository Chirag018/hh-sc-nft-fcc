const { assert } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("Basic NFT unit tests", function () {
    let basicNft, deployer;

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["basicnft"])
        basicNft = await ethers.getContract("BasicNft");
    })

    describe("Constructor", () => {
        it("initializes the nft correctly", async () => {
            const name = await basicNft.name();
            const symbol = await basicNft.symbol();
            const tokenCounter = await basicNft.getTokenCounter();
            assert.equal(name, "Dogie");
            assert.equal(symbol, "DOG");
            assert.equal(tokenCounter.toString(), "0");
        })
    })

    describe("mint nft", () => {
        beforeEach(async () => {
            const txResponse = await basicNft.mintNft();
            await txResponse.wait(1);
        })
        it("allows user to mint an nft, and updates appropriately", async function () {
            const tokenURI = await basicNft.tokenURI(0);
            const tokenCounter = await basicNft.getTokenCounter();

            assert.equal(tokenCounter.toString(), "1");
            assert.equal(tokenURI, await basicNft.TOKEN_URI())
        })
        it("show the correct balance and owner of an nft", async function () {
            const deployerAddress = deployer.address;
            const deployerBalance = await basicNft.balanceOf(deployerAddress);
            const owner = await basicNft.owner("0");

            assert.equal(deployerBalance.toString(), "1")
            assert.equal(owner, deployerAddress);
        })
    })
})