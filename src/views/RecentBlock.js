import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table} from "reactstrap";

const RecentBlock = ({ allData, setAllData }) => {
  console.log(allData);
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
                    allData[0].map((block) => block.index > allData[0].length - 6 ?
                      <tr key={block.index}>
                        <td>{block.index}</td>
                        <td>{block.hash}</td>
                        <td>{block.timestamp}</td>
                        <td className="text-right">{block.difficulty}</td>
                      </tr>
                      : null
                    )
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