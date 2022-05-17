import React, { useEffect, useState } from "react";
import CreateWallet from "./CreateWallet";
// import "../Modal/Modal.css";
// import Payment from "./Payment";
import axios from "axios";
import styled from "styled-components";
import SendTransaction from "./SendTransaction";

const St = {
    CoinLogo: styled.div`
        display: inline-block;
        width: 300px;
        height: 225px;
        background-image: url(https://gateway.pinata.cloud/ipfs/Qmcr19WTLWVQSnVxL17zzvnBC3QAvNQASZQvcfGuNBGQqg);
        background-size: cover;
  `,
}

export default function Walletmain() {
    const [state, setState] = useState("main");

    const onKuoSend = () => {
        setState("kuosend");
    }

    const onWallet = () => {
        setState("wallet");
    }

    return (
        <>
            { state === "main"
            ? 
            <>
                <div className="wal_container">
                    내 지갑
                    <div style={{marginTop: "20px"}}>
                        안녕                    
                    </div>
                </div> 
                <St.CoinLogo />

                <div className="walmake">
                    <button onClick={onKuoSend} className="walmakebtn">전송</button>
                    <button onClick={onWallet} className="walmakebtn">지갑 생성하기</button>
                </div>
            </>
            : state === "wallet"
            ? <CreateWallet setState={setState}/>
            : <SendTransaction setState={setState}/>
            }
        </>
    )
}