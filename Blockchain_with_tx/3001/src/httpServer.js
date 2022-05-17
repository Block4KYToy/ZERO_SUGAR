import express from 'express';
import cors from 'cors';
import {
    getBlockchain, getUnspentTxOuts, generateNextBlock, generatenextBlockWithTransaction, getAccountBalance,
    getAccountBalanceOfUser, sendTransaction, sendTransactionFromUser, userGenerateNextBlock, userAutoMineBlock
} from './blockchain.js';
import { getTransactionPool } from "./transactionPool.js"
import { getSockets, connectToPeer } from './p2p.js';
import { getPublicFromWallet } from './wallet.js';
import path from 'path';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let connectedIP;

let initHttpServer = function (myHttpPort) {
    let app = express();
    app.use(express.json());
    app.use(cors())
    app.use(function (err, req, res, next) {
        if (err) {
            res.status(400).send(err.message);
        }
    });
    app.get('/', (req, res) => {
        console.log(req.body)
        res.render('p2pclient')
    })
    app.get('/blocks', function (req, res) {
        res.send(getBlockchain());
    });
    app.get('/block/:hash', function (req, res) {
        let block = _.find(getBlockchain(), { 'hash': req.params.hash });
        res.send(block);
    });
    app.get('/transaction/:id', function (req, res) {
        let tx = _(getBlockchain())
            .map(function (blocks) { return blocks.data; })
            .flatten()
            .find({ 'id': req.params.id });
        res.send(tx);
    });
    app.get('/address/:address', function (req, res) {
        let unspentTxOuts = _.filter(getUnspentTxOuts(), function (uTxO) { return uTxO.address === req.params.address; });
        res.send({ 'unspentTxOuts': unspentTxOuts });
    });
    app.get('/unspentTransactionOutputs', function (req, res) {
        res.send(getUnspentTxOuts());
    });
    app.get('/myUnspentTransactionOutputs', function (req, res) {
        res.send(blockchain_1.getMyUnspentTransactionOutputs());
    });
    app.post('/mineRawBlock', function (req, res) {
        if (req.body.data == null) {
            res.send('data parameter is missing');
            return;
        }
        let newBlock = blockchain_1.generateRawNextBlock(req.body.data);
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });
    app.post('/mineBlock', function (req, res) {
        let newBlock = generateNextBlock();
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });
    app.post('/userMineBlock', function (req, res) {
        console.log('post')
        let myAddress = req.body.address
        let newBlock = userGenerateNextBlock(myAddress);
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });
    app.get('/balance', function (req, res) {
        let balance = getAccountBalance();
        res.send({ 'balance': balance });
    });
    app.post('/balanceUser', function (req, res) {
        // console.log('balanceUser')
        let balance = getAccountBalanceOfUser(req.body.address);
        res.send({ 'address': req.body.address, 'balance': balance });
    });
    app.get('/address', function (req, res) {
        let address = getPublicFromWallet();
        res.send({ 'address': address });
    });
    app.post('/mineTransaction', function (req, res) {
        let address = req.body.address;
        let amount = req.body.amount;
        try {
            let resp = generatenextBlockWithTransaction(address, amount);
            res.send(resp);
        }
        catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    });
    app.post('/sendTransaction', function (req, res) {
        // try {
            let fromAddress = req.body.fromAddress
            let senderPrivateKey = req.body.senderPrivateKey
            let toAddress = req.body.toAddress;
            let amount = req.body.amount;
            
            // console.log(amount)
            if (fromAddress === undefined || toAddress === undefined || amount === undefined) {
                throw Error('invalid address or amount');
            }
            let resp = sendTransactionFromUser(fromAddress, senderPrivateKey, toAddress, Number(amount));
            res.send(resp);
        // }
        // catch (e) {
        //     console.log(e.message);
        //     res.status(400).send(e.message);
        // }
    });
    app.get('/transactionPool', function (req, res) {
        res.send(getTransactionPool());
    });
    app.get('/peers', function (req, res) {
        res.send(getSockets().map(function (s) { return s._socket.remoteAddress + ':' + s._socket.remotePort; }));
    });

    app.post('/addPeer', (req, res) => {

        const { ipAddress, port } = req.body
        connectedIP = ipAddress;

        let fullAddress = "ws://" + ipAddress + ":" + port;
        console.log(fullAddress)
        console.log("connectToPeer")
        connectToPeer(fullAddress)
        // res.write("<script>alert('success : ', fullAddress)</script>");
        // alert('connectToPeer : ', fullAddress)
        res.redirect('/peers')
    })
    app.post('/stop', function (req, res) {
        res.send({ 'msg': 'stopping server' });
        process.exit();
    });
    app.post('/autoMineBlock', (req, res) => {
        // console.log(req.body)
        userAutoMineBlock(req.body.address, req.body.count)
        res.send('mining complete')
    })
    app.listen(myHttpPort, function () {
        console.log('Listening http on port: ' + myHttpPort);
    });
    app.get('/log', (req, res) => {
        res.send(getDifficultyLog());
    })
};

export { initHttpServer }