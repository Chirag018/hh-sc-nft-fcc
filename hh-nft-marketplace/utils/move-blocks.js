const { network } = require("hardhat")

function sleep(timeInMs) {
    return new Promise((resolve) => setTimeout(resolve, timeInMs))
}

async function moveBlock(amount, sleepAmount = 0) {
    console.log('moving blocks...');
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
        if (sleepAmount) {
            console.log(`sleeping for ${sleepAmount}`);
            await sleep(sleepAmount);
        }
    }
    console.log(`moved ${amount} blocks`);
}

module.exports = {
    moveBlock,
    sleep,
}