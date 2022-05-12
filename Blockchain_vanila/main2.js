// p2p 서버 초기화, 사용
// http 서버 초기화, 사용
// 블록체인 함수 사용

import { initHttpServer } from "./httpServer.js";
import { initP2PServer } from "./p2pServer.js"

const httpPort = parseInt(process.env.Http_Port) || 3002; // 3001, env 파일에는 모두 string?

const p2pPort = parseInt(process.env.P2P_Port) || 6002; // 6001


initHttpServer(httpPort);
initP2PServer(p2pPort);
