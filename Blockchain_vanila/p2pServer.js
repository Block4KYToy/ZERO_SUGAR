// p2p 피어 투 피어 (노드 대 노드, 개인 대 개인) 서버가 서로서로 필요한 정보를 보유
// 다른 노드와 통신을 위한 서버
// web socket 사용

// import random from 'random';
import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import { getBlocks, getLatestBlock, addBlock, createBlock, replaceBlockchain } from './block.js';
import { getTransactionPool, sendTransaction, addToTransactionPool } from './transaction.js';

const MessageType = {
    // RESPONSE_MESSAGE : 0,
    // SENT_MESSAGE : 1,

    // 최신 블록 요청
    QUERY_LATEST: 0,
    // 모든 블록 요청
    QUERY_ALL: 1,
    // 블록 전달 // response 반응도 latest와 all 분해 필요
    RESPONSE_BLOCKCHAIN: 2,
    QUERY_TRANSACTION_POOL: 3,
    RESPONSE_TRANSACTION_POOL: 4,
}

const sockets = [];

const getPeers = () => {
    console.log("socket.length : ", sockets.length)
    return sockets;
}

const initP2PServer = (p2pPort) => {
    const server = new WebSocketServer({ port: p2pPort });

    server.on('connection', (ws, request) => {
        console.log("req " + request.headers);
        initConnection(ws);
    })

    console.log('listening P2PServer Port : ', p2pPort);
}

const initConnection = (ws) => {
    sockets.push(ws);
    initMessgaeHandler(ws);

    write(ws, queryAllMessage());
}

const connectToPeer = (newPeer) => {
    const ws = new WebSocket(newPeer);
    ws.on('open', () => {
        initConnection(ws);
        console.log('Connect peer : ', newPeer);
        return true;
    })
    ws.on('error', () => {
        console.log('Fail to Connection peer : ', ws.remoteAddres);
        return false;
    })
}

const initMessgaeHandler = (ws) => {
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                // 최신 블록을 요청 받았을 때
                // ws.send(JSON.stringify(responseLatestMessage()))
                break;
            case MessageType.QUERY_ALL:
                // 모든 블록 정보를 요청 받았을 때
                // ws.send(JSON.stringify(responseAllMessage()));
                write(ws, responseAllMessage());
                break;
            case MessageType.RESPONSE_LATEST:
                // 요청한 블록들 받을때
                // console.log(ws._socket.remoteAddress, ' : ', message.data);
                // handleBlockchainResponse(message.data);
                // replaceBlockchain(message.data);
                // write(ws, responseLatestMessage());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                // 요청한 블록들 받을때
                // console.log(ws._socket.remoteAddress, ' : ', message.data);
                handleBlockchainResponse(message.data);
                // replaceBlockchain(message.data);
                break;
            case MessageType.QUERY_TRANSACTION_POOL:
                write(ws, responseTransactionPoolMessage());
                break;
            case MessageType.RESPONSE_TRANSACTION_POOL:
                handleTransactionPoolResponse(message.data);
                break;
        }
    })
}

const handleBlockchainResponse = (receiveBlockchain) => {
    // console.log(receiveBlockchain)
    receiveBlockchain = JSON.parse(receiveBlockchain);
    // 받아온 블록의 마지막 인덱스가 내 마지막 블록의 인데스보다 크다.
    const latestNewBlock = receiveBlockchain[receiveBlockchain.length - 1];
    const latestMyBlock = getLatestBlock();
    console.log("상대꺼 ", latestNewBlock);
    console.log("내꺼 ", latestMyBlock);

    if (latestNewBlock.index > latestMyBlock.index) {
        // 받아온 마지막 블록의 previousHash와 내 마지막 블록의 hash를 확인한다
        if (latestNewBlock.previousHash === latestMyBlock.hash) {
            if (addBlock(latestNewBlock, latestMyBlock)) {
                // 제한된 플러딩 flooding 
                // 플러딩은 정적 알고리즘으로, 어떤 노드에서 온 하나의 패킷을 라우터에 접속되어 있는 다른 모든 노드로 전달하는 것
                console.log("누군가 채굴했나보네?");
                broadcasting(responseLatestMessage());
            }
        }
        // 받아온 블록의 전체 크기가 1인 경우 -> 재요청
        else if (receiveBlockchain.length === 1) {
            // 최신 블록은 맞는거 같은데 내 index랑 차이가 많이 나서 전체 원장을 요청
            console.log("전체 원장 좀 줘볼래?");
            broadcasting(queryAllMessage());
        }

        // 그 외의 경우
        // 받은 블록체인보다 현재 블록체인이 더 길면 -> 안 바꿈
        // 같으면 -> 바꾸거나 안 바꿈 (랜덤성(의외성)에 의의를 둔다, 상태 케어 용)
        // 받은 블록체인이 현재 블록체인보다 더 길면 -> 바꾼다
        replaceBlockchain(receiveBlockchain);
    } else {
        console.log("내 원장 최신화 끝!!!")
    }
}

const handleTransactionPoolResponse = (receiveTransactionPool) => {
    console.log("p2p135 : receiveTransactionPool : ");
    console.log(receiveTransactionPool);

    receiveTransactionPool.forEach((tx) => {
        //중복검사
        addToTransactionPool(tx)
        //트랙잭션풀에추가

        //다시전파

    })

}

const queryLatestMessage = () => {
    // 다른 노드에 최신 블록 요청 메시지 보내기
    return ({
        "type": MessageType.QUERY_LATEST,
        "data": null
    })
}

const queryAllMessage = () => {
    // 다른 노드에 모든 블록 요청 메시지 보내기
    return ({
        "type": MessageType.QUERY_ALL,
        "data": null
    })
}

const responseLatestMessage = () => {
    // 최신 블록 요청에 대한 응답
    return ({
        "type": MessageType.RESPONSE_LATEST,
        "data": JSON.stringify([getLatestBlock()])
        // getBlocks 날릴땐 배열 형태라 형태 통일화를 위해서 최신 블록도 배열 형태로 보냄
    })
}

const responseAllMessage = () => {
    // 모든 블록 요청에 대한 응답
    return ({
        "type": MessageType.RESPONSE_BLOCKCHAIN,
        "data": JSON.stringify(getBlocks())
        // 문자열로 보내는게 패킷(packet) 단위로 좋다 (일반적인 방법, 스트링파이가 일반적인 방법)
    })
}
const responseTransactionPoolMessage = () => {
    return ({
        "type": MessageType.RESPONSE_TRANSACTION_POOL,
        "data": JSON.stringify(getTransactionPool())
    })
}

const write = (ws, message) => {
    // console.log(message);
    ws.send(JSON.stringify(message));
}

// send 원장
const broadcasting = (message) => {
    sockets.forEach((socket) => {
        write(socket, message);
    })
}

// 내가 새로운 블록을 채굴했을 때 연결된 노드들에게 전파
const mineBlock = async (blockData) => {
    const newBlock =  createBlock(blockData);
    if (await addBlock(newBlock, getLatestBlock())) {
        broadcasting(responseAllMessage());
    }
}

let autoMining;

const autoMineBlock = async (blockData, count) => {
    autoMining = 0
    while (autoMining < count) {
        await mineBlock(blockData);
        autoMining++;
    }
}

const endMining = () => {
    return autoMining = false;
}

export { initP2PServer, connectToPeer, getPeers, mineBlock, broadcasting, autoMineBlock, endMining }