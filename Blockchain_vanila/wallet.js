/*
암호화

탈중앙화
분산원장관리

무결성 : 정보는 일반적으로 수정이 가능한데, 이는 권한 있는 사용자에게만 허가
기밀성 : 정보를 저장하고 전송하면서 부적절한 노출을 방지, 정보 보안의 주된 목적
가용성 : 활용 되어야할 정보에 접근 할 수 없다면, 기밀성과 무결성이 훼손된 것만큼이나 무의미하다.

지갑
private key
public key

타원 곡선 디지털 서명 알고리즘 (ECDSA)

영지식 증명 (zero knowledge proof)

증명하는 사람(A), 증명을 원하는 사람(B)
A 와 B 는 증명된 내용에 합의
그외의 사람들은 동의하지 않습니다.

*/

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


export { initWallet, getPublicKeyFromWallet, getPrivateKeyFromWallet };