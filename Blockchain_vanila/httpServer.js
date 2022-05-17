
import express from 'express'; 
import cors from 'cors'
import { getBlocks, getDifficultyLog, getLatestBlock } from './block.js';
import { connectToPeer, getPeers, broadcasting, mineBlock, autoMineBlock } from './p2pServer.js';
import { getPublicKeyFromWallet } from './wallet.js';

import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';
import {pool} from './db.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let connectedIP;
// const updateDB = (latestBlock) => {
//     if (latestBlock)
// }

// 초기화 함수
const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(express.static(__dirname + "/public"))
    app.set('view engine', 'html');
    nunjucks.configure('views', {
        express: app,
    })
    app.use(cors({
        origin:true,
        credentials:true,
    }))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    app.get('/', (req, res) => {
        console.log(req.body)
        res.render('p2pclient')
    })

    app.get('/blocks', async (req, res) => {
        // const [result] = await pool.query('SELECT * FROM blocks')
        // console.log(result)
        res.send(getBlocks());
        // res.send(getBlocks());
    })
    app.get('/getblocksfromdb', async (req, res) => {
        const [result] = await pool.query('SELECT * FROM blocks')
        console.log(result)
        res.send(result);
        // res.send(getBlocks());
    })

    // mineBlock 으로 대체됨
    // app.post('/blocks', (req, res) => {
    //     res.send(createBlock(req.body.data));
    // })


    app.post('/mineBlock', async (req, res) => {
        while (true) {
            if (mineBlock(req.body.data)) {
                break
            } else {
                console.log('failed mining, ')
            }
            // mineBlock(req.body.data)
        }
        
        // const newBlock = getLatestBlock()
        // const result = await pool.query(`INSERT INTO blocks VALUES (${newBlock.index},'${newBlock.data}',${newBlock.timestamp},'${newBlock.hash}','${newBlock.previousHash}',${newBlock.difficulty},${newBlock.nonce})`); //(`index`, data, timestamp, hash, previousHash, difficulty, nonce)
        // console.log('inserted to db : ', result)
        res.redirect('/blocks');
    })

    app.post('/autoMineBlock', (req, res) => {
        console.log(req.body)
        autoMineBlock(req.body.data, req.body.count)
        res.redirect('/blocks')
    })

    app.get('/log', (req, res) => {
        res.send(getDifficultyLog());
    })

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

    app.get('/peers', (req, res) => {
        res.send(getPeers());
    })

    app.get('/address', (req, res) => {
        const address = getPublicKeyFromWallet();
        res.send({ 'address': address });
    })
    app.post('/sendMessage', (req, res) => {

        let data = {

            "message": req.body.msg,
            "type": parseInt(req.body.type)
        }
        console.log(data)

        broadcasting(data);
    })

    app.post('/sendTransaction', (req, res) => {
        const address = req.body.address;
        const amount = req.body.amount;

        res.send(sendTransaction(address, amount));
    })

    app.listen(myHttpPort, () => {
        console.log('listening httpServer Port : ', myHttpPort);
    });
};
export { initHttpServer }