import _ from "lodash";
import { validateTransaction } from "./transaction.js"

let __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};


let transactionPool = [];
const getTransactionPool = () => {
    return _.cloneDeep(transactionPool);
}; 

const addToTransactionPool = (tx, unspentTxOuts) => {
    // console.log(tx)
    // console.log(unspentTxOuts)
    if (!validateTransaction(tx, unspentTxOuts)) {
        throw Error('Trying to add invalid tx to pool');
    }
    if (!isValidTxForPool(tx, transactionPool)) {
        throw Error('Trying to add invalid tx to pool');
    }
    console.log('adding to txPool: %s', JSON.stringify(tx));
    transactionPool.push(tx);
};

const hasTxIn = (txIn, unspentTxOuts) => {
    let foundTxIn = unspentTxOuts.find(function (uTxO) {
        return uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex;
    });
    return foundTxIn !== undefined;
};
const updateTransactionPool = (unspentTxOuts) => {
    let invalidTxs = [];
    for (let _i = 0, transactionPool_1 = transactionPool; _i < transactionPool_1.length; _i++) {
        let tx = transactionPool_1[_i];
        for (let _a = 0, _b = tx.txIns; _a < _b.length; _a++) {
            let txIn = _b[_a];
            if (!hasTxIn(txIn, unspentTxOuts)) {
                invalidTxs.push(tx);
                break;
            }
        }
    }
    if (invalidTxs.length > 0) {
        console.log('removing the following transactions from txPool: %s', JSON.stringify(invalidTxs));
        transactionPool = _.without.apply(_, __spreadArray([transactionPool], invalidTxs, false));
    }
};

const getTxPoolIns = (aTransactionPool) => {
    return _(aTransactionPool)
        .map(function (tx) { return tx.txIns; })
        .flatten()
        .value();
};
const isValidTxForPool = (tx, aTtransactionPool) => {
    let txPoolIns = getTxPoolIns(aTtransactionPool);
    let containsTxIn = function (txIns, txIn) {
        return _.find(txPoolIns, (function (txPoolIn) {
            return txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId;
        }));
    };
    for (let _i = 0, _a = tx.txIns; _i < _a.length; _i++) {
        let txIn = _a[_i];
        if (containsTxIn(txPoolIns, txIn)) {
            console.log('txIn already found in the txPool');
            return false;
        }
    }
    return true;
};

export { getTransactionPool, addToTransactionPool, updateTransactionPool }