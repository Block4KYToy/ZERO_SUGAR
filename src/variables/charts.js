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
// ##############################
// // // Function that converts a hex color number to a RGB color number
// #############################
import { useEffect, useState } from 'react';
import axios from "axios"


// ====================================================================================
function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

// ##############################
// // // general variables for charts
// #############################

const chartColor = "#FFFFFF";

// General configuration for the charts with Line gradientStroke
const gradientChartOptionsConfiguration = {
  
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltips: {
      bodySpacing: 4,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
      xPadding: 10,
      yPadding: 10,
      caretPadding: 10,
    },
  },
  responsive: 1,
  scales: {
    y: {
      display: 0,
      ticks: {
        display: false,
        maxTicksLimit: 7,
      },
      grid: {
        zeroLineColor: "transparent",
        drawTicks: false,
        display: false,
        drawBorder: false,
      },
    },
    x: {
      display: 0,
      ticks: {
        display: false,
      },
      grid: {
        zeroLineColor: "transparent",
        drawTicks: false,
        display: false,
        drawBorder: false,
      },
    },
  },
  layout: {
    padding: { left: 0, right: 0, top: 15, bottom: 15 },
  },
};

var gradientChartOptionsConfigurationWithNumbersAndGrid = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltips: {
      bodySpacing: 4,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
      xPadding: 10,
      yPadding: 10,
      caretPadding: 10,
    },
  },
  responsive: 1,
  scales: {
    y: {
      grid: {
        zeroLineColor: "transparent",
        drawBorder: false,
      },
      ticks: {
        maxTicksLimit: 7,
      },
    },
    x: {
      display: 0,
      ticks: {
        display: false,
      },
      grid: {
        zeroLineColor: "transparent",
        drawTicks: false,
        display: false,
        drawBorder: false,
      },
    },
  },
  layout: {
    padding: { left: 0, right: 0, top: 15, bottom: 15 },
  },
};

// ##############################
// // // Dashboard view - Panel chart =======================================================
// #############################

const dashboardPanelChart = {
    say() { 
    
    // blockdata array
      const [TmArr, setTmArr] = useState([]); // unixtimestamp array
      const [realTmArr, setrealTmArr] = useState([]); // realtime array
      const [idLeng, setidLeng] = useState([]); // index num array
    
      var indexTime = async() => {
          const response = await axios.get(`http://localhost:4000/indexTime`)
          // console.log("index : ", response.data[0][1].index)
  
          // 반복문을 통해서 timestamp 을 실제 시간으로 바꿔서 출력한다.
          for(let i = 0; i < 107; i++){
            Unix_timestamp(response.data[0][i].timestamp)
            // console.log(Unix_timestamp(response.data[0][i].timestamp))
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
    
    
    
          for(let i = 0; i < 107; i++){
            // blockdata in array
            setTmArr(TmArr => [...TmArr, response.data[0][0].timestamp])
            setrealTmArr(realTmArr => [...realTmArr, Unix_timestamp(response.data[0][0].timestamp)])
            setidLeng(idLeng => [...idLeng, response.data[0][0].index])
    
          }
          
    
    
        
  
      }
      
      useEffect(() => {
        setTimeout(() => {
          indexTime();
        }, 3000);
      },[]);
    
      // console.log("txArray is  what?", txArray)
      // console.log("txNum is what?", txNum)
      
      // console.log("allData is every data of each block : ", allData)
      // console.log("TmArr is array of unixtimestamp : ", TmArr)
      // console.log("realTmArr is array of realTime : ", realTmArr)
      // console.log("idLeng is array of transaction number : ", idLeng)
    
    
      let idNumSum0 = 0;
      let idNumSum1 = 0;
      let idNumSum2 = 0;
      let idNumSum3 = 0;
      let idNumSum4 = 0;
      let idNumSum5 = 0;
      let idNumSum6 = 0;
      let idNumSum7 = 0;
      let idNumSum8 = 0;
      let idNumSum9 = 0;
      let idNumSum10 = 0;
      let idNumSum11 = 0;
    
      for(let i = 0; i < 107; i ++){
        if(TmArr[i] < TmArr[25]){
          idNumSum0 = idLeng[i]
        } else if(TmArr[25] < TmArr[i] && TmArr[i] < TmArr[52]) {
          idNumSum1 = idLeng[i]
        } else if(TmArr[52] < TmArr[i] && TmArr[i] < TmArr[64]) {
          idNumSum2 = idLeng[i]
        } else if(TmArr[64] < TmArr[i] && TmArr[i] < TmArr[72]) {
          idNumSum3 = idLeng[i]
        } else if(TmArr[72] < TmArr[i] && TmArr[i] < TmArr[78]) {
          idNumSum4 = idLeng[i]
        } else if(TmArr[78] < TmArr[i] && TmArr[i] < TmArr[85]) {
          idNumSum5 = idLeng[i]
        } else if(TmArr[85] < TmArr[i] && TmArr[i] < TmArr[93]) {
          idNumSum6 = idLeng[i]
        } else if(TmArr[93] < TmArr[i] && TmArr[i] < TmArr[96]) {
          idNumSum7 = idLeng[i]
        } else if(TmArr[96] < TmArr[i] && TmArr[i] < TmArr[99]) {
          idNumSum8 = idLeng[i]
        } else if(TmArr[99] < TmArr[i] && TmArr[i] < TmArr[104]) {
          idNumSum9 = idLeng[i]
        } else if(TmArr[104] < TmArr[i] && TmArr[i] <= TmArr[105]) {
          idNumSum10 = idLeng[i]
        } else if(TmArr[105] < TmArr[i] && TmArr[i] <= TmArr[106]) {
          idNumSum11 = idLeng[i]
        }
        
      }
  
  
    // console.log("==============txNum0===========", idNumSum0)
    // console.log("==============txNum1===========", idNumSum1)
    // console.log("==============txNum2===========", idNumSum2)
    // console.log("==============txNum3===========", idNumSum3)
    // console.log("==============txNum4===========", idNumSum4)
    // console.log("==============txNum5===========", idNumSum5)
    // console.log("==============txNum6===========", idNumSum6)
    // console.log("==============txNum7===========", idNumSum7)
  
    const data = [
      createData(realTmArr[0], idNumSum0),
      createData(realTmArr[1], idNumSum1),
      createData(realTmArr[8], idNumSum2),
      createData(realTmArr[13], idNumSum3),
      createData(realTmArr[17], idNumSum4),
      createData(realTmArr[25], idNumSum5),
      createData(realTmArr[31], idNumSum6),
      createData(realTmArr[45], idNumSum7),
      createData(realTmArr[45], idNumSum8),
      createData(realTmArr[45], idNumSum9),
      createData(realTmArr[45], idNumSum10),
      createData(realTmArr[45], idNumSum11)
    ];
  },
  data: (canvas) => {
    const ctx = canvas.getContext("2d");
    var chartColor = "#FFFFFF";
    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#80b6f4");
    gradientStroke.addColorStop(1, chartColor);
    var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.14)");
    return {
      labels: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
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
          tension: 0.4,
          data: [50, 150, 100, 190, 130, 90, 150, 160, 120, 140, 190, 95],
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

// ##############################
// // // Dashboard view - Shipped Products - Card
// #############################

const dashboardShippedProductsChart = {
  data: (canvas) => {
    var ctx = canvas.getContext("2d");
    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#80b6f4");
    gradientStroke.addColorStop(1, chartColor);
    var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");
    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Active Users",
          borderColor: "#f96332",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#f96332",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          tension: 0.4,
          data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630],
        },
      ],
    };
  },
  options: gradientChartOptionsConfiguration,
};

