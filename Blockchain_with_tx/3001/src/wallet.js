import elliptic from "elliptic";
import fs from "fs";
import _ from "lodash";
import { TxOut, getPublicKey, TxIn, Transaction, getTransactionId, signTxIn } from "./transaction.js"

const __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};




let EC = new elliptic.ec('secp256k1');
let privateKeyLocation = process.env.PRIVATE_KEY || '../node/wallet/private_key';
let getPrivateFromWallet = function () {
    let buffer = fs.readFileSync(privateKeyLocation, 'utf8');
    return buffer.toString();
};

let getPublicFromWallet = function () {
    let privateKey = getPrivateFromWallet();
    let key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
};

let generatePrivateKey = function () {
    let keyPair = EC.genKeyPair();
    let privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};

let initWallet = function () {
    // let's not override existing private keys
    if (fs.existsSync(privateKeyLocation)) {
        return;
    }
    let newPrivateKey = generatePrivateKey();
    fs.writeFileSync(privateKeyLocation, newPrivateKey);
    console.log('new wallet with private key created to : %s', privateKeyLocation);
};

let deleteWallet = function () {
    if (fs.existsSync(privateKeyLocation)) {
        fs.unlinkSync(privateKeyLocation);
    }
};

let getBalance = function (address, unspentTxOuts) {
    return _(findUnspentTxOuts(address, unspentTxOuts))
        .map(function (uTxO) { return uTxO.amount; })
        .sum();
};

let findUnspentTxOuts = function (ownerAddress, unspentTxOuts) {
    return _.filter(unspentTxOuts, function (uTxO) { return uTxO.address === ownerAddress; });
};

let findTxOutsForAmount = function (amount, myUnspentTxOuts) {
    // console.log("myUnspentTxOuts", myUnspentTxOuts)
    let currentAmount = 0;
    let includedUnspentTxOuts = [];
    for (let _i = 0, myUnspentTxOuts_1 = myUnspentTxOuts; _i < myUnspentTxOuts_1.length; _i++) {
        let myUnspentTxOut = myUnspentTxOuts_1[_i];
        includedUnspentTxOuts.push(myUnspentTxOut);
        
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            // console.log("findTxOutsForAmount currentAmount: ", currentAmount)
            // console.log("findTxOutsForAmount amount: ", amount)
            let leftOverAmount = currentAmount - amount;
            // console.log("findTxOutsForAmount leftOverAmount: ", leftOverAmount)
            return { includedUnspentTxOuts: includedUnspentTxOuts, leftOverAmount: leftOverAmount };
        }
    }
    let eMsg = 'Cannot create transaction from the available unspent transaction outputs.' +
        ' Required amount:' + amount + '. Available unspentTxOuts:' + JSON.stringify(myUnspentTxOuts);
    throw Error(eMsg);
};
let createTxOuts = function (receiverAddress, myAddress, amount, leftOverAmount) {
    let txOut1 = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    }
    else {
        let leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};
let filterTxPoolTxs = function (unspentTxOuts, transactionPool) {
    let txIns = _(transactionPool)
        .map(function (tx) { return tx.txIns; })
        .flatten()
        .value();
    let removable = [];
    let _loop_1 = function (unspentTxOut) {
        let txIn = _.find(txIns, function (aTxIn) {
            return aTxIn.txOutIndex === unspentTxOut.txOutIndex && aTxIn.txOutId === unspentTxOut.txOutId;
        });
        if (txIn === undefined) {
        }
        else {
            removable.push(unspentTxOut);
        }
    };
    for (let _i = 0, unspentTxOuts_1 = unspentTxOuts; _i < unspentTxOuts_1.length; _i++) {
        let unspentTxOut = unspentTxOuts_1[_i];
        _loop_1(unspentTxOut);
    }
    return _.without.apply(_, __spreadArray([unspentTxOuts], removable, false));
};
let createTransaction = function (receiverAddress, amount, privateKey, unspentTxOuts, txPool) {
    // console.log('txPool: %s', JSON.stringify(txPool));
    let myAddress = getPublicKey(privateKey);
    let myUnspentTxOutsA = unspentTxOuts.filter(function (uTxO) { return uTxO.address === myAddress; });
    
    let myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);
    // filter from unspentOutputs such inputs that are referenced in pool
    let _a = findTxOutsForAmount(amount, myUnspentTxOuts), includedUnspentTxOuts = _a.includedUnspentTxOuts, leftOverAmount = _a.leftOverAmount;
    let toUnsignedTxIn = function (unspentTxOut) {
        let txIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };
    let unsignedTxIns = includedUnspentTxOuts.map(toUnsignedTxIn);
    let tx = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);
    tx.txIns = tx.txIns.map(function (txIn, index) {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });
    return tx;
};
let createTransactionFromUser = function (receiverAddress, amount, senderAddress, senderPrivateKey, unspentTxOuts, txPool) {
    // console.log('txPool: %s', JSON.stringify(txPool));
    // console.log("unspentTxOuts : ", unspentTxOuts)
    let myAddress = senderAddress;
    let myUnspentTxOutsA = unspentTxOuts.filter(function (uTxO) { return uTxO.address === myAddress; });
    // console.log(myUnspentTxOutsA)
    let myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);
    // console.log(myUnspentTxOuts)
    // filter from unspentOutputs such inputs that are referenced in pool
    let _a = findTxOutsForAmount(amount, myUnspentTxOuts), includedUnspentTxOuts = _a.includedUnspentTxOuts, leftOverAmount = _a.leftOverAmount;
    let toUnsignedTxIn = function (unspentTxOut) {
        let txIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };
    let unsignedTxIns = includedUnspentTxOuts.map(toUnsignedTxIn);
    let tx = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);
    tx.txIns = tx.txIns.map(function (txIn, index) {
        txIn.signature = signTxIn(tx, index, senderPrivateKey, unspentTxOuts);
        return txIn;
    });
    return tx;
};




export {
    getPrivateFromWallet, getPublicFromWallet, generatePrivateKey, initWallet,
    deleteWallet, getBalance, findUnspentTxOuts, createTransaction, createTransactionFromUser
}