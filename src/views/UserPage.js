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
  const [balance, setBalance] = React.useState(0);

  
  const getUserBalance = async () => {
    if(sessionStorage.user) {
      setUser(sessionStorage.user)
    }
    try {
      await axios.post('http://localhost:4000/userData', {
        data: user 
      }).then((res) => {
        // console.log(res.data[0].balance)
        setBalance(res.data[0].balance)
      })
       
    } catch (e) {
      console.log(e)
      alert("/userData 백서버 오류")
    }
    // console.log(userBalance)
  }

  React.useEffect(()=> {
    getUserBalance();
  }, [user]) 

  console.log("user balance : ", balance)
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
                    <Col className="px-1" md="3">
                      <FormGroup>
                        <label>Username</label>
                        <Input
                          defaultValue="michael23"
                          placeholder="Username"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Input placeholder="Email" type="email" />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="5">
                      <FormGroup>
                        <label>Balance</label>
                        <Input
                          defaultValue="로딩중"
                          disabled
                          placeholder="Balance"
                          type="number"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          defaultValue="Mike"
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          defaultValue="Andrew"
                          placeholder="Last Name"
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
                          defaultValue="*******"
                          placeholder="Password"
                          type="text"
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
                          placeholder="Name"
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
    </>
  );
}

export default User;