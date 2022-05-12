// p2p 서버 초기화, 사용
// http 서버 초기화, 사용
// 블록체인 함수 사용

import { initHttpServer } from "./httpServer.js";
import { initP2PServer } from "./p2pServer.js"
import { initWallet } from "./wallet.js"

const httpPort = parseInt(process.env.Http_Port) || 3001; // 3001, env 파일에는 모두 string?
// const httpPort2 = 3002; // 3001, env 파일에는 모두 string?
// const httpPort3 = 3003; // 3001, env 파일에는 모두 string?
const p2pPort = parseInt(process.env.P2P_Port) || 6001; // 6001
// const p2pPort2 = 6002; // 6001
// const p2pPort3 = 6003; // 6001

initWallet();
initHttpServer(httpPort);
initP2PServer(p2pPort);
// initP2PServer(p2pPort2);
// initP2PServer(p2pPort3);