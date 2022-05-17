import React, {useState} from 'react';
import axios from "axios";

export default function CreateWallet({setState}) {
    // const { data, setState, setData, setInfo } = props;
    const [inputs, setInputs] = useState({account: ""})
    const gotoMain = () => {
        setState("main");
    }

    const onChange = (e) => {
        setInputs({account: e.target.value})
        console.log(inputs.account)
    } 

    const onCreate = () => {
        // if (data.length < 3) {
        //     axios.post("http://localhost:3001/wallet", {
        //         walid: inputs.account,
        //         owner: sessionStorage.user_id,
        //     })
        //     .then(res => {
        //         console.log(res.data);
        //         let data = res.data;
        //         if (data === "user already exists!") alert("중복된 아이디입니다!");
        //         else {
        //             if (res.data.length===1) setInfo(values => ({...values, ['wallet']: inputs.account}))
        //             res.data.forEach(element => {
        //                 if (element.wal_id === inputs.account) alert(`지갑이 등록되었습니다!. \n\n지갑주소: ${element.wal_addr}`);
        //             });
        //             setData(res.data);
        //             setState("main");
        //         }
        //     });
        // }
        // else alert("지갑은 3개까지 생성 가능합니다.")    
    }

    return (
        <>
        {/* <h1 className='walmaintxt'>지갑 생성하기</h1> */}
        <h5 style={{marginBottom: "30px"}}>아래 무료 지갑을 생성하세요.</h5>
        <input className="wal_id"
        placeholder='지갑 아이디' 
        name='account' 
        value={inputs.account} 
        onChange={onChange}
        onKeyDown={(e) => {
            if (e.key === "Enter") onCreate()
        }}/>
        <div className="walmake">
            <button onClick={onCreate} className="walmakebtn">지갑 생성하기</button>
            <button onClick={gotoMain} className="walmakebtn">뒤로가기</button>
        </div>
        </>
    )
}