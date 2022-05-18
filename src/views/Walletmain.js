import React, { useEffect, useState } from "react";
import CreateWallet from "./CreateWallet";
// import "../Modal/Modal.css";
// import Payment from "./Payment";
import axios from "axios";
import styled from "styled-components";
import SendTransaction from "./SendTransaction";
import Zero from "../assets/img/zero.png";

const St = {
    CoinLogo: styled.div`
        display: inline-block;
        width: 300px;
        height: 225px;
        background-image: url();
        background-size: cover;
  `,
}

export default function Walletmain() {
    const [userdata, setUserData] = useState(null);
    const getUser = async () => {
        try {
          await axios.post('http://localhost:4000/userData', {
            data: sessionStorage.getItem('user')
          }).then((res) => {
            // console.log(res.data[0])
            setUserData(res.data[0])
          })
    
        } catch (e) {
          console.log(e)
          console.log("/userData 백서버 오류")
        }
        // console.log(userBalance)
    }

    useEffect(() => {
        getUser()
    }, [])

    const [state, setState] = useState("main");

    const onKuoSend = () => {
        setState("kuosend");
    }

    const onWallet = () => {
        setState("wallet");
    }

    const copyHash = (hash) => {
        console.log(hash);
        navigator.clipboard.writeText(hash)
        // .then(() => {
            // ToastsPop()
        //   });
    }
    

    return (
        <>
            { state === "main"
            ? 
            <>
                <div className="wal_container">
                    <span className="wal-header">내 지갑 Public Key</span><br />
                    <span className="wal-public" onClick={() => copyHash(userdata.publicKey)}>
                        {userdata !== null ? userdata.publicKey.slice(0, 10) + "......" + userdata.publicKey.slice(120) : ""}
                    </span>
                    <div style={{marginTop: "20px"}}>
                        <span className="wal-header">내 지갑 Private Key</span><br />
                        <span className="wal-private" onClick={() => copyHash(userdata.privateKey)}>
                            {userdata !== null ? userdata.privateKey.slice(0,10) + "......" + userdata.privateKey.slice(54) : ""}
                        </span>
                    </div>
                </div> 
                {/* <St.CoinLogo /> */}
                <div className="logo-container">
                    <img className="coin-logo" src={Zero} />
                    <div><span className="wal-balance">{userdata!==null? userdata.balance : 0} ZUGARS</span></div>
                </div>

                <div className="walmake">
                    <button onClick={onKuoSend} className="walmakebtn">전송</button>
                    {/* <button onClick={onWallet} className="walmakebtn">지갑 생성하기</button> */}
                </div>
            </>
            : <SendTransaction setState={setState}/>
            }
        </>
    )
}