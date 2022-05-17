import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table} from "reactstrap";
import { useHistory } from 'react-router-dom';

const RecentTransaction = ({ allData, addressArr }) => {
  console.log(allData, addressArr);
  let history = useHistory();

  const routePath = (index) => {
    // console.log(index);
    history.push(`/admin/block/${index}`);
  }

    return (
          <Row>
            <Col xs={12} md={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-category"></h5>
                  <CardTitle tag="h4">Recent Transactions</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Tx Hash</th>
                        <th>From</th>
                        <th>To</th>
                        <th className="text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.length > 0 && addressArr.length > 0? 
                        allData[0].map((block) => {
                          if (block.index > allData[0].length - 6) {
                            let hour = parseInt((Date.now() - new Date(block.timestamp * 1000)) / 3600000);
                            let min = parseInt((Date.now() - new Date(block.timestamp * 1000)) % 3600 / 60);
                            let sec = parseInt((Date.now() - new Date(block.timestamp / 1000) % 3600) % 60);
                            let text = new Date(block.timestamp*1000).toString();
                            text = text.slice(0, text.length - 9);

                            // let data = JSON.stringify(JSON.parse(block.data)[0].id);
                            let data = JSON.parse(block.data)[0];
                            let txHash = data.id;
                            let txTo = JSON.stringify(data.txOuts[0].address);
                            let random = Math.floor(Math.random()*addressArr.length);
                            let txFrom = (addressArr[random] == txTo) ? 
                                    random == 0 ? JSON.stringify(addressArr[random+1]) 
                                    : JSON.stringify(addressArr[random-1]) 
                                    : JSON.stringify(addressArr[random]);
                            return (
                              <>
                                <tr 
                                  key={block.index + 1000}
                                >
                                  <td className="search-td-hash" onClick={() => routePath(block.index)}>{txHash}</td>
                                  <td >{txFrom.slice(1, 11) + '......' + txFrom.slice(txFrom.length-11, txFrom.length-1)}</td>
                                  <td>{txTo.slice(1, 11) + '......' + txTo.slice(txTo.length-11, txTo.length-1)}</td>
                                  <td className="text-right">{hour}시간 {min}분 {sec}초 전</td>
                                </tr>
                              </>
                            )
                          }
                          return null
                        })
                      : null
                    }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
    )
}

export default RecentTransaction