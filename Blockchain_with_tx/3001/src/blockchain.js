import CryptoJS from "crypto-js";
import _ from "lodash"
import { broadcastLatest, broadCastTransactionPool } from "./p2p.js";
import { processTransactions, getCoinbaseTransaction, isValidAddress } from "./transaction.js";
import { getTransactionPool, addToTransactionPool, updateTransactionPool } from "../../3001/src/transactionPool.js";
import { hexToBinary } from "./util.js"
import { findUnspentTxOuts, getPublicFromWallet, createTransaction, createTransactionFromUser, getPrivateFromWallet, getBalance } from "./wallet.js"
import { pool } from "./db.js"


class Block {
    constructor(index, hash, previousHash, timestamp, data, difficulty, nonce) {
        this.index = index;
        this.data = data;
        this.timestamp = timestamp;
        this.hash = hash;
        this.previousHash = previousHash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
};
// exports.Block = Block;
let genesisTransaction = {
    'txIns': [{ 'signature': '', 'txOutId': '', 'txOutIndex': 0 }],
    'txOuts': [{
        'address': '04a7345d94f612a9928fafdaa922a1ac8471c28a4969da72d0295861a7e1d1b6234c8644be46c4ab4f22d1ac6ed93afbec95e4e5f9596dc475c6641c1de2f2e2c2',
        'amount': 50
    }],
    'id': 'fc0f6a92a468b2c3689be429eaed1ebce4550529801920c79782978e7d428399'
};
let genesisBlock = new Block(0, '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627', '', 1652675278, [genesisTransaction], 0, 0);
let blockchain = [];
// let unspentTxOuts = (0, .processTransactions)(blockchain[0].data, [], 0);
let unspentTxOuts;
const updateBlocks = async () => {
    const [result] = await pool.query(`SELECT * FROM blocks_tx`) // [data,field] 
    // blockchain = result;
    if (result.length === 0) {
        console.log('genesis block created')
        blockchain = [genesisBlock];
        unspentTxOuts = processTransactions(blockchain[0].data, [], 0)
        // } else if (blocks.length > 0 && blocks[blocks.length-1].index !== result[result.length - 1].index) { //수정중
    } else if (result.length > 0) {
        blockchain = result;
        for (let block of blockchain) {
            block.data = JSON.parse(block.data.replace(/\\/g, ''))
            // console.log(block.data)
        }
        console.log("unspent from updateBlocks: ", getUnspentTxOuts())
        // let retVal = (0, .processTransactions)(getLatestBlock().data, getUnspentTxOuts() || [], getLatestBlock().index);
        // setUnspentTxOuts(retVal);
        setUnspentTxOuts(isValidChain(blockchain) || []);
        //여기서 이전 db상의 blockchain을 불러왔을때 vaildation과 unspentTxOuts 계산 없다면 빈배열
    }

    if (blockchain.length > 0 && blockchain.length > result.length) {
        console.log(blockchain.length)
        console.log(result.length)
        for (let i = 0; i < blockchain.length; i++) {
            await pool.query(`INSERT INTO blocks_tx
                                        VALUES (${blockchain[i].index},'${JSON.stringify(blockchain[i].data)}',${blockchain[i].timestamp},
                                        '${blockchain[i].hash}','${blockchain[i].previousHash}',${blockchain[i].difficulty},${blockchain[i].nonce});`)
            // console.log("data ", JSON.stringify(blockchain[i].data))

        }
    }
    console.log('blocks db updated')
}
updateBlocks();
// the unspent txOut of genesis block is set to unspentTxOuts on startup

let getBlockchain = function () { return blockchain; };

let getUnspentTxOuts = function () { return _.cloneDeep(unspentTxOuts); };

// and txPool should be only updated at the same time
let setUnspentTxOuts = function (newUnspentTxOut) {
    console.log('replacing unspentTxouts with: %s', newUnspentTxOut);
    // console.log(newUnspentTxOut)
    unspentTxOuts = newUnspentTxOut;
};
let getLatestBlock = function () { return blockchain[blockchain.length - 1]; };

// in seconds
let BLOCK_GENERATION_INTERVAL = 10;
// in blocks
let DIFFICULTY_ADJUSTMENT_INTERVAL = 10;
let getDifficulty = function (aBlockchain) {
    let latestBlock = aBlockchain[blockchain.length - 1];
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
        return getAdjustedDifficulty(latestBlock, aBlockchain);
    }
    else {
        return latestBlock.difficulty;
    }
};
let getAdjustedDifficulty = function (latestBlock, aBlockchain) {
    let prevAdjustmentBlock = aBlockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    let timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    let timeTaken = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
    // console.log(prevAdjustmentBlock)
    // console.log(timeExpected)
    // console.log(timeTaken)
    if (timeTaken < timeExpected / 2) {
        console.log(prevAdjustmentBlock.difficulty)
        return prevAdjustmentBlock.difficulty + 1;
    }
    else if (timeTaken > timeExpected * 2 && prevAdjustmentBlock.difficulty > 0) {
        console.log(prevAdjustmentBlock.difficulty)
        return prevAdjustmentBlock.difficulty - 1;
    }
    else {
        console.log("prevAdjustmentBlock", prevAdjustmentBlock.difficulty)
        return prevAdjustmentBlock.difficulty;
    }
};
let getCurrentTimestamp = function () { return Math.round(new Date().getTime() / 1000); };
let generateRawNextBlock = function (blockData) {
    let previousBlock = getLatestBlock();
    let difficulty = getDifficulty(getBlockchain());
    let nextIndex = previousBlock.index + 1;
    let nextTimestamp = getCurrentTimestamp();
    let newBlock = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    if (addBlockToChain(newBlock)) {
        (0, broadcastLatest)();
        return newBlock;
    }
    else {
        return null;
    }
};

