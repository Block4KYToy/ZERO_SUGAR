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
import WalletIcon from "../../views/WalletIcon";
import { useSelector, useDispatch } from "react-redux";
import Modal from "views/Modal";

function PanelHeader(props) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  // console.log("auth: ", auth);
  // console.log('panel: ', props);
  const modalState = useSelector((state) => state.modalState);

  const modalOpen = () => {
    if (modalState) dispatch({type: "MODAL_CLOSE"});
    else dispatch({type: "MODAL_OPEN"})
    // console.log(modalstate);
  }

  return (
    <div
      className={
        "panel-header " +
        (props.size !== undefined ? "panel-header-" + props.size : "")
      }
    >
      {props.content}
      {auth ? 
      <>
          <WalletIcon modalOpen={modalOpen} />
      </>      
      : null
      }
    </div>
  );
}

export default PanelHeader;
