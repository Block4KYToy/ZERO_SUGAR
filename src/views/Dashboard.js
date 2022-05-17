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
import axios from "axios";
// react plugin used to create charts
import styled from 'styled-components';
import { Line, Bar } from "react-chartjs-2";


const Search = styled.div`
    /* .fix-bar {
        width: 100%;
        height: 20vh;
        display: flex;
        position: absolute;
    } */
    
    .searchbar {
        width: 100%;
        height: 7vh;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 3%;
        margin-bottom: 3%;
    }

    input {
        width: 80%;
        height: 100%;
        text-align: center;
        font-size: 2rem;
        font-weight: bolder;
        font-size: larger;
        background: white;
        letter-spacing: 20px;
        border: 3px solid white;
        border-radius: 5px;
    }
`
const Main = styled.div`
    .Big_container {
        margin: auto;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border: 5px solid white;
        border-radius: 5px;
        font-size: larger;
        width: 80%;
        height: 70vh;
    }

    .hash_container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        font-weight: bolder;
        letter-spacing: 5px;
        flex: 1;
        padding: 2%;
        background-color: white;
        width: 100%;
    }

    .middle_container {
        flex: 9;
        width: 100%;
    }

    .wrap_middle {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    

    .left-box, .right-box {
        line-height: 200%;
        padding: 2%;
        flex: 2;
    }

    .empty-box {
        line-height: 200%;
        padding: 2%;
        flex: 1;
    }

    .block-line{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .kindofblock {
        font-weight: bolder;
        color : #555;
    }

    .valueofblock {
        color : #555;
    }

    .wrap_bottm {
        display: flex;
        flex-direction: row;
        line-height: 250%;
        padding: 2%;
        /* border: 5px blue solid; */

    }

    .bottm{
        flex: 4.4;

    }
    .empty-box2 {
        flex: 1;
        /* background-color: blue; */
    }

    .empty-space {
        width: 100%;
        height: 7vh;
    }
`;

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  Button,
  Label,
  FormGroup,
  Input,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

import {
  dashboardPanelChart,
  dashboardShippedProductsChart,
  dashboardAllProductsChart,
  dashboard24HoursPerformanceChart,
} from "variables/charts copy.js";

