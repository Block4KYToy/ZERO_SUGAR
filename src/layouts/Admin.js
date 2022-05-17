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
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// reactstrap components
import { Route, Switch, Redirect, useLocation } from "react-router-dom";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";
import Login from "views/Login";

import { useDispatch, useSelector } from "react-redux";
import Modal from "views/Modal";

var ps;

function Admin(props) {
  // console.log("props: ", props);
  const auth = useSelector((state) => state.auth);
  const modalState = useSelector((state) => state.modalState);
  const dispatch = useDispatch();
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = React.useState("blue");
  const mainPanel = React.useRef();
  // const [auth, setAuth] = useState(false);

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
  }, [location]);
  // const handleColorClick = (color) => {
  //   setBackgroundColor(color);
  // };
  return (
    <div className="wrapper">
      <div className="auth-header"></div>
        <Sidebar {...props} routes={routes} backgroundColor={backgroundColor} />
        <div className="main-panel" ref={mainPanel}>
          {auth && modalState && <Modal />}
          <Switch>
            {routes.map((prop, key) => {
              if (prop.name === "Login") {
                return (
                  <Route 
                    path={prop.layout + prop.path}
                    // component={prop.component}
                    key={key} 
                    render={(props) => <Login {...props} />} />
                )
              }
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  // auth={auth} 
                  // setAuth={setAuth}
                  key={key} 
                />
              );
            })}
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <Footer fluid />
        </div>
        {/* <DemoNavbar {...props} /> */}
      {/* <FixedPlugin
        bgColor={backgroundColor}
        handleColorClick={handleColorClick}
      /> */}
    </div>
  );
}

export default Admin;
