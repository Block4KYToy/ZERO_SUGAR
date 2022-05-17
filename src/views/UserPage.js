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
// image import
import profilePic from '../assets/img/mike.jpg';
import bg5 from '../assets/img/bg5.jpg';
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
  // const getUserBalance = async () => {
  //   const userBalance = await pool.query(`SELECT * FROM signUp WHERE email = '${sessionStorage.user}'`);
  //   console.log(userBalance)
  // }
  // getUserBalance()
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
                  <Row className="profile-row">
                    <Col xs={6}>
                      <FormGroup>
                        <label className="profile-label">Email</label>
                        <Input
                          disabled
                          defaultValue="Zero Sugar Company"
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
                    <h5 className="title">Mike Andrew</h5>
                  </a>
                  <p className="description">michael24</p>
                </div>
                <p className="description text-center">
                  "Lamborghini Mercy <br />
                  Your chick she so thirsty <br />
                  I'm in that two seat Lambo"
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