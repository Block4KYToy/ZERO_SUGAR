import React, { useState } from "react";
import "./Modal.css";
import { useSelector, useDispatch } from "react-redux";
import Walletmain from "./Walletmain";

export default function Modal() {
    const dispatch = useDispatch();
    const modalState = useSelector((state) => state.modalState);
    const modalAuth = useSelector((state) => state.modalAuth);
    const [inputs, setInputs] = useState({
        id: "",
        pw: "",
    });
    const id = sessionStorage.getItem('user');
    const pw = sessionStorage.getItem('password');

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInputs((values) => ({ ...values, [name]: value }));
    };

    const checkAuth = () => {
        if (inputs.id == id && inputs.pw == pw) {
            setInputs({
                id: "",
                pw: "",
            });
            dispatch({type: "MODAL_LOGIN"});
        } 
        else {
            alert("입력하신 정보가 일치하지 않습니다.");
            console.log(id, pw);
            console.log(inputs.id, inputs.pw);
            setInputs({
                id: "",
                pw: "",
            });
        }
    };

    const closeModal = () => {
        dispatch({type: "MODAL_LOGOUT"});
        dispatch({type: "MODAL_CLOSE"});
    }

    return (
        <div className="outer-modal">
            <div className= {modalState ? "openModal modal" : "modal"}>
            {modalState ? 
            (
            <section>
                <header>
                    <button className="close" onClick={closeModal}>
                    &times;
                    </button>
                </header>

                <main>
                    {!modalAuth ? (
                        <>
                            <h5 className="waltxt">ZUGAR가 잠긴 상태입니다</h5>
                            <input
                            className="walinput"
                            placeholder="아이디"
                            name="id"
                            value={inputs.id}
                            onChange={onChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") checkAuth();
                            }}
                            />
                            <h5 className="waltxt"></h5>
                            <input
                            className="walinput"
                            placeholder="비밀번호"
                            name="pw"
                            value={inputs.pw}
                            onChange={onChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") checkAuth();
                            }}
                            />
                            <div className="walmake">
                                <button className="walmakebtn" onClick={checkAuth}>
                                    확인
                                </button>
                            </div>
                        </>
                    ) : (
                    <>
                        <Walletmain/>
                    </>
                    )}
                </main>
                
                <footer>
                    <button className="close" onClick={closeModal}>
                    close
                    </button>
                </footer>
            </section>
            ) 
            : null}
            </div>
        </div>
    );
}
