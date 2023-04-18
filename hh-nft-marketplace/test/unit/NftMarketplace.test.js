const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect, use } = require("chai");

!developmentChains.includes(network.name)
    ? describe.skip :
    describe("NFT Marketplace unit tests", function () {
        let nftMarketplace, basicNft, deployer, player;
        const PRICE = ethers.utils.parseEther("0.1")
        const TOKEN_ID = 0;

        // beforeEach(async function () {
        //     deployer = (await getNamedAccounts()).deployer;
        //     // player = (await getNamedAccounts()).player;
        //     const accounts = await ethers.getSigners();
        //     player=accounts[1]
        //     // deployer = accounts[0];
        //     // user = accounts[1];
        //     await deployments.fixture(["all"])
        //     nftMarketplace = await ethers.getContract("NftMarketplace")
        //     // nftMarketplace = await nftMarketplace.connect(deployer)
        //     basicNft = await ethers.getContract("BasicNft");
        //     // basicNft = await basicNft.connect(deployer);
        //     await basicNft.mintNft();
        //     await basicNft.approve(nftMarketplace.address, TOKEN_ID);

        // })
        // it("lists can be bought", async function () {
        //     await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
        //     const playerConnectedNFTMarketplace = nftMarketplace.connect(player);
        //     await playerConnectedNFTMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE, });
        //     const newOwner = await basicNft.ownerOf(TOKEN_ID);
        //     const deployerProceeds = await nftMarketplace.getProceeds(deployer);
        //     assert(newOwner.toString() == player.address);
        //     assert(deployerProceeds.toString() == PRICE.toString())
        // })

        // another method:

        beforeEach(async () => {
            accounts = await ethers.getSigners();
            deployer = accounts[0];
            user = accounts[1];
            await deployments.fixture(["all"]);
            nftMarketplaceContract = await ethers.getContract("NftMarketplace");
            nftMarketplace = nftMarketplaceContract.connect(deployer);
            basicNftContract = await ethers.getContract("BasicNft")
            basicNft = await basicNftContract.connect(deployer);
            await basicNft.mintNft();
            await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID);

        })
        describe("listItem", () => {
            it("emits an event after listing an item", async () => {
                expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit("ItemListed")
            })

            it("exclusively item that haven't been listed", async () => {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                const error = `AlreadyListed("${basicNft.address}",${TOKEN_ID})`
                console.log(nftMarketplace.listItem(
                    basicNft.address, TOKEN_ID, PRICE));
                await expect(
                    nftMarketplace.listItem(
                        basicNft.address, TOKEN_ID, PRICE))
                    .to.be.revertedWith(error);
            })

            it("exclusively allows owners to list", async () => {
                nftMarketplace = nftMarketplaceContract.connect(user);
                await basicNft.approve(user.address, TOKEN_ID);
                await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWith("NotOwner")
            })
            it("needs approval to list item", async () => {
                await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWith("NotApprovedForMarketplace");
            })
            it("updates listing with seller and prices", async () => {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                assert(listing.price.toString() == PRICE.toString())
                assert(listing.seller.toString() == deployer.address);
            })
        })

        describe("cancelListing",function(){
            it('reverts if there is no listing',async function(){
                const error=`NotListed("${basicNft.address}",${TOKEN_ID})`
                // await expect(nftMarketplace.)
            })
        })
    })