import CryptoJS from "crypto-js";
import ecdsa from "elliptic"
import _ from "lodash"

let ec = new ecdsa.ec('secp256k1');
let COINBASE_AMOUNT = 50;
class UnspentTxOut {
    constructor(txOutId, txOutIndex, address, amount) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }

};


class TxIn {
    constructor() {

    }
};

class TxOut {
    constructor(address, amount) {
        this.address = address;
        this.amount = amount;
    }
};

class Transaction {
    constructor() {

    }
};

let getTransactionId = function (transaction) {
    let txInContent = transaction.txIns
        .map(function (txIn) { return txIn.txOutId + txIn.txOutIndex; })
        .reduce(function (a, b) { return a + b; }, '');
    let txOutContent = transaction.txOuts
        .map(function (txOut) { return txOut.address + txOut.amount; })
        .reduce(function (a, b) { return a + b; }, '');
    return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

let validateTransaction = function (transaction, aUnspentTxOuts) {
    if (!isValidTransactionStructure(transaction)) {
        return false;
    }
    if (getTransactionId(transaction) !== transaction.id) {
        console.log('invalid tx id: ' + transaction.id);
        return false;
    }
    let hasValidTxIns = transaction.txIns
        .map(function (txIn) { return validateTxIn(txIn, transaction, aUnspentTxOuts); })
        .reduce(function (a, b) { return a && b; }, true);
    if (!hasValidTxIns) {
        console.log('some of the txIns are invalid in tx: ' + transaction.id);
        return false;
    }
    let totalTxInValues = transaction.txIns
        .map(function (txIn) { return getTxInAmount(txIn, aUnspentTxOuts); })
        .reduce(function (a, b) { return (a + b); }, 0);
    let totalTxOutValues = transaction.txOuts
        .map(function (txOut) { return txOut.amount; })
        .reduce(function (a, b) { return (a + b); }, 0);
    if (totalTxOutValues !== totalTxInValues) {
        console.log('totalTxOutValues !== totalTxInValues in tx: ' + transaction.id);
        return false;
    }
    return true;
};

let validateBlockTransactions = function (aTransactions, aUnspentTxOuts, blockIndex) {
    let coinbaseTx = aTransactions[0];
    if (!validateCoinbaseTx(coinbaseTx, blockIndex)) {
        console.log('invalid coinbase transaction: ' + JSON.stringify(coinbaseTx));
        return false;
    }
    // check for duplicate txIns. Each txIn can be included only once
    let txIns = _(aTransactions)
        .map(function (tx) { return tx.txIns; })
        .flatten()
        .value();
    if (hasDuplicates(txIns)) {
        return false;
    }
    // all but coinbase transactions
    let normalTransactions = aTransactions.slice(1);
    return normalTransactions.map(function (tx) { return validateTransaction(tx, aUnspentTxOuts); })
        .reduce(function (a, b) { return (a && b); }, true);
};
let hasDuplicates = function (txIns) {
    let groups = _.countBy(txIns, function (txIn) { return txIn.txOutId + txIn.txOutIndex; });
    return _(groups)
        .map(function (value, key) {
            if (value > 1) {
                console.log('duplicate txIn: ' + key);
                return true;
            }
            else {
                return false;
            }
        })
        .includes(true);
};

let validateCoinbaseTx = function (transaction, blockIndex) {
    if (transaction == null) {
        console.log('the first transaction in the block must be coinbase transaction');
        return false;
    }
    if (getTransactionId(transaction) !== transaction.id) {
        console.log('invalid coinbase tx id: ' + getTransactionId(transaction));
        console.log('invalid coinbase tx id: ' + transaction.id);
        return false;
    }
    if (transaction.txIns.length !== 1) {
        console.log('one txIn must be specified in the coinbase transaction');
        return;
    }
    if (transaction.txIns[0].txOutIndex !== blockIndex) {
        console.log('the txIn signature in coinbase tx must be the block height');
        return false;
    }
    if (transaction.txOuts.length !== 1) {
        console.log('invalid number of txOuts in coinbase transaction');
        return false;
    }
    if (transaction.txOuts[0].amount !== COINBASE_AMOUNT) {
        console.log('invalid coinbase amount in coinbase transaction');
        return false;
    }
    return true;
};
let validateTxIn = function (txIn, transaction, aUnspentTxOuts) {
    let referencedUTxOut = aUnspentTxOuts.find(function (uTxO) { return uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex; });
    if (referencedUTxOut == null) {
        console.log('referenced txOut not found: ' + JSON.stringify(txIn));
        return false;
    }
    let address = referencedUTxOut.address;
    let key = ec.keyFromPublic(address, 'hex');
    let validSignature = key.verify(transaction.id, txIn.signature);
    if (!validSignature) {
        console.log('invalid txIn signature: %s txId: %s address: %s', txIn.signature, transaction.id, referencedUTxOut.address);
        return false;
    }
    return true;
};
let getTxInAmount = function (txIn, aUnspentTxOuts) {
    return findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts).amount;
};
let findUnspentTxOut = function (transactionId, index, aUnspentTxOuts) {
    return aUnspentTxOuts.find(function (uTxO) { return uTxO.txOutId === transactionId && uTxO.txOutIndex === index; });
};
let getCoinbaseTransaction = function (address, blockIndex) {
    let t = new Transaction();
    let txIn = new TxIn();
    txIn.signature = '';
    txIn.txOutId = '';
    txIn.txOutIndex = blockIndex;
    t.txIns = [txIn];
    t.txOuts = [new TxOut(address, COINBASE_AMOUNT)];
    t.id = getTransactionId(t);
    return t;
};

