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
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import '../assets/css/dashboard.css';
import axios from 'axios';
import RecentBlock from "./RecentBlock";
import RecentTransaction from "./RecentTransaction";

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
import SearchBar from "./SearchBar";

import {
  dashboardPanelChart,
  dashboardShippedProductsChart,
  dashboardAllProductsChart,
  dashboard24HoursPerformanceChart,
} from "variables/charts.js";

function Dashboard() {
  const [blocks, setBlocks] = useState(null);

  useEffect(() => {
    // GET ALL BLOCK DATAS
    // await axios.get("http://localhost:4000/blocks")
    // .then((res) => {
    //   console.log(res);
    //   let _blocks = res.data;
    //   // RECENT 10 BLOCK INFOS
    //   setBlocks(_blocks.slice(_blocks.length - 11))
    // })
  }, [])
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
        <SearchBar />
        <RecentBlock />
        <RecentTransaction />
      </div>
    </>
  );
}

export default Dashboard;