// gets the unspent transaction outputs owned by the wallet
let getMyUnspentTransactionOutputs = function () {
    return findUnspentTxOuts(getPublicFromWallet(), getUnspentTxOuts());
};

let generateNextBlock = function () {
    let coinbaseTx = getCoinbaseTransaction(getPublicFromWallet(), getLatestBlock().index + 1);
    let blockData = [coinbaseTx].concat(getTransactionPool());
    return generateRawNextBlock(blockData);
};

let userGenerateNextBlock = function (address) {
    let coinbaseTx = getCoinbaseTransaction(address, getLatestBlock().index + 1);
    let blockData = [coinbaseTx].concat(getTransactionPool());
    return generateRawNextBlock(blockData);
};

let userAutoMineBlock = function (address, count) {
    let mineCount = 0;
    while (mineCount < count) {
        let coinbaseTx = getCoinbaseTransaction(address, getLatestBlock().index + 1);
        let blockData = [coinbaseTx].concat(getTransactionPool());
        if (generateRawNextBlock(blockData)) {
            mineCount++;
        }
        console.log(`${mineCount} of ${count} completed`)
        console.log(blockData)
    }
    // return generateRawNextBlock(blockData);
};

let generatenextBlockWithTransaction = function (receiverAddress, amount) {
    if (!isValidAddress(receiverAddress)) {
        throw Error('invalid address');
    }
    if (typeof amount !== 'number') {
        throw Error('invalid amount');
    }
    let coinbaseTx = getCoinbaseTransaction(getPublicFromWallet(), getLatestBlock().index + 1);
    let tx = createTransaction(receiverAddress, amount, getPrivateFromWallet(), getUnspentTxOuts(), getTransactionPool());
    let blockData = [coinbaseTx, tx];
    return generateRawNextBlock(blockData);
};

let findBlock = function (index, previousHash, timestamp, data, difficulty) {
    let nonce = 0;
    while (true) {
        let hash = calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
        if (hashMatchesDifficulty(hash, difficulty)) {
            return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++;
    }
};
let getAccountBalance = function () {
    return getBalance(getPublicFromWallet(), getUnspentTxOuts());
};
let getAccountBalanceOfUser = function (address) {
    return getBalance(address, getUnspentTxOuts());
};

let sendTransaction = function (address, amount) {
    let tx = createTransaction(address, amount, getPrivateFromWallet(), getUnspentTxOuts(), getTransactionPool());
    addToTransactionPool(tx, getUnspentTxOuts());
    broadCastTransactionPool();
    return tx;
};
let sendTransactionFromUser = function (fromAddress, senderPrivateKey, toAddress, amount) {
    let tx = createTransactionFromUser(toAddress, amount, fromAddress, senderPrivateKey, getUnspentTxOuts(), getTransactionPool());
    addToTransactionPool(tx, getUnspentTxOuts());
    broadCastTransactionPool();
    return tx;
};

let calculateHashForBlock = function (block) {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.difficulty, block.nonce);
};
let calculateHash = function (index, previousHash, timestamp, data, difficulty, nonce) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString();
};
let isValidBlockStructure = function (block) {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'object';
};

