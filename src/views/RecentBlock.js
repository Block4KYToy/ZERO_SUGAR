import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table} from "reactstrap";
import { useHistory } from 'react-router-dom';

const RecentBlock = ({ allData, setAllData }) => {
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
                <CardTitle tag="h4">Recent Blocks</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Block number</th>
                      <th>Hash</th>
                      <th>Timestamp</th>
                      <th className="text-right">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.length > 0 ? 
                    allData[0].map((block) => {
                      if (block.index > allData[0].length - 6) {
                        let hour = parseInt((Date.now() - new Date(block.timestamp * 1000)) / 3600000);
                        let min = parseInt((Date.now() - new Date(block.timestamp * 1000)) % 3600 / 60);
                        let sec = parseInt((Date.now() - new Date(block.timestamp / 1000) % 3600) % 60);
                        let text = new Date(block.timestamp*1000).toString();
                        text = text.slice(0, text.length - 9);
                        return (
                          <>
                            <tr 
                              key={block.index}
                            >
                              <td className="search-td" onClick={routePath}>{block.index}</td>
                              <td className="search-td" onClick={routePath}>{block.hash}</td>
                              <td>{text} &nbsp;&nbsp;&nbsp;({hour}시간 {min}분 {sec}초 전)</td>
                              <td className="text-right">{block.difficulty}</td>
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

export default RecentBlock