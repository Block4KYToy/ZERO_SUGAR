import _ from "lodash";
import { initP2PServer } from "./p2p.js"
import { initWallet } from "./wallet.js"
import { initHttpServer } from './httpServer.js'

let httpPort = parseInt(process.env.HTTP_PORT) || 3002;
let p2pPort = parseInt(process.env.P2P_PORT) || 6002;


initHttpServer(httpPort);
initP2PServer(p2pPort);
initWallet();
