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
import WalletIcon from "../../views/WalletIcon";
import { useSelector } from "react-redux";

function PanelHeader(props) {
  const auth = useSelector((state) => state.auth);
  console.log("auth: ", auth);
  // console.log('panel: ', props);
  return (
    <div
      className={
        "panel-header " +
        (props.size !== undefined ? "panel-header-" + props.size : "")
      }
    >
      {props.content}
      {auth  
      ? <WalletIcon />
      : null
      }
    </div>
  );
}

export default PanelHeader;
