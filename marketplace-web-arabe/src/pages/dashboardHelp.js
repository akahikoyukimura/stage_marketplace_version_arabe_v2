import React, { Component } from "react";
import { Link } from "react-router-dom";
import "bootstrap-less";
require("bootstrap-less/bootstrap/bootstrap.less");

class DashboardHelp extends Component {
  render() {
    return (
      <section className="product spad">
        <div id="apropos" className="container">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              className="item"
              id="commandeannuler"
              style={{ display: "flex", flexDirection: "row", margin: "10px" }}
            >
              <div className="item" style={{ flexBasis: "20%" }}>
                <img
                  src="./Images/commandeannuler.png"
                  alt="avanceapayer"
                  width="150px"
                  height="150px"
                  style={{ borderRadius: "15px" }}
                />
              </div>
              <div
                className="item  "
                style={{
                  flexBasis: "80%",
                  width: "150px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ marginTop: "50px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris bibendum nisi ut tortor dictum, id interdum orci
                  fermentum. Pellentesque dictum euismod dignissim.{" "}
                </h6>
              </div>
            </div>
            <div
              className="item"
              id="avanceapayer"
              style={{ display: "flex", flexDirection: "row", margin: "10px" }}
            >
              <div className="item" style={{ flexBasis: "20%" }}>
                <img
                  src="./Images/avanceapayer.png"
                  alt="avanceapayer"
                  width="150px"
                  height="150px"
                  style={{ borderRadius: "15px" }}
                />
              </div>
              <div
                className="item  "
                style={{
                  flexBasis: "80%",
                  width: "150px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ marginTop: "50px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris bibendum nisi ut tortor dictum, id interdum orci
                  fermentum. Pellentesque dictum euismod dignissim.{" "}
                </h6>
              </div>
            </div>
            <div
              className="item"
              id="produitreserve"
              style={{ display: "flex", flexDirection: "row", margin: "10px" }}
            >
              <div className="item" style={{ flexBasis: "20%" }}>
                <img
                  src="./Images/produitreserve.png"
                  alt="avanceapayer"
                  width="150px"
                  height="150px"
                  style={{ borderRadius: "15px" }}
                />
              </div>
              <div
                className="item  "
                style={{
                  flexBasis: "80%",
                  width: "150px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ marginTop: "50px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris bibendum nisi ut tortor dictum, id interdum orci
                  fermentum. Pellentesque dictum euismod dignissim.{" "}
                </h6>
              </div>
            </div>
            <div
              className="item"
              id="resteapayer"
              style={{ display: "flex", flexDirection: "row", margin: "10px" }}
            >
              <div className="item" style={{ flexBasis: "20%" }}>
                <img
                  src="./Images/resteapayer.png"
                  alt="resteapayer"
                  width="150px"
                  height="150px"
                  style={{ borderRadius: "15px" }}
                />
              </div>
              <div
                className="item  "
                style={{
                  flexBasis: "80%",
                  width: "150px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ marginTop: "50px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris bibendum nisi ut tortor dictum, id interdum orci
                  fermentum. Pellentesque dictum euismod dignissim.{" "}
                </h6>
              </div>
            </div>
            <div
              className="item"
              id="produitalivrer"
              style={{ display: "flex", flexDirection: "row", margin: "10px" }}
            >
              <div className="item" style={{ flexBasis: "20%" }}>
                <img
                  src="./Images/produitalivrer.png"
                  alt="produitalivrer"
                  width="150px"
                  height="150px"
                  style={{ borderRadius: "15px" }}
                />
              </div>
              <div
                className="item  "
                style={{
                  flexBasis: "80%",
                  width: "150px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ marginTop: "50px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris bibendum nisi ut tortor dictum, id interdum orci
                  fermentum. Pellentesque dictum euismod dignissim.{" "}
                </h6>
              </div>
            </div>
            <div
              className="item"
              id="cashpayer"
              style={{ display: "flex", flexDirection: "row", margin: "10px" }}
            >
              <div className="item" style={{ flexBasis: "20%" }}>
                <img
                  src="./Images/cashapayer.png"
                  alt="cashpayer"
                  width="150px"
                  height="150px"
                  style={{ borderRadius: "15px" }}
                />
              </div>
              <div
                className="item  "
                style={{
                  flexBasis: "80%",
                  width: "150px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ marginTop: "50px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris bibendum nisi ut tortor dictum, id interdum orci
                  fermentum. Pellentesque dictum euismod dignissim.{" "}
                </h6>
              </div>
            </div>
            <div
              className="item"
              id="casheffectuer"
              style={{ display: "flex", flexDirection: "row", margin: "10px" }}
            >
              <div className="item" style={{ flexBasis: "20%" }}>
                <img
                  src="./Images/casheffectuer.png"
                  alt="casheffectuer"
                  width="150px"
                  height="150px"
                  style={{ borderRadius: "15px" }}
                />
              </div>
              <div
                className="item  "
                style={{
                  flexBasis: "80%",
                  width: "150px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ marginTop: "50px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris bibendum nisi ut tortor dictum, id interdum orci
                  fermentum. Pellentesque dictum euismod dignissim.{" "}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default DashboardHelp;