const Dashboard = (event) => {
    // blockdata array
    const [TmArr, setTmArr] = useState([]); // unixtimestamp array
    const [realTmArr, setrealTmArr] = useState([]); // realtime array
    const [idLeng, setidLeng] = useState([]); // index num array
  
    var indexTime = async() => {

        const response = await axios.get(`http://localhost:4000/indexTime`)
        console.log("index : ", response.data[0][1].index)

        // 반복문을 통해서 timestamp 을 실제 시간으로 바꿔서 출력한다.
        for(let i = 0; i < 107; i++){
          Unix_timestamp(response.data[0][i].timestamp)
          console.log(Unix_timestamp(response.data[0][i].timestamp))
        }

        // unix timestamp -> real time
        function Unix_timestamp(t){
          var date = new Date(t*1000);
          // var year = date.getFullYear();
          // var month = "0" + (date.getMonth()+1);
          // var day = "0" + date.getDate();
          // var hour = "0" + date.getHours();
          var minute = "0" + date.getMinutes();
          var second = "0" + date.getSeconds();
          // return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
          return minute.substr(-2) + ":" + second.substr(-2);
        }
        // console.log("response is : ",response.data[[0]])

        // blockdata in array
        // data: [24, 27, 12, 8, 6, 7, 8, 3, 3, 5, 1, 3],
        let timestamp = [];
        let data = response.data[0];
        let unixT = [Unix_timestamp(data[1].timestamp)];
        console.log("unixT : ", unixT)

        for(let i = 0; i < 107; i++) {
            // for(let j = 0; j < 25; j++){
              // let unixT = [Unix_timestamp(data[0].timestamp)];
              // 1번째 배열 24
              if (i <= 24 && i > 1) { unixT.push(Unix_timestamp(data[i].timestamp))}
              if (i == 24) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[25].timestamp)]}  
              // 2번째 배열 27
              if (i <= 51 && i > 24) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 51) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[52].timestamp)]}
              // 3번째 배열 12
              if (i <= 63 && i > 51) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 63) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[64].timestamp)]} 
              // 4번째 배열 8
              if (i <= 71 && i > 63) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 71) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[72].timestamp)]}
              // 5번째 배열 6
              if (i <= 77 && i > 71) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 77) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[78].timestamp)]}
              // 6번째 배열 7
              if (i <= 84 && i > 77) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 84) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[85].timestamp)]}
              // 7번째 배열 8
              if (i <= 92 && i > 84) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 92) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[93].timestamp)]}
              // 8번째 배열 3
              if (i <= 95 && i > 92) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 95) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[96].timestamp)]}
              // 9번째 배열 3
              if (i <= 98 && i > 95) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 98) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[99].timestamp)]}
              // 10번째 배열 5
              if (i <= 103 && i > 98) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 103) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[104].timestamp)]}
              // 11번째 배열 1
              if (i <= 105 && i > 103) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 105) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[106].timestamp)]}
              // 12번째 배열 3
              if (i <= 106 && i > 105) { unixT.push(Unix_timestamp(data[i].timestamp));}
              if (i == 106) { timestamp.push(unixT);
                unixT = [Unix_timestamp(data[0].timestamp)]}
            }
            for(let j = 0; j < 12; j++)
            {
              setrealTmArr(realTmArr => [...realTmArr, timestamp[j][0]])
              setidLeng(idLeng => [...idLeng, timestamp[j].length]) 
            }
              //   console.log([Unix_timestamp(data[0].timestamp)] + [Unix_timestamp(data[i].timestamp)]);
              // timestamp.push([Unix_timestamp(data[0][0].timestamp)] + [Unix_timestamp(data[i].timestamp)]);
              // let times = timestamp[timestamp.length - 1]
              // console.log(times)
              // let timestampFilter = [...new Set(timestamp)];
              // console.log(timestampFilter)
              // // let timestampFilter = timestamp.filter((element) => element !== '35:36')
              // setTmArr(TmArr => [...TmArr, (response.data[0][0].timestamp)])
            
        console.log(unixT)
        console.log("timestamp[0] : ", timestamp[0][0])
        console.log(timestamp[1])
        console.log(timestamp[2])
        console.log(timestamp[3])
        console.log(timestamp[4])
        console.log(timestamp[5])
        console.log(timestamp[6])
        console.log(timestamp[7])
        console.log(timestamp[8])
        console.log(timestamp[9])
        console.log(timestamp[10])
        console.log(timestamp[11])
        }
        console.log(realTmArr[0])
        
        // console.log("realTmArr : ", realTmArr)
        
    const dashboardPanelChart = {

  
      data: (canvas) => {
        const ctx = canvas.getContext("2d");
        var chartColor = "#FFFFFF";
        var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
        gradientStroke.addColorStop(0, "#80b6f4");
        gradientStroke.addColorStop(1, chartColor);
        var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
        gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
        gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.14)");
        // console.log(realTmArr[1])
        return {
          labels: [
            `${realTmArr[0]}`,
            `${realTmArr[1]}`,
            `${realTmArr[2]}`,
            `${realTmArr[3]}`,
            `${realTmArr[4]}`,
            `${realTmArr[5]}`,
            `${realTmArr[6]}`,
            `${realTmArr[7]}`,
            `${realTmArr[8]}`,
            `${realTmArr[9]}`,
            `${realTmArr[10]}`,
            `${realTmArr[11]}`,
          ],
          datasets: [
            {
              label: "Data",
              borderColor: chartColor,
              pointBorderColor: chartColor,
              pointBackgroundColor: "#2c2c2c",
              pointHoverBackgroundColor: "#2c2c2c",
              pointHoverBorderColor: chartColor,
              pointBorderWidth: 1,
              pointHoverRadius: 7,
              pointHoverBorderWidth: 2,
              pointRadius: 5,
              fill: true,
              backgroundColor: gradientFill,
              borderWidth: 2,
              tension: 0.38,
              data: [0,`${idLeng[0]}`, `${idLeng[1]}`, `${idLeng[2]}`, `${idLeng[3]}`, `${idLeng[4]}`
              , `${idLeng[5]}`, `${idLeng[6]}`, `${idLeng[7]}`, `${idLeng[8]}`, `${idLeng[9]}`,
              `${idLeng[10]}` 
            ],
            },
          ],
        };
      },
      options: {
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 0,
            bottom: 0,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltips: {
            backgroundColor: "#fff",
            titleFontColor: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
          },
        },
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              fontColor: "rgba(255,255,255,0.4)",
              fontStyle: "bold",
              beginAtZero: true,
              maxTicksLimit: 5,
              padding: 10,
            },
            grid: {
              drawTicks: true,
              drawBorder: false,
              display: true,
              color: "rgba(255,255,255,0.1)",
              zeroLineColor: "transparent",
            },
          },
          x: {
            grid: {
              display: false,
              color: "rgba(255,255,255,0.1)",
            },
            ticks: {
              padding: 10,
              fontColor: "rgba(255,255,255,0.4)",
              fontStyle: "bold",
            },
          },
        },
      },
    };
    useEffect(() => {
      setTimeout(() => {
        indexTime();
      }, 30);
    },[]);
  
  const [allData,setAllData] = useState([]);
  const [filteredData,setFilteredData] = useState(allData);

  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
        // console.log(value);
        if (value!=="") {
        result = allData.filter((data) => {
            return data.index == Number(value);
        });
    }
    setFilteredData(result);
}

