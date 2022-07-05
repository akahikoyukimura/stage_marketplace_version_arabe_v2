import React, { Component } from "react";

class DetailsEleveur extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      Eleveur: {
        
          Nom: "Mohamed Rachidi ",
          Adresse: "112, Sidi Moussa ,Oujda",
          Tele: "0601234568",
          image: "Images/Eleveur.jpg",
          CIN:"D12589",
          RIB:"434343434343"
         
        },
      

      redirect: false,
    };
  }
  render() {
    return (
      <div>
        <section class="product-details spad">
          <div class="container">
            <div className="row">
              <div class="col-lg-6 col-md-6">
                <div class="product__details__pic">
                  <div class="product__details__pic__item">
                    <img
                      class="product__details__pic__item--large"
                      src="Images/Eleveur.jpg"
                      alt=""
                    />
                  </div>
               
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="product__details__text">
                  <h3>Details éleveur </h3>
                  {/* <div className="product__details__rating">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star-half-o"></i>
                             <span>(18 reviews)</span> 
                        </div> */}
                  {/* <div class="product__details__price">
                    {this.state.Eleveur.prix}
                  </div> */}

                  {/* <div class="product__details__quantity">
                            <div class="quantity">
                                <div class="pro-qty">
                                    <input type="text" value="1"/>
                                </div>
                            </div>
                        </div>
                        <a href="#" class="primary-btn">ADD TO CARD</a>
                        <a href="#" class="heart-icon"><span class="icon_heart_alt"></span></a> */}
                  <ul>
                    <li>
                      <b>Nom</b> <span>{this.state.Eleveur.Nom}</span>
                    </li>
                    <li>
                      <b>Adresse</b> <span>{this.state.Eleveur.Adresse} </span>
                    </li>
                    <li>
                      <b>Numéro de Téléphone</b>{" "}
                      <span>{this.state.Eleveur.Tele}</span>
                    </li>
                    <li>
                      <b>CIN</b>
                      <span>{this.state.Eleveur.CIN}</span>
                    </li>
                    <li>
                      <b>Numéro de RIB</b>
                      <span>{this.state.Eleveur.RIB}</span>
                    </li>
                   <li className="text-center">
                     <button className="btn btn-danger ">Supprimer</button> {"           "} <button className="btn btn-success center">Modifier</button>
                   </li>
                   
                  </ul>
                </div>
              </div>
             
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default DetailsEleveur;
