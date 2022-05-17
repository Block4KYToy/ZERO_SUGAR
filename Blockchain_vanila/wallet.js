import ecdsa from 'elliptic';
import fs from 'fs';

const ec = new ecdsa.ec('secp256k1');
const privateKeyLocation = 'wallet/' + (process.env.PRIVATE_KEY || 'default');
const privateKeyFile = privateKeyLocation + '/private_key';

const createPrivateKey = () => {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    // console.log(privateKey);
    // console.log(privateKey.toString(16));

    return privateKey.toString(16);
};

const initWallet = () => {
    // 이미 만들어져 있는 경우
    if (fs.existsSync(privateKeyFile)) {
        console.log('wallet private key already exists');
        return;
    }

    if (!fs.existsSync('wallet/')) { fs.mkdirSync('wallet/'); }
    if (!fs.existsSync(privateKeyLocation)) {
        // console.log(privateKeyLocation)
        fs.mkdirSync(privateKeyLocation)
    }

    const privateKey = createPrivateKey();
    fs.writeFileSync(privateKeyFile, privateKey);
};

const getPrivateKeyFromWallet = () => {
    const buffer = fs.readFileSync(privateKeyFile, 'utf-8');
    // console.log(buffer)
    return buffer.toString();
};

const getPublicKeyFromWallet = () => {
    const privateKey = getPrivateKeyFromWallet();
    const publicKey = ec.keyFromPrivate(privateKey, 'hex');
    // todo: 131자리 확인
    // 04727d7d3c3a8553f4a57aa513747dd82e9f8ae2ad4db12998c63ebb5dfd81d2715b573b1d55fbbd6866163f00daf16b124d887765b2632e05d489697d7c65724d
    // console.log(publicKey.getPublic().encode('hex'))
    return publicKey.getPublic().encode('hex');
}

const getBalance = (address, unspentTxOuts) => { //string , number
    return _(unspentTxOuts)
        .filter((uTxO) => uTxO.address === address)
        .map((uTxO) => uTxO.amount)
        .sum();
};



export { initWallet, getPublicKeyFromWallet, getPrivateKeyFromWallet, getBalance };