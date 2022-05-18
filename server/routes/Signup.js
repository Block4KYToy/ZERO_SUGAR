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

const getPublicKeyFromWallet = (privateKey) => {

    const publicKey = ec.keyFromPrivate(privateKey, 'hex');
    return publicKey.getPublic().encode('hex');
}

router.post('/signup', async (req, res) => {
    const privateKeys = createPrivateKey();
    const publicKeys = getPublicKeyFromWallet(privateKeys)

    console.log(privateKeys);
    console.log(publicKeys);

    const { name, email, password } = req.body.data
    const publicKey = publicKeys;
    const privateKey = privateKeys;
    const emails = await pool.query(`SELECT * FROM signUp WHERE email = '${email}'`)

    if (emails[0].length === 0) {
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

router.post('/login', async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body.data
    // console.log(name)
    // let name = req.body.data.name
    // let email = req.body.data.email
    // let password = req.body.password
    const logindata = await pool.query(`SELECT * FROM signUp WHERE email = '${email}' and password = '${password}'`)
    // const passwords = await pool.query(`SELECT * FROM signUp WHERE password = '${password}'`)
    // console.log("emails: ", emails[0]);
    // console.log(logindata)
    if (logindata[0].length === 0) {
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

//res.data

router.post('/updateUser', async (req, res) => {
    // console.log(req.body);
    const { email, name, password, about } = req.body;
    const [result] = await pool.query(`UPDATE signUp SET name="${name}", password="${password}" WHERE email="${email}"`);
    // console.log(result);
    if (result.length === 0) {
        res.send("실패")
    }
    else res.send("성공")
})


module.exports = router
