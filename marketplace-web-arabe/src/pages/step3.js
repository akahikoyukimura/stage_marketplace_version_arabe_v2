import React, { Component } from "react";


import { Link } from "react-router-dom";
class Commander3 extends Component {
  constructor(props) {
    super(props);
  }


  render() {


    return (
      <div>
        <div className="container">
          <div className="product-details spad">
            {this.props.validation()[0]  ? (<div id="centrer" className="col-lg-12 col-md-6">
              <br></br>
              <h3>Moyens de paiement:</h3>
              <div className="shoping__checkout mt-2 pb-0">

                <div className="form-check">
                  <input checked={this.props.data.paiement == "virement"} onChange={this.props.onPaiementChanged} className="form-check-input" type="radio" name="paiement" id="virement" value="virement" />
                  <label className="form-check-label" htmlFor="virement">
                    <b> Virement bancaire</b>
                  </label>
                </div>
                <div className="form-check mt-2">
                  <input checked={this.props.data.paiement == "transfert"} onChange={this.props.onPaiementChanged} className="form-check-input" type="radio" name="paiement" id="transfert" value="transfert" />
                  <label className="form-check-label" htmlFor="transfert">
                    <b>Par agence de transfert d'argent (*)</b>
                  </label>
                </div>
              </div>
              <span><small>* les frais de transfert sont a la charge de l'achteur</small></span>
              <br></br>
              <div className="form-check mt-5">
                <input id="monCheck" checked={this.props.data.checked} className="form-check-input" type="checkbox" value="" id="condition" onChange={this.props.onChangecheck} />
                <label className="form-check-label" htmlFor="condition">
                  J'accepte les conditions generales de vente
  </label>
              </div>
            </div>
            ) : null}
          </div>{console.log(this.props.data.Commande)}
          {this.props.data.checked && this.props.data.paiement != null ? <Link
            to={{
              pathname: "/AlerteCommande",
              state: {
                id: this.props.data.Commande,
              },
            }}
          >
            {" "}
            <a
              style={{ borderColor: 'black' }}
              id=""
              className="primary-btn float-right text-white"
              disabled
            >
              Valider
                        </a>{" "}
          </Link> : null}
        </div>
      </div>
    );
  }
}

export default Commander3;
