const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages } = require("../utils/uploadToPinata")

const imagesLocation = "../images/randomNft";
// const FUND_AMOUNT = "1000000000000000000000"

// const metadataTemplate = {
//     name: "",
//     description: "",
//     image: "",
//     attributes: [
//         {
//             trait_type: "Cuteness",
//             value: 100,
//         },
//     ],
// }


module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Mock, subscriptionId, vrfCoordinatorV2Address;

    if (process.env.UPLOAD_TO_PINATA == 'true') {
        tokenUris = await handleTokenUris();
    }

    if (developmentChains.includes(network.name)) {
        // create VRFV2 Subscription
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        // await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    await storeImages("../images/randomNft")

    // arguments = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId]["gasLane"],
    //     networkConfig[chainId]["callbackGasLimit"],
    //     // tokenUris,
    //     networkConfig[chainId]["mintFee"],
    // ]

    // const randomIpfsNft = await deploy("RandomIpfsNft", {
    //     from: deployer,
    //     args: arguments,
    //     log: true,
    //     waitConfirmations: network.config.blockConfirmations || 1,
    // })
}

async function handleTokenUris() {
    tokenUris = [];
    // const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    // for (imageUploadResponseIndex in imageUploadResponses) {
    //     let tokenUriMetadata = { ...metadataTemplate }
    //     tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
    //     tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
    //     tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
    //     console.log(`uploading ${tokenUriMetadata.name}...`);
    //     const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata);
    //     tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    // }
    // console.log('token uris uploaded!! they are:');
    // console.log(tokenUris);
    return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];


