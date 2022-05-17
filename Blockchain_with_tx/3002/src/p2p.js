import WebSocket from "ws";
import { handleReceivedTransaction, getBlockchain, getLatestBlock, isValidBlockStructure, addBlockToChain, replaceChain } from "./blockchain.js"
import { getTransactionPool } from "./transactionPool.js"

let sockets = [];
let MessageType;
(function (MessageType) {
    MessageType[MessageType["QUERY_LATEST"] = 0] = "QUERY_LATEST";
    MessageType[MessageType["QUERY_ALL"] = 1] = "QUERY_ALL";
    MessageType[MessageType["RESPONSE_BLOCKCHAIN"] = 2] = "RESPONSE_BLOCKCHAIN";
    MessageType[MessageType["QUERY_TRANSACTION_POOL"] = 3] = "QUERY_TRANSACTION_POOL";
    MessageType[MessageType["RESPONSE_TRANSACTION_POOL"] = 4] = "RESPONSE_TRANSACTION_POOL";
})(MessageType || (MessageType = {}));
let Message = /** @class */ (function () {
    function Message() {
    }
    return Message;
}());
let initP2PServer = function (p2pPort) {
    let server = new WebSocket.Server({ port: p2pPort });
    server.on('connection', function (ws) {
        initConnection(ws);
    });
    console.log('listening websocket p2p port on: ' + p2pPort);
};

let getSockets = function () { return sockets; };

let initConnection = function (ws) {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
    // query transactions pool only some time after chain query
    setTimeout(function () {
        broadcast(queryTransactionPoolMsg());
    }, 500);
};
let JSONToObject = function (data) {
    try {
        return JSON.parse(data);
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
let initMessageHandler = function (ws) {
    ws.on('message', function (data) {
        try {
            let message = JSONToObject(data);
            if (message === null) {
                console.log('could not parse received JSON message: ' + data);
                return;
            }
            console.log('Received message: %s', JSON.stringify(message));
            switch (message.type) {
                case MessageType.QUERY_LATEST:
                    write(ws, responseLatestMsg());
                    break;
                case MessageType.QUERY_ALL:
                    write(ws, responseChainMsg());
                    break;
                case MessageType.RESPONSE_BLOCKCHAIN:
                    let receivedBlocks = JSONToObject(message.data);
                    if (receivedBlocks === null) {
                        console.log('invalid blocks received: %s', JSON.stringify(message.data));
                        break;
                    }
                    handleBlockchainResponse(receivedBlocks);
                    break;
                case MessageType.QUERY_TRANSACTION_POOL:
                    write(ws, responseTransactionPoolMsg());
                    break;
                case MessageType.RESPONSE_TRANSACTION_POOL:
                    let receivedTransactions = JSONToObject(message.data);
                    console.log("RESPONSE_TRANSACTION_POOL : ", receivedTransactions)
                    if (receivedTransactions === null) {
                        console.log('invalid transaction received: %s', JSON.stringify(message.data));
                        break;
                    }
                    receivedTransactions.forEach(function (transaction) {
                        try {
                            handleReceivedTransaction(transaction);
                            // if no error is thrown, transaction was indeed added to the pool
                            // let's broadcast transaction pool
                            broadCastTransactionPool();
                        }
                        catch (e) {
                            console.log(e.message);
                        }
                    });
                    break;
            }
        }
        catch (e) {
            console.log(e);
        }
    });
};
let write = function (ws, message) { return ws.send(JSON.stringify(message)); };
let broadcast = function (message) { return sockets.forEach(function (socket) { return write(socket, message); }); };
let queryChainLengthMsg = function () { return ({ 'type': MessageType.QUERY_LATEST, 'data': null }); };
let queryAllMsg = function () { return ({ 'type': MessageType.QUERY_ALL, 'data': null }); };
let responseChainMsg = function () {
    return ({
        'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(getBlockchain())
    });
};
let responseLatestMsg = function () {
    return ({
        'type': MessageType.RESPONSE_BLOCKCHAIN,

        'data': JSON.stringify([getLatestBlock()])
    });
};
let queryTransactionPoolMsg = function () {
    return ({
        'type': MessageType.QUERY_TRANSACTION_POOL,
        'data': null
    });
};
let responseTransactionPoolMsg = function () {
    return ({
        'type': MessageType.RESPONSE_TRANSACTION_POOL,
        'data': JSON.stringify(getTransactionPool())
    });
};
let initErrorHandler = function (ws) {
    let closeConnection = function (myWs) {
        console.log('connection failed to peer: ' + myWs.url);
        sockets.splice(sockets.indexOf(myWs), 1);
    };
    ws.on('close', function () { return closeConnection(ws); });
    ws.on('error', function () { return closeConnection(ws); });
};
let handleBlockchainResponse = function (receivedBlocks) {
    if (receivedBlocks.length === 0) {
        console.log('received block chain size of 0');
        return;
    }
    let latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    if (!isValidBlockStructure(latestBlockReceived)) {
        console.log('block structuture not valid');
        return;
    }
    let latestBlockHeld = getLatestBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('blockchain possibly behind. We got: '
            + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {

            if (addBlockToChain(latestBlockReceived)) {
                broadcast(responseLatestMsg());
            }
        }
        else if (receivedBlocks.length === 1) {
            console.log('We have to query the chain from our peer');
            broadcast(queryAllMsg());
        }
        else {
            console.log('Received blockchain is longer than current blockchain');

            replaceChain(receivedBlocks);
        }
    }
    else {
        console.log('received blockchain is not longer than received blockchain. Do nothing');
    }
};
let broadcastLatest = function () {
    broadcast(responseLatestMsg());
};

let connectToPeer = function (newPeer) {
    let ws = new WebSocket(newPeer);
    ws.on('open', function () {
        initConnection(ws);
    });
    ws.on('error', function () {
        console.log('connection failed');
    });
};

let broadCastTransactionPool = function () {
    broadcast(responseTransactionPoolMsg());
};

export { initP2PServer, getSockets, broadcastLatest, connectToPeer, broadCastTransactionPool }