useEffect(() => {
    axios.get('http://localhost:4000/admin/dashBoard')
    .then((res) => {
        // console.log(res.data)
        setAllData(res.data)
        setFilteredData(res.data)
        // setAllData(res.data)

    })
    }, []);

  return (
    <>
      <PanelHeader
        size="lg"
        content={
          <Line
            data={dashboardPanelChart.data}
            options={dashboardPanelChart.options}
          />
        }
      />
      <div className="content">
                    <div className='fix-bar'>
                        <div className='searchbar'>
                            <input type="text" onChange={(event) => handleSearch(event)} placeholder="INPUT THE HEIGHT NUMBER OF BLOCK !" />
                        </div>
                    </div>
                    <div>{ filteredData.length > 0 ?
                    filteredData[0].map((value,index)=>{
                    return(
                            <div key={value.index} >
                                <div className='Big_container' >
                                    <div className='middle_container'>
                                        <div className='wrap_middle'>
                                            <div className='left-box'>
                                            </div>
                                            <div className='empty-box'> </div>
                                            <div className='right-box'>
                                                <div className='block-line'>
                                                    <span className='kindofblock'>index :</span>
                                                    <span className='valueofblock'>{value.index}</span>
                                                </div>
                                                <div className='block-line'>
                                                    <span className='kindofblock'>data :</span>
                                                    <span className='valueofblock'>v{value.data}</span>
                                                </div>
                                                <div className='block-line'>
                                                    <span className='kindofblock'>timestamp :</span>
                                                    <span className='valueofblock'>{value.timestamp}</span>
                                                </div>
                                                <div className='block-line'>
                                                    <span className='kindofblock'>hash :</span>
                                                    <span className='valueofblock'>{value.hash}</span>
                                                </div>
                                                <div className='block-line'>
                                                    <span className='kindofblock'>previousHash :</span>
                                                    <span className='valueofblock'>{value.previousHash}</span>
                                                </div>
                                                <div className='block-line'>
                                                    <span className='kindofblock'>difficulty :</span>
                                                    <span className='valueofblock'>{value.difficulty}</span>
                                                </div>
                                            </div>
                                            <div className='empty-box'> </div>

                                        </div >
                                    </div>
                                </div>

                                <div className="empty-space"></div>

                            </div>
                        
                    )
                    
                  })
                  : null
                }
                </div>
        {/* <Row>

          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <h5 className="card-category"></h5>
                <CardTitle tag="h4">SugarFCoin Table</CardTitle>
              </CardHeader>
              <CardBody>
                
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Block number</th>
                      <th>Timestamp</th>
                      <th>Hash</th>
                      <th className="text-right">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-right">$36,738</td>
                    </tr>
                    <tr>
                      <td>Minerva Hooper</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                      <td className="text-right">$23,789</td>
                    </tr>
                    <tr>
                      <td>Sage Rodriguez</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                      <td className="text-right">$56,142</td>
                    </tr>
                    <tr>
                      <td>Doris Greene</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                      <td className="text-right">$63,542</td>
                    </tr>
                    <tr>
                      <td>Mason Porter</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                      <td className="text-right">$78,615</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
      </div>
    </>
  );
}

export default Dashboard;
