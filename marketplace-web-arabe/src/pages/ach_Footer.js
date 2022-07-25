import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="footer-distributed">
        <div className="footer-left">
          <img
            style={{ height: "40px" }}
            src={require("./Images/logo-text.png")}
            alt=""
          />
          <p className="footer-company-name">anoc &copy; 2021</p>
        </div>

        <div className="footer-center">
          <div>
            <i className="fa fa-map-marker"></i>
            <p>
              <span>Résidence Meriem, Avenue Hassan II</span> Rabat, Maroc
            </p>
          </div>

          <div>
            <i className="fa fa-phone"></i>
            <p>05376-90802</p>
          </div>

          <div>
            <i className="fa fa-envelope"></i>
            <p>
              <a href="mailto:support@company.com">anoc@anoc.com</a>
            </p>
          </div>
        </div>

        <div className="footer-right">
          <p className="footer-company-about">
            <span>A propos</span>
            ASSOCIATION NATIONALE DES ÉLEVEURS OVINS ET CAPRINS
          </p>

          <div className="footer-icons">
            <a href="https://www.facebook.com/Association.nationale.ovine.et.caprine/">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="http://www.anoc.ma/">
              <i className="fa fa-globe"></i>
            </a>
            <a href="https://www.youtube.com/channel/UCzX4064MubkoUVL1ecFDGpQ">
              <i className="fa fa-youtube"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
