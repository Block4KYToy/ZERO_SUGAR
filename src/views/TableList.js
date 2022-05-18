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
import React, { useEffect, useState } from "react";
import axios from 'axios';
// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
  Container
} from "reactstrap";


// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

import { thead, tbody } from "variables/general";
import { useParams } from "react-router-dom";  
import SearchBar from "./SearchBar";

function TableList() {
  const { index } = useParams();
  const [allData, setAllData] = useState([]);
  const [block, setBlock] = useState([]);
  const [tx, setTx] = useState({});
  
  useEffect(async () => {
    await axios.get('http://localhost:4000/admin/dashBoard')
    .then((res) => {
      let addressArr = [];
      let result = res.data[0].filter(data => data.index == index);
      // console.log("result: ", result);
      const getAllTxAddresses = (blockData) => {
        console.log(blockData);
        if (blockData.length === 0) return;
        let addressArr = [];
        blockData.forEach((block) => {
          let address = JSON.parse(block.data)[0].txOuts[0].address;
          if (!addressArr.includes(address)) addressArr.push(address);
        });
        return addressArr;
      }
      addressArr = getAllTxAddresses(res.data[0]);

      let dummy = JSON.parse(result[0].data);
      let txHash = dummy[0].id;
      let txTo = dummy[0].txOuts[0].address;
      let random = Math.floor(Math.random()*addressArr.length);
      let txFrom = addressArr[random] == txTo ? random == 0 ? addressArr[random+1] : addressArr[random-1] : addressArr[random];
      let amount = dummy[0].txOuts[0].amount;
      let timestamp = result[0].timestamp - Math.floor(Math.random() * 3000) + 1000;
      let hour = parseInt((Date.now() - new Date(timestamp * 1000)) / 3600000);
      let min = parseInt((Date.now() - new Date(timestamp * 1000)) % 3600 / 60);
      let sec = parseInt((Date.now() - new Date(timestamp / 1000) % 3600) % 60);
      let text = new Date(timestamp*1000).toString();
      
      setAllData(res.data);
      setBlock(result);
      setTx({
        txHash: txHash,
        txFrom: txFrom,
        txTo: txTo,
        amount: amount,
        text: text,
        time: [hour, min, sec],
      })
    })
  },[index])
  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <SearchBar allData={allData}/>
          <Container className="blockinfo-table">
            <Row>
              <Col xs={12}>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4" className="block-table-header">Block Infos</CardTitle>
                  </CardHeader>
                  <CardBody>
                    {/* <Table responsive className="block-table"> */}
                    <Container className="block-table">
                      {block.length > 0
                      ?
                      <>
                        <Col lg={4}>
                          {Object.keys(block[0]).map(data => data!== "data" ? <div className="block-content-header">{data[0].toUpperCase() + data.slice(1).toLowerCase()}</div> : null )}
                        </Col>
                        <Col lg={8}>
                          {Object.values(block[0]).map(
                            (data, index) => index !==1 ? 
                             index !==2 ?
                             <div className="block-content">{data}</div> 
                            :<div className="block-content">{new Date(data*1000).toString()}</div>
                            :null)}
                        </Col>
                      </>
                      : null
                      }
                    </Container>
                  </CardBody>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="card-plain">
                  <CardHeader>
                    <CardTitle tag="h4" className="block-table-header">Transaction(s)</CardTitle>
                    <p className="category"> Invest In ZUGAR COIN! </p>
                  </CardHeader>
                  <CardBody>
                    <Container className="transaction-table">
                      {block.length > 0 && tx.txHash
                        ?
                        <>
                          <Col lg={4}>
                            <div className="block-content-header">Transaction Hash</div>
                            <div className="block-content-header">From</div>
                            <div className="block-content-header">To</div>
                            <div className="block-content-header">Timestamp</div>
                            <div className="block-content-header">Amount</div>
                          </Col>
                          <Col lg={8}>
                            <div className="block-content">{tx.txHash}</div>
                            <div className="block-content">{tx.txFrom.slice(0,20) + "......" + tx.txFrom.slice(tx.txFrom.length-20)}</div>
                            <div className="block-content">{tx.txTo.slice(0,20) + "......" + tx.txTo.slice(tx.txTo.length-20)}</div>
                            <div className="block-content">{`${tx.time[0]}시간 ${tx.time[1]}분 ${tx.time[2]}초 전`}</div>
                            <div className="block-content">{tx.amount}</div>
                          </Col>
                        </>
                        : null
                      }
                    </Container>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
      </div>
    </>
  );
}

export default TableList;
