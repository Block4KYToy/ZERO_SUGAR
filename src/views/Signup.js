/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";
import axios from 'axios';
import '../assets/css/sign.css';
import Zeros from '../assets/img/zero.png';
import { useHistory } from "react-router-dom";

// reactstrap components
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function Signup() {
  let history = useHistory();
  const [userInfo, setUserInfo] = useState({name: "", email: "", password: "", pwconfirm: ""});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserInfo({...userInfo, [name]: value});
  }

  const isValidData = () => {
    const { name, email, password, pwconfirm } = userInfo;
    // 이름 유효성
    let engNameReg = /^[a-zA-Z ]+$/;
    let korNameReg = /^[가-힣]+$/;
    if (!engNameReg.test(name) && !korNameReg.test(name)) {
      alert("이름을 올바르게 입력하세요.");
      return false;
    }
    // 이메일 유효성
    let emailReg = /^[a-zA-Z]+([-_.]?[0-9a-zA-Z])*@[a-z]{4,}.[a-z]{2,3}$/i;
    // if (!emailReg.test(email)) {
    //   alert("이메일 형식이 잘못되었습니다.");
    //   return false;
    // }
    // if (!emailReg.test(email)) {
    //   alert("이메일 형식이 잘못되었습니다.");
    //   return false;
    // }
    // 비밀번호 유효성(6자리 이상의 영문조합)
    let pwReg = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&]{6,}/
    if (!pwReg.test(password)) {
      alert("비밀번호 6자리 이상의 영문조합으로 설정하세요.")
    }
    // 비밀번호 일치
    if (password !== pwconfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    // console.log("성공!");
    return true;
  }

  const handleSubmit = async() => {
    console.log("data: ", userInfo);
    // USERINFO INSERT INTO
    if (isValidData()) {
    await axios.post('http://localhost:4000/signup',
    {
      data: userInfo,
    })
    .then((res) => {
      console.log(res);
     // 이메일이 유일한가
     // db입력이 잘 되었는가
      let result = res.data;
      if (result === "성공") {
        alert("회원가입이 완료되었습니다!");
        history.push('/admin/login');
      }
      
      else {
        alert("중복된 이메일입니다!");
      }
    })
    }
  }

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader className="card-header">
                  <h2 className="title">Sign up</h2>
                  <p className="category">ZERO-SUGAR</p>
              </CardHeader>
              <CardBody className="card-body">
                <div className="img-box">
                  <img className="zero-sugar" src={Zeros} alt="Zero Sugar"/>
                </div>
                <div className="input-box">
                  <input className="sign-input" name="name" type="text" placeholder="Name" onChange={handleChange} value={userInfo.name}/><br />
                  <input className="sign-input" name="email" type="text" placeholder="Email" onChange={handleChange} value={userInfo.email}/><br />
                  <input className="sign-input" name="password" type="password" placeholder="Password" onChange={handleChange} value={userInfo.password}/><br />
                  <input className="sign-input" name="pwconfirm" type="password" placeholder="Password Confirm" onChange={handleChange} value={userInfo.pwconfirm}/><br />
                </div>
                <button onClick= {handleSubmit} className="login-btn">Sign Up</button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Signup;
