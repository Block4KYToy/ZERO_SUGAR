const express = require('express')
const router = express.Router();
const pool = require('../db')
const ecdsa = require('elliptic');
const ec = new ecdsa.ec('secp256k1');

const createPrivateKey = () => {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();

    return privateKey.toString(16);
};

const getPublicKeyFromWallet = () => {
    const privateKey = createPrivateKey()
    const publicKey = ec.keyFromPrivate(privateKey, 'hex');
    return publicKey.getPublic().encode('hex');
}

router.post('/signup', async(req, res) => {
    const privateKeys = createPrivateKey()
    const publicKeys = getPublicKeyFromWallet()

    console.log(privateKeys);
    console.log(publicKeys);

    const {name, email, password} = req.body.data
    const publicKey = publicKeys;
    const privateKey = privateKeys;
    const emails = await pool.query(`SELECT * FROM signUp WHERE email = '${email}'`)

    if(emails[0].length === 0) {
        console.log('없는거누!')
        console.log('----------------------')
        const [result] = await pool.query(`INSERT INTO signUp(name, email, password, publicKey, privateKey)VALUES('${name}','${email}','${password}','${publicKey}', '${privateKey}')`)
        res.send('성공')
        
    } else {
        console.log('있누!!!!')
        console.log('----------------------')
        res.send('실패')
    }
})

router.post('/login', async(req, res) => {
    const {email, password} = req.body.data
    const logindata = await pool.query(`SELECT * FROM signUp WHERE email = '${email}' and password = '${password}'`)

    if(logindata[0].length === 0) {
        console.log('틀렸누!')
        console.log('----------------------')
        res.send('실패')
    } else {
        console.log('맞았누!!!!')
        console.log('----------------------')
        res.send('성공')
    }
})

module.exports = router