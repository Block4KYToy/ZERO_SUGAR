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
    console.log('=========================================')
    const publicKey = ec.keyFromPrivate(privateKey, 'hex');
    // todo: 131자리 확인
    // 04727d7d3c3a8553f4a57aa513747dd82e9f8ae2ad4db12998c63ebb5dfd81d2715b573b1d55fbbd6866163f00daf16b124d887765b2632e05d489697d7c65724d
    // console.log(publicKey.getPublic().encode('hex'))
    // console.log(publicKey)
    //044885408c7df290b0440b7821ae17644b2a4b83a0f2b213072c08ac835e8e26be624efae37d90f03c894a53542fe3cd14cfd9e4d50fb97b52e59e944e5aef27a9
    return publicKey.getPublic().encode('hex');
}





router.post('/signup', async(req, res) => {
    const privateKeys = createPrivateKey()
    const publicKeys = getPublicKeyFromWallet()
    console.log(privateKeys);
    console.log(publicKeys);
    // console.log(req.body)
    const {name, email, password} = req.body.data
    // console.log(name)
    // let name = req.body.data.name
    // let email = req.body.data.email
    // let password = req.body.password
    const publicKey = publicKeys;
    const privateKey = privateKeys;
    const emails = await pool.query(`SELECT * FROM signUp WHERE email = '${email}'`)
    // console.log("emails: ", emails[0]);
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
    // console.log(result)
    // res.redirect('/admin')
})

router.post('/login', async(req, res) => {
    // console.log(req.body)
    const {email, password} = req.body.data
    // console.log(name)
    // let name = req.body.data.name
    // let email = req.body.data.email
    // let password = req.body.password
    const logindata = await pool.query(`SELECT * FROM signUp WHERE email = '${email}' and password = '${password}'`)
    // const passwords = await pool.query(`SELECT * FROM signUp WHERE password = '${password}'`)
    // console.log("emails: ", emails[0]);
    // console.log(logindata)
    if(logindata[0].length === 0) {
        console.log('틀렸누!')
        console.log('----------------------')
        res.send('실패')
    } else {
        console.log('맞았누!!!!')
        console.log('----------------------')
        res.send('성공')
    }
    // console.log(result)
    // res.redirect('/admin')
})


module.exports = router
