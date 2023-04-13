const pinataSDK = require("@pinata/sdk");
const fs = require("fs")
const path = require("path");
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);
    const files = fs.readdirSync(fullImagesPath).filter((file) => file.includes('.png'))

    let response = []
    console.log('uploading to IPFS');

    for (const fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            }
        }
        try {
            await pinata.pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    response.push(result)
                })
                .catch((e) => {
                    console.log(e);
                })

        } catch (error) {
            console.log(error);
        }
    }
    return { response, files }
}

module.exports = { storeImages }