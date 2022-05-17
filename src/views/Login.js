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
import axios from "axios";
import { useHistory } from "react-router-dom";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import Zeros from '../assets/img/zero.png';
import '../assets/css/sign.css';

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import Dashboard from "./Dashboard";

import { useDispatch, useSelector } from "react-redux";

function Login(props) {
  let history = useHistory();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { setAuth } = props;
  const [user, setUser] = useState({email: "", password: ""})
  // console.log("login : ", props);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({...user, [name]: value});
  }

  const handleSubmit = async(e) => {
    console.log("data: ", user);
    // USER GET
    await axios.post('http://localhost:4000/login', {
        data: user,
    })
    .then((res) => {
      let result = res.data;
      // 입력정보가 db정보와 일치하는가
      if (result === "성공") {
        // console.log("성공!");
        sessionStorage.setItem('user', `${user.email}`);
        sessionStorage.setItem('password', `${user.password}`);
        sessionStorage.setItem('loginstatus', true);
        // setAuth(true);
        dispatch({type: "USER_LOGIN"});
        history.push('/admin');
      }
      else alert("로그인 정보가 일치하지 않습니다!")
    })
  }

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader className="card-header">
                {/* <div className="header"> */}
                  <h2 className="title">Login</h2>
                  <p className="category">ZERO-SUGAR</p>
                {/* </div> */}
              </CardHeader>
              <CardBody className="card-body">
                <div className="img-box">
                  <img className="zero-sugar" src={Zeros} alt="Zero Sugar"/>
                </div>
                <div className="input-box">
                  <input className="sign-input" name="email" type="text" placeholder="Email" value={user.email} onChange={handleChange}/><br />
                  <input className="sign-input" name="password" type="password" placeholder="Password" value={user.password} onChange={handleChange}/><br />
                </div>
                <button onClick={handleSubmit} className="login-btn">Sign in</button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Login;
