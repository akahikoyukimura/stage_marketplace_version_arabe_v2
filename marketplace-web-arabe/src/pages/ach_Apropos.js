import React, { Component } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { FormattedMessage } from "react-intl";


const intl = JSON.parse(localStorage.getItem("intl"));

class Apropos extends Component {
  render() {
    const opts = {
      height: "390",
      width: "500",
    };
    return (
      <section className="product spad">
        <div id="apropos" className="container" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "right"}: {}}>
          <div className="col-lg-12 col-md-6" >
            <h2 id="aproposh"><FormattedMessage id="apropos_nous" /></h2> <br></br>
            <h5 id="apropo1">
            <FormattedMessage id="apropos_nous_description" />
            </h5>
            <br></br>
            <br></br>
            <h2 id="aproposh"><FormattedMessage id="apropos_objectif" /></h2> <br></br>
            <main >
              <ol className="gradient-list" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "right"}: {}}>
                <li >
                <FormattedMessage id="apropos_objectif1" />
                </li>
                <li>
                <FormattedMessage id="apropos_objectif2" />
                </li>
                <li>
                <FormattedMessage id="apropos_objectif3" />
                </li>
                <li><FormattedMessage id="apropos_objectif4" /></li>
                <li>
                <FormattedMessage id="apropos_objectif5" />
                </li>
                <li>
                <FormattedMessage id="apropos_objectif6" />
                </li>
                <li>
                <FormattedMessage id="apropos_objectif7" />
                </li>
              </ol>
            </main>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="row" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "right"}: {}}>
              <div className="col-lg-6 col-md-6">
                <YouTube videoId="WlKkq-p2oJE" opts={opts} />
              </div>
              <div className="col-lg-6 col-md-6">
                <YouTube videoId="spT3_hLoGVA" opts={opts} />
              </div>
            </div>
            <p></p>
            <p></p>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <YouTube videoId="8nw9TuE3vWw" opts={opts} />
              </div>
              <div className="col-lg-6 col-md-6">
                <YouTube videoId="Heq0JIjj8Po" opts={opts} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default Apropos;