let signTxIn = function (transaction, txInIndex, privateKey, aUnspentTxOuts) {
    let txIn = transaction.txIns[txInIndex];
    let dataToSign = transaction.id;
    let referencedUnspentTxOut = findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);
    if (referencedUnspentTxOut == null) {
        console.log('could not find referenced txOut');
        throw Error();
    }
    let referencedAddress = referencedUnspentTxOut.address;
    if (getPublicKey(privateKey) !== referencedAddress) {
        console.log(getPublicKey(privateKey))
        console.log(referencedAddress)
        console.log('trying to sign an input with private' +
            ' key that does not match the address that is referenced in txIn');
        throw Error();
    }
    let key = ec.keyFromPrivate(privateKey, 'hex');
    let signature = toHexString(key.sign(dataToSign).toDER());
    return signature;
};

let updateUnspentTxOuts = function (aTransactions, aUnspentTxOuts) {
    let newUnspentTxOuts = aTransactions
        .map(function (t) {
            return t.txOuts.map(function (txOut, index) { return new UnspentTxOut(t.id, index, txOut.address, txOut.amount); });
        })
        .reduce(function (a, b) { return a.concat(b); }, []);
    let consumedTxOuts = aTransactions
        .map(function (t) { return t.txIns; })
        .reduce(function (a, b) { return a.concat(b); }, [])
        .map(function (txIn) { return new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0); });
    let resultingUnspentTxOuts = aUnspentTxOuts
        .filter((function (uTxO) { return !findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts); }))
        .concat(newUnspentTxOuts);
    return resultingUnspentTxOuts;
};
let processTransactions = function (aTransactions, aUnspentTxOuts, blockIndex) {
    if (!validateBlockTransactions(aTransactions, aUnspentTxOuts, blockIndex)) {
        console.log('invalid block transactions');
        return null;
    }
    return updateUnspentTxOuts(aTransactions, aUnspentTxOuts);
};

let toHexString = function (byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
};
let getPublicKey = function (aPrivateKey) {
    return ec.keyFromPrivate(aPrivateKey, 'hex').getPublic().encode('hex');
};

let isValidTxInStructure = function (txIn) {
    if (txIn == null) {
        console.log('txIn is null');
        return false;
    }
    else if (typeof txIn.signature !== 'string') {
        console.log('invalid signature type in txIn');
        return false;
    }
    else if (typeof txIn.txOutId !== 'string') {
        console.log('invalid txOutId type in txIn');
        return false;
    }
    else if (typeof txIn.txOutIndex !== 'number') {
        console.log('invalid txOutIndex type in txIn');
        return false;
    }
    else {
        return true;
    }
};
let isValidTxOutStructure = function (txOut) {
    if (txOut == null) {
        console.log('txOut is null');
        return false;
    }
    else if (typeof txOut.address !== 'string') {
        console.log('invalid address type in txOut');
        return false;
    }
    else if (!isValidAddress(txOut.address)) {
        console.log('invalid TxOut address');
        return false;
    }
    else if (typeof txOut.amount !== 'number') {
        console.log('invalid amount type in txOut');
        return false;
    }
    else {
        return true;
    }
};
let isValidTransactionStructure = function (transaction) {
    if (typeof transaction.id !== 'string') {
        console.log('transactionId missing');
        return false;
    }
    if (!(transaction.txIns instanceof Array)) {
        console.log('invalid txIns type in transaction');
        return false;
    }
    if (!transaction.txIns
        .map(isValidTxInStructure)
        .reduce(function (a, b) { return (a && b); }, true)) {
        return false;
    }
    if (!(transaction.txOuts instanceof Array)) {
        console.log('invalid txIns type in transaction');
        return false;
    }
    if (!transaction.txOuts
        .map(isValidTxOutStructure)
        .reduce(function (a, b) { return (a && b); }, true)) {
        return false;
    }
    return true;
};
// valid address is a valid ecdsa public key in the 04 + X-coordinate + Y-coordinate format
let isValidAddress = function (address) {
    if (address.length !== 130) {
        console.log(address);
        console.log('invalid public key length');
        return false;
    }
    else if (address.match('^[a-fA-F0-9]+$') === null) {
        console.log('public key must contain only hex characters');
        return false;
    }
    else if (!address.startsWith('04')) {
        console.log('public key must start with 04');
        return false;
    }
    return true;
};

export {
    UnspentTxOut, TxIn, TxOut, Transaction, getTransactionId, validateTransaction, hasDuplicates,
    getCoinbaseTransaction, signTxIn, processTransactions, getPublicKey, isValidAddress,
}