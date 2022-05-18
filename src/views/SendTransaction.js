import React, { useState } from 'react';
import axios from "axios";

export default function SendTransaction({ setState }) {
    const [userdata, setUserData] = useState('')
    const [inputs, setInputs] = useState({
        wal_addr: "",
        amount: "",
    });

    const getUser = async () => {
        
        try {
            await axios.post('http://localhost:4000/userData', {
                data: sessionStorage.user
            }).then((res) => {
                // console.log(res.data[0])
                setUserData(res.data[0])
            })

        } catch (e) {
            console.log(e)
            console.log("/userData 백서버 오류")
        }
    }

    const onChange = (e) => {
        // var reg = /[^0-9a-zA-Z]/g
        // if (reg.test(e.target.value)) alert("지갑주소를 올바르게 입력하세요")
        const name = e.target.name;
        const value = e.target.value.replace(/[^0-9a-zA-Z]/g, "");
        setInputs(values => ({ ...values, [name]: value }));
        console.log(inputs)
    }


    const gotoMain = () => {
        setState("main");
    }

    const onSend = () => {
        console.log("test");
        let fromAddress = userdata.publicKey;
        let privateKey = userdata.privateKey;
        let toAddress = inputs.wal_addr;
        let amount = inputs.amount;
        axios.post("http://localhost:3001/sendTransaction", {
            fromAddress: fromAddress,
            senderPrivateKey :privateKey,
            toAddress: toAddress,
            amount: amount,
        })
        .then((res) => {
            console.log(res.data);
            if (res.data.msg) alert("존재하지 않는 지갑주소입니다.");
            else {
                alert("전송 성공")
            }
        })
    }
    React.useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            <h1 className='walmaintxt'>ZUGAR 전송</h1>
            <div className="wal-send-input-box">
                <span className='wal-send-header'>보내는 지갑 주소</span>
                <input
                    className='wal-send-input'
                    placeholder='보내는 지갑 주소'
                    name='wal_addr'
                    value={inputs.wal_addr}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSend()
                    }} />
                <span className='wal-send-header'>금액</span>
                <input
                    className='wal-send-input'
                    placeholder='금액'
                    name='amount'
                    value={inputs.amount}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSend()
                    }} />
            </div>
            <div className="walmake">
                <button onClick={onSend} className="walmakebtn">전송하기</button>
                <button onClick={gotoMain} className="walmakebtn">뒤로가기</button>
            </div>
        </>
    )
}