import React, { Component } from "react";
import axios from "axios";

//import menu_eleveur from '/public/Images/eleveurs.png'; // with import

class Espaces extends Component {
  render() {
    return (
      <center>
        <div>
          <section className="featured spad">
            <div className="container">
              {/*<!-- Categorie Menus Grid Section Begin --> */}
              <div className="row featured__filter">
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="featured__item">
                    <div
                      className="featured__item__pic set-bg"
                      data-setbg="Images/bg_bleu.jpg"
                    >
                      <center>
                        <br></br>
                        <img
                          src="Images/icon_agriculture.png"
                          width="120px"
                          height="120px"
                        />
                        <br></br>
                        <br></br>
                        <h6 style={{ color: "white" }}>
                          Vous êtes un <br></br> agriculteur ou une coopérative
                          ?{" "}
                        </h6>
                        {/*<img src={menu_eleveur} />*/}
                        <ul className="featured__item__pic__hover">
                          <li>
                            <a href="#">
                              <i className="fa fa-eye"></i>
                            </a>
                          </li>
                        </ul>
                      </center>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="featured__item">
                    <div
                      className="featured__item__pic set-bg"
                      data-setbg="Images/bg_orange.jpg"
                      padding-left="10px"
                      padding-right="10px"
                    >
                      <center>
                        <br></br>
                        <img
                          src="Images/icon_acheteur.png"
                          width="120px"
                          height="120px"
                        />
                        <br></br>
                        <br></br>
                        <h6 style={{ color: "white" }}>
                          Vous êtes un <br></br> acheteur ?{" "}
                        </h6>
                        {/*<img src={menu_eleveur} />*/}
                        <ul className="featured__item__pic__hover">
                          <li>
                            <a href="/ToutesLesAnnonces">
                              <i className="fa fa-eye"></i>
                            </a>
                          </li>
                        </ul>
                      </center>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="featured__item">
                    <div
                      className="featured__item__pic set-bg"
                      data-setbg="Images/bg_green.png"
                      padding-left="10px"
                      padding-right="10px"
                    >
                      <center>
                        <br></br>
                        <img
                          src="Images/icon_eleveur.png"
                          width="120px"
                          height="120px"
                        />
                        <br></br>
                        <br></br>
                        <h6 style={{ color: "white" }}>
                          Vous êtes un <br></br> eleveur ?{" "}
                        </h6>
                        {/*<img src={menu_eleveur} />*/}
                        <ul className="featured__item__pic__hover">
                          <li>
                            <a href="/ToutesLesAnnonces">
                              <i className="fa fa-eye"></i>
                            </a>
                          </li>
                        </ul>
                      </center>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="featured__item">
                    <div
                      className="featured__item__pic set-bg"
                      data-setbg="Images/bg_yellow.jpg"
                      padding-left="10px"
                      padding-right="10px"
                    >
                      <center>
                        <br></br>
                        <img
                          src="Images/icon_livreur.png"
                          width="120px"
                          height="120px"
                        />
                        <br></br>
                        <br></br>
                        <h6 style={{ color: "white" }}>
                          Vous êtes un <br></br> livreur ?{" "}
                        </h6>
                        {/*<img src={menu_eleveur} />*/}
                        <ul className="featured__item__pic__hover">
                          <li>
                            <a href="/ToutesLesAnnonces">
                              <i className="fa fa-eye"></i>
                            </a>
                          </li>
                        </ul>
                      </center>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="featured__item">
                    <div
                      className="featured__item__pic set-bg"
                      data-setbg="Images/bg_purple.jpg"
                      padding-left="10px"
                      padding-right="10px"
                    >
                      <center>
                        <br></br>
                        <img
                          src="Images/icon_boucher.png"
                          width="120px"
                          height="120px"
                        />
                        <br></br>
                        <br></br>
                        <h6 style={{ color: "white" }}>
                          Vous êtes un <br></br> boucher ?{" "}
                        </h6>
                        {/*<img src={menu_eleveur} />*/}
                        <ul className="featured__item__pic__hover">
                          <li>
                            <a href="/ToutesLesAnnonces">
                              <i className="fa fa-eye"></i>
                            </a>
                          </li>
                        </ul>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Categorie Menus Grid Section End --> */}
            </div>
          </section>
        </div>
      </center>
    );
  }
}

export default Espaces;
