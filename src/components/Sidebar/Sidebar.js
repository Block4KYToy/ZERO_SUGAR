// 사이드바

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
/*eslint-disable*/
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import logo from "logo-white.svg";
import Login from "views/Login";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

var ps;

function Sidebar(props) {
  let history = useHistory();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  console.log("auth: ", auth);
  const sidebar = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "inactive";
  };

  const logoutHandler = () => {
      // console.log('hi');
      sessionStorage.clear();
      dispatch({type: "USER_LOGOUT"});
      // setAuth(false);
      history.push('/admin');
  }
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  return (
    <div className="sidebar" data-color={props.backgroundColor}>
      <div className="logo">
        <a
          href="http://localhost:3000/admin/dashboard"
          className="simple-text logo-mini"
          // target="_blank"
        >
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
        <a
          href="http://localhost:3000/admin/dashboard"
          className="simple-text logo-normal"
          // target="_blank"
        >
          Zero Sugar
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            let authPage = ["Signup", "Login"]
            if (prop.redirect || prop.name === "Table List") return null;
            // console.log(prop.name)
            if ((authPage.includes(prop.name) && auth) 
              || (!auth && prop.name==="Logout")
              || (!auth && prop.name==="User Profile")) {
              return null;
            }

            if (prop.name === "Logout") {
              return (
                <li
                  className={
                    activeRoute(prop.layout + prop.path) +
                    (prop.pro ? " active active-pro" : "")
                  }
                  onClick={() => {logoutHandler()}}
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                    props={props}
                  >
                    <i className={"now-ui-icons " + prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            }
            return (
              <li
                className={
                  activeRoute(prop.layout + prop.path) +
                  (prop.pro ? " active active-pro" : "")
                }
                key={key}
              >
                <NavLink
                  to={prop.layout + prop.path}
                  className="nav-link"
                  activeClassName="active"
                  props={props}
                >
                  <i className={"now-ui-icons " + prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;