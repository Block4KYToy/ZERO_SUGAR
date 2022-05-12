
import express from 'express'; 
import cors from 'cors'
import { getBlocks, createBlock, getDifficultyLog } from './block.js';
import { connectToPeer, getPeers, broadcasting, mineBlock, autoMineBlock, endMining } from './p2pServer.js';
import { getPublicKeyFromWallet } from './wallet.js';
import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let connectedIP;

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

    app.get('/blocks', (req, res) => {
        res.send(getBlocks());
    })

    // mineBlock 으로 대체됨
    // app.post('/blocks', (req, res) => {
    //     res.send(createBlock(req.body.data));
    // })


    app.post('/mineBlock', (req, res) => {
        mineBlock(req.body.data)
        res.redirect('/blocks');
    })

    app.post('/autoMineBlock', (req, res) => {
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