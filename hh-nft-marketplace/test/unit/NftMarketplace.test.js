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
        describe("listItem", function () {
            it("emits an event after listing an item", async function () {
                expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit("ItemListed")
            })

            it("exclusively item that haven't been listed", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                const error = `AlreadyListed("${basicNft.address}",${TOKEN_ID})`
                // const error = 'AlreadyListed'
                console.log(error);
                await expect(
                    nftMarketplace.listItem(
                        basicNft.address, TOKEN_ID, PRICE))
                    .to.be.revertedWith(error);
            })

            // it("should revert if price is zero",async ()=>{
            //     const zero=0;
            //     await expect(nftMarketplace.listItem(basicNft.address,TOKEN_ID,PRICE)).to.be.revertedWith("PriceMustBeAboveZero")
            // })

            it("exclusively allows owners to list", async function () {
                nftMarketplace = nftMarketplaceContract.connect(user);
                await basicNft.approve(user.address, TOKEN_ID);
                // const dummyAccount = '0x000000000000000000'
                await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWith("NotOwner")
            })
            it("needs approval to list item", async function () {
                await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWith("NotApprovedForMarketplace");
            })
            it("updates listing with seller and prices", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                assert(listing.price.toString() == PRICE.toString())
                assert(listing.seller.toString() == deployer.address);
            })
        })

        describe("cancelListing", function () {
            it('reverts if there is no listing', async function () {
                const error = `NotListed("${basicNft.address}",${TOKEN_ID})`
                // console.log(await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID));
                await expect(nftMarketplace.cancelListing(basicNft.address, TOKEN_ID))
                    .to.be.revertedWith(error)

            })
            it('reverts if anyone but the owner tries to call', async () => {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                nftMarketplace = nftMarketplaceContract.connect(user);
                await basicNft.approve(user.address, TOKEN_ID);
                await expect(nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)).to.be.revertedWith("NotOwner")
            })

            it('emits event and remove listing', async () => {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                expect(await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)).to.emit("ItemCanceled")
                const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                assert(listing.price.toString() == '0')
            })
        })


        describe("buyItem", () => {
            it('reverts if the item isnt listed', async () => {
                await expect(nftMarketplace.buyItem(basicNft.address, TOKEN_ID))
                    .to.be.revertedWith("NotListed")
            })

            it('reverts if the price isnt met', async () => {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                await expect(nftMarketplace.buyItem(basicNft.address, TOKEN_ID)).to.be.revertedWith("PriceNotMet")
            })

            it("transfer the nft to the buyer and updates internal proceeds record", async () => {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                nftMarketplace = nftMarketplaceContract.connect(user);
                expect(await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE }))
                    .to.emit("ItemBought")
                const newOwner = await basicNft.ownerOf(TOKEN_ID);
                const deployerProceeds = await nftMarketplace.getProceeds(deployer.address);
                assert(newOwner.toString() == user.address);
                assert(deployerProceeds.toString() == PRICE.toString())
            })
        })

        describe('updateListing', () => {
            it("must be owner and listed", async () => {
                await expect(nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE))
                    .to.be.revertedWith("NotListed")
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                nftMarketplace = nftMarketplaceContract.connect(user)
                await expect(nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE))
                    .to.be.revertedWith("NotOwner")

            })
            it("reverts if new price is 0", async () => {
                const updatedPrice = ethers.utils.parseEther("0")
                await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
                await expect(nftMarketplace.updateListing(basicNft.address, TOKEN_ID, updatedPrice))
                    .to.be.revertedWith("PriceMustBeAboveZero")
            })
            it("updates the price of the item", async () => {
                const updatedPrice = ethers.utils.parseEther("0.2")
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                expect(await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, updatedPrice)).to.emit("ItemListed");
                const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
                assert(listing.price.toString() == updatedPrice.toString())
            })

        })

        describe('withdrawProceeds', () => {
            it("doesn't allow 0 proceed withdrawls", async () => {
                await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith("NoProceeds")
            })
            it("withdraws proceeds", async () => {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                nftMarketplace = nftMarketplaceContract.connect(user);
                await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
                nftMarketplace = nftMarketplaceContract.connect(deployer);

                const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer.address)
                const deployerBalanceBefore = await deployer.getBalance();
                const txResponse = await nftMarketplace.withdrawProceeds();
                const transactionReceipt = await txResponse.wait(1);
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice);
                const deployerBalanceAfter = await deployer.getBalance();

                assert(deployerBalanceAfter.add(gasCost).toString() ==
                    deployerProceedsBefore.add(deployerBalanceBefore).toString())
            })
        })


    })