// ##############################
// // // Dashboard view - All Products - Card
// #############################

const dashboardAllProductsChart = {
  data: (canvas) => {
    var ctx = canvas.getContext("2d");
    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#18ce0f");
    gradientStroke.addColorStop(1, chartColor);
    var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB("#18ce0f", 0.4));
    return {
      labels: ["12pm,", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"],
      datasets: [
        {
          label: "Email Stats",
          borderColor: "#18ce0f",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#18ce0f",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          tension: 0.4,
          data: [40, 500, 650, 700, 1200, 1250, 1300, 1900],
        },
      ],
    };
  },
  options: gradientChartOptionsConfigurationWithNumbersAndGrid,
};

// ##############################
// // // Dashboard view - Bar Chart - Card
// #############################

const dashboard24HoursPerformanceChart = {
  data: (canvas) => {
    var ctx = canvas.getContext("2d");
    var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB("#2CA8FF", 0.6));
    return {
      labels: [
        "36 : 38",
        "39 : 41",
        "42 : 44",
        "45 : 47",
        "48 : 50",
        "51 : 53",
        "54 : 56",
        "57 : 59",
        "00 : 02",
        "03 : 05",
        "06 : 08",
        "09 : 11",
      ],
      datasets: [
        {
          label: "Active Countries",
          backgroundColor: gradientFill,
          borderColor: "#2CA8FF",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#2CA8FF",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          borderWidth: 1,
          data: [24, 27, 12, 8, 6, 7, 8, 3, 3, 5, 1, 3],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
      },
    },
    responsive: 1,
    scales: {
      y: {
        ticks: {
          maxTicksLimit: 7,
        },
        grid: {
          zeroLineColor: "transparent",
          drawBorder: false,
        },
      },
      x: {
        display: 0,
        ticks: {
          display: false,
        },
        grid: {
          zeroLineColor: "transparent",
          drawTicks: false,
          display: false,
          drawBorder: false,
        },
      },
    },
    layout: {
      padding: { left: 0, right: 0, top: 15, bottom: 15 },
    },
  },
};

export {
  dashboardPanelChart, // Chart for Dashboard view - Will be rendered in panel
  dashboardShippedProductsChart, // Chart for Dashboard view - Shipped Products Card
  dashboardAllProductsChart, // Chart for Dashboard view - All products Card
  dashboard24HoursPerformanceChart, // Chart for Dashboard view - 24 Hours Performance Card
};
