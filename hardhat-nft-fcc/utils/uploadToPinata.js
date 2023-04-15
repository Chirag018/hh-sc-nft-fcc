const pinataSDK = require("@pinata/sdk");
const fs = require("fs")
const path = require("path");
require("dotenv").config()

// const pinataApiKey = process.env.PINATA_API_KEY;
// const pinataApiSecret = process.env.PINATA_API_SECRET;
// const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);
console.log("hello");
async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);
    console.log(fullImagesPath);
    const files = fs.readdirSync(fullImagesPath)
    // .filter((file) => file.includes('.png'))
    // console.log(files);

    // let responses = []
    // console.log('uploading to IPFS');

    // for (fileIndex in files) {
    //     console.log(`working on ${fileIndex}...`);
    //     const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
    //     // const options = {
    //     //     pinataMetadata: {
    //     //         name: files[fileIndex],
    //     //     }
    //     // }
    //     try {
    //         const response = await pinata.pinFileToIPFS(readableStreamForFile)
    //         responses.push(response)
    //         // await pinata.pinFileToIPFS(readableStreamForFile, options)
    //         //     .then((result) => {
    //         //         response.push(result)
    //         //     })
    //         //     .catch((e) => {
    //         //         console.log(e);
    //         //     })

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // return { responses, files }
}

module.exports = { storeImages }