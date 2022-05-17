import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table} from "reactstrap";
import { useHistory } from 'react-router-dom';

const RecentTransaction = ({ allData }) => {
  // 수정되면 고칠것
  // const getAllTxAddresses = (blockData) => {
  //   console.log(blockData);
  //   if (blockData.length === 0) return;
  //   let addressArr = [];
  //   blockData.forEach((block) => {
  //     let address = JSON.parse(block.data)[0].txOuts[0].address;
  //     if (!addressArr.includes(address)) addressArr.push(address);
  //   });
  //   return addressArr;
  // }
  // const addressArr = getAllTxAddresses(allData[0]);
  // console.log("address : ", addressArr);

  //const routePath = (index) => {
  // history.push(`/admin/block/${index});
  // }
  let history = useHistory();
  const routePath = (e) => {
    // console.log(e.target.innerHTML);
    let searchParams = e.target.innerHTML;
    let routeIndex = allData[0].filter((data) =>
      data.index == searchParams || data.hash == searchParams
    )[0].index;
    // console.log(routeIndex);
    history.push(`/admin/block/${routeIndex}`);
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
                      {/* {allData.length > 0 ? 
                        allData[0].map((block) => {
                          if (block.index > allData[0].length - 6) {
                            let hour = parseInt((Date.now() - new Date(block.timestamp * 1000)) / 3600000);
                            let min = parseInt((Date.now() - new Date(block.timestamp * 1000)) % 3600 / 60);
                            let sec = parseInt((Date.now() - new Date(block.timestamp / 1000) % 3600) % 60);
                            let text = new Date(block.timestamp*1000).toString();
                            text = text.slice(0, text.length - 9);

                            let data = JSON.parse(block.data)[0];
                            let txHash = data.id;
                            // let txTo = data.txOuts[0].address;
                            // let random = Math.floor(Math.random()*addressArr.length);
                            // let txFrom = addressArr[random] == txTo ? random == 0 ? addressArr[random+1] : addressArr[random-1] : addressArr[random];

                            return (
                              <>
                                <tr 
                                  key={block.index + 1000}
                                >
                                  <td className="search-td" onClick={routePath(block.index)}>{block.hash}</td>
                                  <td className="search-td" >{txFrom}</td>
                                  <td>{trTo}</td>
                                  <td className="text-right">{text} &nbsp;&nbsp;&nbsp;({hour}시간 {min}분 {sec}초 전)</td>
                                </tr>
                              </>
                            )
                          }
                          return null
                      })
                    : null
                    } */}
                                        {allData.length > 0 ? 
                    allData[0].map((block) => {
                      if (block.index > allData[0].length - 6) {
                        let hour = parseInt((Date.now() - new Date(block.timestamp * 1000)) / 3600000);
                        let min = parseInt((Date.now() - new Date(block.timestamp * 1000)) % 3600 / 60);
                        let sec = parseInt((Date.now() - new Date(block.timestamp / 1000) % 3600) % 60);
                        let text = new Date(block.timestamp*1000).toString();
                        text = text.slice(0, text.length - 9);

                        let data = block.data;
                        // let txHash = data.id;
                        return (
                          <>
                            <tr 
                              key={block.index + 1000}
                            >
                              <td className="search-td" onClick={routePath}>{block.index}</td>
                              <td className="search-td" onClick={routePath}>{block.hash}</td>
                              <td>{text} &nbsp;&nbsp;&nbsp;({hour}시간 {min}분 {sec}초 전)</td>
                              <td className="text-right">{data}</td>
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