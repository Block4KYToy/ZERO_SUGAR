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
import React from "react";
// image import
import profilePic from '../assets/img/mike.jpg';
import bg5 from '../assets/img/bg5.jpg';
import axios from "axios";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function User() {
  const [user, setUser] = React.useState('');
  const [userdata, setUserData] = React.useState([]);
  const [balance, setBalance] = React.useState(0);
  const [count, setCount] = React.useState(0)

  const onChange = (e) => {
    setCount(e.target.value)
    // console.log(count)
  }


  const getUser = async () => {
    try {
      await axios.post('http://localhost:4000/userData', {
        data: user
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
  // console.log(userdata);
  const mineBlock = async () => {
    if (userdata.publicKey) {
      try {
        await axios.post('http://localhost:3001/userMineBlock', {
          address: userdata.publicKey
        }).then((res) => {
          alert("채굴성공")
          console.log(res.data)
        })
      } catch (e) {
        console.log(e)
        console.log("/userData 백서버 오류")
      }
    }
  }
  const autoMine = async () => {
    if (userdata.publicKey) {
      try {
        await axios.post('http://localhost:3001/autoMineBlock', {
          address: userdata.publicKey,
          count: count
        }).then((res) => {
          // alert("채굴성공")
          console.log(res.data)
        })
      } catch (e) {
        console.log(e)
        console.log("/userData 백서버 오류")
      }
    }
  }

  const updateBalance = async () => {
    if (userdata.publicKey) {
      try {
        await axios.post('http://localhost:3001/balanceUser', {
          address: userdata.publicKey
        }).then((res) => {
          // alert("채굴성공")
          // console.log(res.data)
          setBalance(res.data.balance)
        })
      } catch (e) {
        console.log(e)
        console.log("/userData 백서버 오류")
      }
    }
  }


  React.useEffect(() => {
    if (sessionStorage.user) {
      setUser(sessionStorage.user)
    }
    getUser()
    updateBalance()

  })

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">User Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    {/* <Col className="px-1" md="3">
                      <FormGroup>
                        <label>Username</label>
                        <Input
                          defaultValue="michael23"
                          placeholder="Username"
                          type="text"
                        />
                      </FormGroup>
                    </Col> */}
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Input placeholder={userdata ? userdata.email : "email"} type="email" />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Balance</label>
                        <Input
                          defaultValue="로딩중"
                          disabled
                          placeholder={balance}
                          type="number"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Public Key</label>
                        <Input
                          defaultValue=""
                          disabled
                          placeholder={userdata ? userdata.publicKey : "publicKey"}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Private Key</label>
                        <Input
                          defaultValue=""
                          disabled
                          placeholder={userdata ? userdata.privateKey : "privatekey"}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="profile-row">
                    <Col xs={6}>
                      <FormGroup>
                        <label className="profile-label">Password</label>
                        <Input
                          defaultValue=""
                          placeholder={userdata ? userdata.password : "Password"}
                          type="password"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="profile-row">
                    <Col xs={6}>
                      <FormGroup>
                        <label className="profile-label">Name</label>
                        <Input
                          defaultValue="Your Name"
                          placeholder={userdata ? userdata.name : "Name"}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="profile-row">
                    <Col xs={6}>
                      <FormGroup>
                        <label className="profile-label">City</label>
                        <Input
                          defaultValue="Seoul"
                          placeholder="City"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="profile-row">
                    <Col xs={6}>
                      <FormGroup>
                        <label className="profile-label">Country</label>
                        <Input
                          defaultValue="South Korea"
                          placeholder="Country"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="profile-row">
                    <Col md="12">
                      <FormGroup>
                        <label className="profile-label">About Me</label>
                        <Input
                          className="profile-description"
                          cols="40"
                          defaultValue="안녕하세요 제로컴퍼니입니다."
                          placeholder="Your description"
                          rows="4"
                          type="textarea"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <div className="image">
                {/* <img alt="..." src={bg5} /> */}
              </div>
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src="https://www.sprite.com/content/dam/nagbrands/us/sprite/en/products/thirst-for-yours/products/sprite-zero/desktop/sprite_zero_featurecan.jpg"
                    />
                    <h5 className="title">Zero Sugar</h5>
                  </a>
                  <p className="description">Sugar Restricted.</p>
                </div>
                <p className="description text-center">
                  Excessive sugar intake can lead to diabetes. <br />
                </p>
              </CardBody>
              <hr />
            </Card>
          </Col>
        </Row>
        <Row>
          <Button className="profile-btn">저장하기</Button>
        </Row>
      </div>
      <button onClick={mineBlock}>mine block</button>
      <br></br>
      <input name="count" type="number" onChange={onChange} />
      <button type="button" onClick={autoMine}>auto mine block</button>

    </>
  );
}

export default User;