let isValidNewBlock = function (newBlock, previousBlock) {
    if (!isValidBlockStructure(newBlock)) {
        console.log('invalid block structure: %s', JSON.stringify(newBlock));
        return false;
    }
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    }
    else if (previousBlock.hash !== newBlock.previousHash) {
        console.log(previousBlock.index)
        console.log(previousBlock.hash)
        console.log(newBlock.index)
        console.log(newBlock.previousHash)

        
        console.log('invalid previoushash');
        return false;
    }
    else if (!isValidTimestamp(newBlock, previousBlock)) {
        console.log('invalid timestamp');
        return false;
    }
    else if (!hasValidHash(newBlock)) {
        return false;
    }
    return true;
};
let getAccumulatedDifficulty = function (aBlockchain) {
    return aBlockchain
        .map(function (block) { return block.difficulty; })
        .map(function (difficulty) { return Math.pow(2, difficulty); })
        .reduce(function (a, b) { return a + b; });
};
let isValidTimestamp = function (newBlock, previousBlock) {
    return (previousBlock.timestamp - 60 < newBlock.timestamp)
        && newBlock.timestamp - 60 < getCurrentTimestamp();
};
let hasValidHash = function (block) {
    if (!hashMatchesBlockContent(block)) {
        console.log('invalid hash, got:' + block.hash);
        return false;
    }
    if (!hashMatchesDifficulty(block.hash, block.difficulty)) {
        console.log('block difficulty not satisfied. Expected: ' + block.difficulty + 'got: ' + block.hash);
    }
    return true;
};
let hashMatchesBlockContent = function (block) {
    let blockHash = calculateHashForBlock(block);
    return blockHash === block.hash;
};
let hashMatchesDifficulty = function (hash, difficulty) {
    let hashInBinary = hexToBinary(hash);
    let requiredPrefix = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
};
/*
    Checks if the given blockchain is valid. Return the unspent txOuts if the chain is valid
 */
let isValidChain = function (blockchainToValidate) {
    console.log('isValidChain:');
    // console.log(JSON.stringify(blockchainToValidate)); //.replace(/\\/g, '')
    let isValidGenesis = function (block) {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isValidGenesis(blockchainToValidate[0])) {
        return null;
    }
    /*
    Validate each block in the chain. The block is valid if the block structure is valid
      and the transaction are valid
     */
    let aUnspentTxOuts = [];
    for (let i = 0; i < blockchainToValidate.length; i++) {
        let currentBlock = blockchainToValidate[i];
        if (i !== 0 && !isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return null;
        }
        aUnspentTxOuts = processTransactions(currentBlock.data, aUnspentTxOuts, currentBlock.index);
        if (aUnspentTxOuts === null) {
            console.log('invalid transactions in blockchain');
            return null;
        }
    }
    return aUnspentTxOuts;
};
let addBlockToChain = async function (newBlock) {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        // console.log('addBlockToChain : ', newBlock.data)
        // console.log('getUnspentTxOuts : ', getUnspentTxOuts())
        let retVal = processTransactions(newBlock.data, getUnspentTxOuts(), newBlock.index);
        if (retVal === null) {
            console.log('block is not valid in terms of transactions');
            return false;
        }
        else {
            blockchain.push(newBlock);
            setUnspentTxOuts(retVal);
            updateTransactionPool(unspentTxOuts);
            try {
                const result = await pool.query(`INSERT INTO blocks_tx
                VALUES (${newBlock.index},'${JSON.stringify(newBlock.data)}',${newBlock.timestamp},
                '${newBlock.hash}','${newBlock.previousHash}',${newBlock.difficulty},${newBlock.nonce});`)
                await updateBlocks();

            } catch (e) {
                // contiune
                console.log(e)
                return false;
            }
            // await updateBlocks();
            return true;
        }
    }
    return false;
};

let replaceChain = function (newBlocks) {
    let aUnspentTxOuts = isValidChain(newBlocks);
    let validChain = aUnspentTxOuts !== null;
    if (validChain &&
        getAccumulatedDifficulty(newBlocks) > getAccumulatedDifficulty(getBlockchain())) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        setUnspentTxOuts(aUnspentTxOuts);
        updateTransactionPool(unspentTxOuts);
        broadcastLatest();
    }
    else {
        console.log('Received blockchain invalid');
    }
};

let handleReceivedTransaction = function (transaction) {
    addToTransactionPool(transaction, getUnspentTxOuts());
};


export {
    Block, updateBlocks, getBlockchain, getUnspentTxOuts, getLatestBlock, generateRawNextBlock,
    getMyUnspentTransactionOutputs, generateNextBlock, generatenextBlockWithTransaction, getAccountBalance,
    sendTransaction, isValidBlockStructure, addBlockToChain, replaceChain, handleReceivedTransaction, sendTransactionFromUser,
    getAccountBalanceOfUser, userGenerateNextBlock, userAutoMineBlock
}
