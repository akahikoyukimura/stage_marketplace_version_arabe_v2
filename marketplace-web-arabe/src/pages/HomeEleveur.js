import React, { Component } from 'react';

class HomeEleveur extends Component {
    constructor() {
        super();
        // let redirect = false;
        this.state = {
          Eleveurs: [
            {
              Nom: "Mohamed Rachidi ",
              Adresse: "112, Sidi Moussa ,Oujda",
              Tele: "0601234568",
              image: "Images/Eleveur.jpg",
             
            },
            {
              Nom: "Mohamed Rachidi ",
              Adresse: "112, Sidi Moussa ,Oujda",
              Tele: "0601234568",
              image: "Images/Eleveur.jpg",
             
            },
            {
              Nom: "Mohamed Rachidi ",
              Adresse: "112, Sidi Moussa ,Oujda",
              Tele: "0601234568",
              image: "Images/Eleveur.jpg",
             
            },
           
          ],
          redirect: false,
        };
      }


    render() {
        return (
            <div>
             
                {/* <div className="featured__controls"> */}
                <section className="hero">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-9">
                        <div className="hero__search">
                          <div className="hero__search__form">
                            <form action="#">
                              <div className="hero__search__categories">
                                éleveur
                                <span className="arrow_carrot-down"></span>
                              </div>
                              <input
                                type="text"
                                placeholder=""
                              />
                              <button type="submit" className="site-btn">
                                CHERCHER
                              </button>
                            </form>
                          </div>
                          {/* <div className="hero__search__phone">
                              <div className="hero__search__phone__text"></div>
                            </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </section> 
                <section className="categories">
          <div className="container">
            <div className="row">
              <div className="categories__slider owl-carousel ">
                {this.state.Eleveurs.map((Eleveurs) => (
                  <a href="#" className="latest-product__item col-lg-6">
                    <div className="latest-product__item__pic">
                      <img src={Eleveurs.image} alt="" />
                    </div>
                    <div className="latest-product__item__text col-lg-6 ">
                      
                      <h6>
                        <b>Nom </b>
                        {"         " + Eleveurs.Nom +"         " } 
                      </h6>
                      
                      <h6>
                        <b>Adresse</b>
                        {"         " + Eleveurs.Adresse +"         " }
                      </h6>
                     
                      <h6>
                        <b>Télépphone</b> {Eleveurs.Tele}
                      </h6>
                    
                      
                      <center>
                        <button className="btn btn-success ">
                          <i className="fa fa-wrench"></i>
                        </button>
                        {"                   "}
                        <button href="#" className="btn btn-danger">
                          <i className="fa fa-trash"></i>
                        </button>
                      </center>

                      
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

            </div>
        );
    }
}

export default HomeEleveur;