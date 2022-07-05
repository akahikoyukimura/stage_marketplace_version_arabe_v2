import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <div  className="text-center"> 
        <footer className="footer spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer__widget">
                  <div className="footer__widget__social ">
                    <h6> SUIVEZ NOUS {"  "} </h6>
                    <a style={{height:"max-content"}} href="https://www.facebook.com/Association.nationale.ovine.et.caprine/">
                      <img src="/Images/facebook.png"/>
                    </a>
                    <a style={{height:"max-content"}} href="http://www.anoc.ma/">
                    <img src="/Images/site.png"/>
                    </a>
                    <a style={{height:"max-content"}} href="https://www.youtube.com/channel/UCzX4064MubkoUVL1ecFDGpQ">
                    <img src="/Images/youtube.png"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
         </div>
    );
  }
}

export default Footer;
