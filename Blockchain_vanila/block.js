import CryptoJS from 'crypto-js';
import random from 'random';
import { getCoinbaseTransaction, getTransactionPool, updateTransactionPool } from './transaction.js';
import { getPublicKeyFromWallet } from './wallet.js';
import { pool } from './db.js'
import { mineBlock } from './p2pServer.js';

let blocks;
const BLOCK_GENERATION_INTERVAL = 50000000;       // 블록 생성 주기 // 블록 생성 시간(second)
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10;  // 난이도 체크해서 변경 조절 주기 // 몇번째 블록이 생성되었나로 체크(generate block count)

class Block {
    constructor(index, data, timestamp, hash, previousHash, difficulty, nonce) {
        this.index = index;         // n번째 블록
        this.data = data;           // 블록 데이터
        this.timestamp = timestamp; // 생성 시간
        this.hash = hash;           // 이거만 계산하면 됨
        this.previousHash = previousHash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

const calculateHash = (index, data, timestamp, previousHash, difficulty, nonce) => {
    return CryptoJS.SHA256(`${index + data + timestamp + previousHash + difficulty + nonce}`).toString();
}

// 작업증명 재현 -> 증명과정 필요 -> 아무거나 형태가 비슷하다고 블록으로 인정될게 아니다
// 0 두 개로 시작하는 hash값을 만드는 매개변수(nonce)를 찾는다
// 16진수 64자라 
// 16진수 1자리 -> 2진수 4자리 256개의 0과 1로 표현 

const createGenesisBlock = () => {
    const genesisBlock = new Block(0, 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks', 0, 0, 0, 10, 0);

    // genesisBlock.hash = calculateHash(genesisBlock.index, genesisBlock.data, genesisBlock.timestamp, genesisBlock.previousHash, genesisBlock.difficulty, genesisBlock.nonce);
    genesisBlock.hash = calculateHash(genesisBlock.index, genesisBlock.data, genesisBlock.timestamp, genesisBlock.previousHash, genesisBlock.difficulty, genesisBlock.nonce);

    return genesisBlock;
}

const getBlocks = () => {
    return blocks;
}

const getLatestBlock = () => {
    return blocks[blocks.length - 1];
}

const createBlock = (blockData) => {
    const previousBlock = blocks[blocks.length - 1];
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime() / 1000;
    const nextDifficulty = getDifficulty();
    const nextNonce = findNonce(nextIndex, blockData, nextTimestamp, previousBlock.hash, nextDifficulty);

    const nextHash = calculateHash(nextIndex, blockData, nextTimestamp, previousBlock.hash, nextDifficulty, nextNonce);

    const newBlock = new Block(nextIndex, blockData, nextTimestamp, nextHash, previousBlock.hash, nextDifficulty, nextNonce);

    return newBlock;
}

const addBlock = async (newBlock, previousBlock , callback) => {
    if (isValidNewBlock(newBlock, previousBlock)) {
        blocks.push(newBlock);
        const blockdata = { blockdata: newBlock.data }
        console.log("block index: ", newBlock.index)
        console.log("current difficulty: ", getDifficulty())
        console.log('block added')
        try {
            const result = await pool.query(`INSERT INTO blocks
            VALUES (${newBlock.index},'${newBlock.data}',${newBlock.timestamp},
            '${newBlock.hash}','${newBlock.previousHash}',${newBlock.difficulty},${newBlock.nonce});`)
            await updateBlocks();

        } catch (e) {
            // contiune
            console.log(e)
            return false;
        }

        // console.log('query')

        // console.log(result)
        // const result = await pool.query(`INSERT INTO blocks(index, data, timestamp, hash, previousHash, difficulty, nonce)VALUES(${newBlock.index},${newBlock.data},${newBlock.timestamp}, '${newBlock.hash}','${newBlock.previousHash}',${newBlock.difficulty},${newBlock.nonce})`)

        // 사용되지 않은 txOuts 세팅
        // 트랜잭션 풀 업데이트
        // updateTransactionPool(unspentTxOuts);

        return true;

    }
    return false;
}

// 블록의 무결성 검증
/**
    블록의 인덱스가 이전 블록인덱스보다 1 크다.
    블록의 previousHash가 이전 블록의 hash이다.
    블록의 구조가 일치해야 한다.
 */
const isValidBlockStructure = (newBlock) => {
    if (typeof (newBlock.index) === 'number'
        && typeof (newBlock.data) === 'string'
        && typeof (newBlock.timestamp) === 'number'
        && typeof (newBlock.hash) === 'string'
        && typeof (newBlock.previousHash) === 'string'
        && typeof (newBlock.difficulty) === 'number'
        && typeof (newBlock.nonce) === 'number') {
        return true;
    }

    return false;
}
const isValidNewBlock = (newBlock, previousBlock) => {
    if (newBlock.index !== previousBlock.index + 1) {
        console.log(`new: ${newBlock.index}, prev +1: ${previousBlock.index + 1}`)
        console.log('invalid index');
        return false;

    } else if (newBlock.index <= previousBlock.index) {
        console.log(`new: ${newBlock.index}, prev: ${previousBlock.index}`)
        console.log('invalid index');
        return false;
    } else if (newBlock.previousHash !== previousBlock.hash) {
        console.log('invalid previousHash');
        return false;
    } else if (!isValidBlockStructure(newBlock)) {
        console.log('invalid block structure')
        return false;
    }

    return true;
}

// 문제 해결을 검사하는 함수
const hashMatchDifficulty = (hash, difficulty) => {
    const binaryHash = hexToBinary(hash);
    const requiredPrefix = '0'.repeat(difficulty); // prefix 접두어 0 몇개 체크용 -> 난이도(difficulty) 만큼 있니 비교용

    return binaryHash.startsWith(requiredPrefix); // startsWith 문자열이 어떤 문자열로 시작하는지 판별 매서드
}

const hexToBinary = (hex) => {
    const lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011',
        '4': '0100', '5': '0101', '6': '0110', '7': '0111',
        '8': '1000', '9': '1001', 'a': '1010', 'b': '1011',
        'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111',
    }

    // ex) 03cf 이 들어오면
    // binary = 0000 0011 1100 1111 
    let binary = '';
    for (let i = 0; i < hex.length; i++) {
        if (lookupTable[hex[i]]) {
            binary += lookupTable[hex[i]];
        } else {
            console.log('invalid hex : ', hex);
            return null;
        }
    }

    return binary;
}

const findNonce = (index, data, timestamp, previousHash, difficulty) => {
    let nonce = 0;

    while (true) {
        let hash = calculateHash(index, data, timestamp, previousHash, difficulty, nonce);

        if (hashMatchDifficulty(hash, difficulty)) {
            return nonce;
        } else {
            nonce++;
        }
    }
}
const replaceBlockchain = (receiveBlockchain) => {
    console.log("replaceBlockchain : -----------")
    // console.log(receiveBlockchain)
    // const newBlocks = JSON.parse(receiveBlockchain);
    // console.log(receiveBlockchain);
    if (isValidBlockchain(receiveBlockchain)) {
        //let blocks = getBlocks();



        if ((receiveBlockchain.length > blocks.length) || (receiveBlockchain.length == blocks.length && random.boolean())) {
            console.log('blockchain updated with received blockchain');
            blocks = receiveBlockchain;
            // 사용되지 않은 txOuts 세팅
            // 트랜잭션 풀 업데이트
            // updateTransactionPool(unspentTxOuts);
        }

    }
    else {
        console.log('받은 블록체인에 문제가 있음');
    }
}


const isValidBlockchain = (receiveBlockchain) => {
    // 같은 제네시스 블록인가
    if (JSON.stringify(receiveBlockchain[0]) !== JSON.stringify(getBlocks()[0])) {
        console.log('같은 제네시스 블록이 아님');
        console.log(receiveBlockchain[0]);
        console.log('-------------------------')
        console.log(getBlocks()[0]);
        return false;
    }

    // 체인 내의 모든 블록을 확인
    for (let i = 1; i < receiveBlockchain.length; i++) {
        if (isValidNewBlock(receiveBlockchain[i], receiveBlockchain[i - 1]) == false) {
            console.log(i - 1, '번 블록과 ', i, '번 블록이 문제');
            console.log(receiveBlockchain[i - 1]);
            console.log(receiveBlockchain[i]);
            return false;
        }
    }

    console.log('블록체인 확인 완료')
    return true;
}



const updateBlocks = async () => {
    const [result] = await pool.query(`SELECT * FROM blocks`) // [data,field] 
    // console.log(result);
    blocks = result;
    if (blocks.length === 0) {
        console.log('genesis block created')
        blocks = [createGenesisBlock()];
        // } else if (blocks.length > 0 && blocks[blocks.length-1].index !== result[result.length - 1].index) { //수정중
    }
    if (blocks.length > 0 && blocks.length !== result.length) {
        for (let i = 0; i < blocks.length; i++) {
            await pool.query(`INSERT INTO blocks
                                        VALUES (${blocks[i].index},'${blocks[i].data}',${blocks[i].timestamp},
                                        '${blocks[i].hash}','${blocks[i].previousHash}',${blocks[i].difficulty},${blocks[i].nonce});`)

        }
    }
    console.log('blocks db updated')
}

// const updateDBFromBlocks = async (blocks) => {
//     const [result] = await pool.query(`SELECT * FROM blocks`)

//     const [result] = blocks.map(async (block) => {
//         await pool.query(`INSERT INTO blocks
//                                         VALUES ('0','dasdasd','0','0','0','0','0');`)
//     })
// }

updateBlocks();



const difficultyChangeLog = [];

class Log {
    constructor(idx, expect, elapsed, how, result) {
        this.idx = idx;
        this.expect = expect;
        this.elapsed = elapsed;
        this.how = how;
        this.result = result;
    }
}

const getAdjustmentDifficulty = () => {
    // 현재 만들 블록의 시간(timestamp?), 마지막으로 난이도 조정된 시간
    const prevAdjustedBlock = blocks[blocks.length - 1 - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const latestBlock = getLatestBlock();
    const elapsedTime = latestBlock.timestamp - prevAdjustedBlock.timestamp;
    const expectedTime = DIFFICULTY_ADJUSTMENT_INTERVAL * BLOCK_GENERATION_INTERVAL;
    let idx = prevAdjustedBlock.index;

    if (elapsedTime > (expectedTime * 2)) {
        const newLog = new Log(idx, expectedTime, elapsedTime, "낮추기", latestBlock.difficulty - 1)
        // console.log(newLog)
        difficultyChangeLog.push(newLog)
        // 난이도를 낮춘다
        return latestBlock.difficulty - 1;
    } else if (elapsedTime < (expectedTime / 2)) {
        const newLog = new Log(idx, expectedTime, elapsedTime, "높이기", latestBlock.difficulty + 1)
        // console.log(newLog)
        difficultyChangeLog.push(newLog)
        // 난이도를 높인다
        return latestBlock.difficulty + 1;
    } else {
        const newLog = new Log(idx, expectedTime, elapsedTime, "고정", latestBlock.difficulty)
        // console.log(newLog)
        difficultyChangeLog.push(newLog)
        // 예상 범주, 난이도 고정
        return latestBlock.difficulty;
    }
}

const getDifficulty = () => {
    const latestBlock = getLatestBlock();

    // 난이도 조절 주기 확인 
    // 0번째, 10번째, 20번째.... (0번째 제외)
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
        return getAdjustmentDifficulty();
    }

    return latestBlock.difficulty;
}

const getDifficultyLog = () => {
    console.log('change log', difficultyChangeLog)
    return difficultyChangeLog;
}
const createNextBlock = () => {
    // 1.코인베이스 트랜잭션 생성
    const coinbaseTx = getCoinbaseTransaction(getPublicKeyFromWallet(), getLatestBlock().index + 1);

    // 2. 생성된 코인베이스 트랜잭션 뒤에 현재 보유 중인 트랜잭션 풀의 내용을 포함 (마이닝된 블록의 데이터)
    const blockData = [coinbaseTx].concat(getTransactionPool()); //수수료가 구현된다면 수수료에 의하여 일부만 처리가된다
    return createBlock(blockData);
}


export { getBlocks, createBlock, getLatestBlock, addBlock, replaceBlockchain, getDifficultyLog, updateBlocks }
