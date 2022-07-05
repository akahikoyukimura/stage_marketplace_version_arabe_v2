import React, { Component } from 'react';

class HomeCommande extends Component {
    constructor() {
        super();
        // let redirect = false;
        this.state = {
          Annonces: [
            {
              Nboucle: "122554",
              prix: "3100 Dh",
              Race: "Sardi",
              poids: "58kg",
              Eleveur: "Mohamed Erraji",
              image: "Images/Sardi3.jpg",
              client:"mohamed talmssi",
              avance:"400dh"
            },
            {
              Nboucle: "122554",
              prix: "3100 Dh",
              Race: "Sardi",
              poids: "58kg",
              Eleveur: "Mohamed Erraji",
              image: "Images/Sardi1.jpg",
              client:"khalid lmnassfi",
              avance:"400dh"
            },
            {
              Nboucle: "122554",
              prix: "3100 Dh",
              Race: "Sardi",
              poids: "58kg",
              Eleveur: "Mohamed Erraji",
              image: "Images/Sardi2.jpg",
              client:"ilyass eddahmani",
              avance:"400dh"
            },
            {
              Nboucle: "122554",
              prix: "3100",
              Race: "Sardi",
              poids: "58kg",
              Eleveur: "Mohamed Erraji",
              image: "Images/Sardi2.jpg",
              client:"khalid lmnassfi",
              avance:"400dh"
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
                {this.state.Annonces.map((Annonces) => (
                  <a href="#" className="latest-product__item col-lg-6">
                    <div className="latest-product__item__pic">
                      <img src={Annonces.image} alt="" />
                    </div>
                    <div className="latest-product__item__text col-lg-6 ">
                      <h6>
                        <b>Numéro de boucle {Annonces.Nboucle}</b>
                      </h6>
                      <h6>
                        <b>Prix</b>
                        {"         " + Annonces.prix +"         " } <b className="text-right">Race</b> {"         " + Annonces.Race}
                      </h6>
                      {/* <h6>
                        <b>Race</b>
                        {"         " + Annonces.Race}
                      </h6> */}
                      <h6>
                        <b>Poids</b>
                        {"         " + Annonces.poids +"         " }<b className="text-right">Avance</b>
                        {"         " + Annonces.avance}
                      </h6>
                      {/* <h6>
                        <b>Avvance</b>
                        {"         " + Annonces.avance}
                      </h6> */}
                      <h6>
                        <b>Eleveur</b> {Annonces.Eleveur}
                      </h6>
                      <h6>
                        <b>Client</b> {Annonces.client}
                      </h6>
                      <center>
                        <a className=" btn btn-success " href="/DetailsCommande">
                          {/* <i className="fa fa-wrench"></i> */}
                          Consulter
                        </a>

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

export default HomeCommande;