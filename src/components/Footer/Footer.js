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
import { Container } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

function Footer(props) {
  return (
    <footer className={"footer" + (props.default ? " footer-default" : "")}>
      <Container fluid={props.fluid ? true : false}>
        <nav>
          <ul className="footer-text">
            <li>
              <a
                href="/"
              >
                ZERO SUGAR COMPANY
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Block4KYToy/ZERO_SUGAR"
                target="_blank"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="https://www.notion.so/d1d897559ce446d8ade0bdcd2a580be1?v=d0e83f0f3d2644c3b5c19f74d91ddf76"
                target="_blank"
              >
                Blog
              </a>
            </li>
          </ul>
        </nav>
        <div className="copyright">
          &copy; {1900 + new Date().getYear()}, Designed by{" "}
            Invision
          . Coded by{" "}
          <a
            href="https://github.com/Block4KYToy/ZERO_SUGAR"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zero Sugar Company
          </a>
          .
        </div>
      </Container>
    </footer>
  );
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
