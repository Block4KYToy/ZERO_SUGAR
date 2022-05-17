import React, { useState } from 'react';
import axios from "axios";

export default function SendTransaction({setState}) {
    const [inputs, setInputs] = useState({
        wal_addr: "",
        amount: "",
    });

    const onChange = (e) => {
        // var reg = /[^0-9a-zA-Z]/g
        // if (reg.test(e.target.value)) alert("지갑주소를 올바르게 입력하세요")
        const name = e.target.name;
        const value = e.target.value.replace(/[^0-9a-zA-Z]/g, "");
        setInputs(values => ({...values, [name] : value}));
    } 

    const gotoMain = () => {
        setState("main");
    }

    const onSend = () => {
        console.log("test");
        // axios.put("http://localhost:3001/sendkuos", {
        //     wallet: mainWallet,
        //     to_addr: inputs.wal_addr,
        //     amount: inputs.amount,
        // })
        // .then((res) => {
        //     console.log(res.data);
        //     if (res.data.msg) alert("존재하지 않는 지갑주소입니다.");
        //     else {
        //         alert("전송 성공")
        //     }
        // })
    }

    return (
        <>
        <h1 className='walmaintxt'>ZUGAR 전송</h1>
        <input 
        placeholder='보내는 지갑 주소' 
        name='wal_addr' 
        value={inputs.wal_addr} 
        onChange={onChange}
        onKeyDown={(e) => {
            if (e.key === "Enter") onSend()
        }}/>
        <input 
        placeholder='금액' 
        name='amount' 
        value={inputs.amount} 
        onChange={onChange}
        onKeyDown={(e) => {
            if (e.key === "Enter") onSend()
        }}/>
        <div className="walmake">
            <button onClick={onSend} className="walmakebtn">전송하기</button>
            <button onClick={gotoMain} className="walmakebtn">뒤로가기</button>
        </div>
        </>
    )
}