import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import Commander3 from "./step3";

import { Link } from "react-router-dom";
class Commander2 extends Component {
  constructor(props) {
    super(props);
    // let redirect = false;

    // this.onChange = this.onChange.bind(this);
  }

  // onChange(e) {

  //   const token = localStorage.getItem("usertoken");
  //   // if
  //   // console.log("tuseroken"+ token)
  //   let cmd = {
  //     // localisation: e.target.value,
  //     point_relais: e.target.value,
  //     id_mouton: this.props.location.state.id,
  //     id_eleveur: this.state.eleveur._id,
  //     id_consommateur: token,
  //     statut: "en attente de paiement avance",
  //     reçu_avance: "",
  //     feedback_avance: "",
  //     msg_refus_avance: null,
  //     reçu_montant_restant: null,
  //     feedback_reçu_montant_restant: null,
  //     msg_refus_reste: null,
  //     date_creation: new Date(),
  //     // .toLocaleString()
  //   };
  //   this.setState({
  //     Commande: cmd,
  //     Empty:false
  //   });
  // }

  render() {
    let resultat = this.props.validation();
    /*(
      ((this.props.data.date == null && this.props.data.occasion == "aid")||
        (this.props.data.date != null && this.props.data.occasion != "aid"))
       && (this.props.data.check1 || (this.props.data.check2 && this.props.data.selectedOptionVille != "" && this.props.data.selectedOptionPoint != "") || (this.props.data.check3 && this.props.data.selectedOptionVille != "" && this.props.data.adresse != ""))) 
       ?
      this.props.data.check2 || this.props.data.check3 ? this.props.data.livraison.find((f) => f.Ville_livraison == this.props.data.selectedOptionVille.value).prix_transport : 0 : null;
    */ return (
      <div>
        <div className="container">
          <div className="product-details spad">
            {resultat[0] != false ? (
              <div
                id="centrer"
                className="col-lg-12 col-md-6"
                style={{
                  paddingBottom: "1em",
                  padding: "2em",
                  borderRadius: "50px 50px 50px 50px",
                }}
              >
                <br></br>

                <h3>Montant à payer : </h3>
                <div className="shoping__checkout mt-2 pb-0">
                  <ul className="mb-0">
                    <li>
                      Prix net <span>{this.props.data.prix} Dhs</span>
                    </li>
                    <li
                      style={{
                        borderBottomStyle: "dashed",
                        borderColor: "black",
                      }}
                    >
                      Prix Transport <span>{resultat[1]} Dhs </span>
                    </li>
                    <li>
                      Prix total{" "}
                      <span>{this.props.data.prix - -resultat[1]} Dhs </span>
                    </li>
                    <li>
                      Frais de reservation (*){" "}
                      <span>{this.props.data.avance}Dhs</span>
                    </li>
                  </ul>
                </div>
                <br></br>

                <span>* Avance non rembourssable</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Commander2;
