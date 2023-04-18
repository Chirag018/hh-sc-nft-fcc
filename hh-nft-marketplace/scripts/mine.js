const { moveBlock } = require("../utils/move-blocks")

const BLOCK = 5;

async function mine() {
    await moveBlock(BLOCK);
}

mine().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })