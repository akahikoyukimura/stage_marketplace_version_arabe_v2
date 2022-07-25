import React, { Component } from "react";
import Select from "react-select";

import { Link } from "react-router-dom";
class Commander3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      techBank: props.techBank,
      userBank: "",
      occasion: props.occasion,
      payementRapide: props.payementRapide,
      virement: false,
    };
  }
  agences = [
    { label: "Al Barid Bank", value: "Al Barid Bank" },
    { label: "Attijari Wafa Bank", value: "Attijari Wafa Bank" },
    { label: "Banque populaire", value: "Banque populaire" },
    { label: "BMCI Bank", value: "BMCI Bank" },
    { label: "BMCE Bank", value: "BMCE Bank" },
    { label: "CIH Bank", value: "CIH Bank" },
    { label: "CFG Bank", value: "CFG Bank" },
    { label: "Crédit agricole", value: "Crédit agricole" },
    { label: "Société Générale", value: "Société Générale" },
  ];
  handleChangeBank = (selectedOptionBank) => {
    this.setState({ selectedOptionBank }, () =>
      this.setState({
        userBank: selectedOptionBank,
      })
    );
    if (selectedOptionBank.label == this.state.techBank) {
      this.setState({
        virement: true,
      });
    } else {
      this.setState({
        virement: false,
      });
    }
  };
  render() {
    return (
      <div>
        <div className="container">
          <div className="product-details spad">
            {this.props.validation()[0] ? (
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
                <h3>Moyens de paiement:</h3>
                <div className="shoping__checkout mt-2 pb-0">
                  {this.state.occasion == "aid" &&
                  this.state.payementRapide == true ? (
                    <>
                      <div className=" mt-2">
                        <i className="fa fa-university " aria-hidden="true">
                          {" "}
                        </i>
                        <span>&nbsp;&nbsp;</span>
                        <b>Veuillez choisir votre bank</b>
                        <Select
                          value={this.state.userBank}
                          onChange={this.handleChangeBank}
                          options={this.agences}
                          placeholder="Bank"
                          name="selectedOptionBank"
                        />
                      </div>
                      <span>
                        <small>
                          Puisqu'il ne reste que peu de jours avant l'Aid,
                          l'option de paiement par virement vous sera activé
                          seulement si vous avez la même banque que nous.
                        </small>
                      </span>
                      <br />
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.state.virement ? (
                    <>
                      {" "}
                      <div className="form-check">
                        <input
                          checked={this.props.data.paiement == "virement"}
                          onChange={this.props.onPaiementChanged}
                          className="form-check-input"
                          type="radio"
                          name="paiement"
                          id="virement"
                          value="virement"
                        />
                        <label className="form-check-label" htmlFor="virement">
                          <b> Virement bancaire</b>
                        </label>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="form-check mt-2">
                    <input
                      checked={this.props.data.paiement == "cash"}
                      onChange={this.props.onPaiementChanged}
                      className="form-check-input"
                      type="radio"
                      name="paiement"
                      id="cash"
                      value="cash"
                    />
                    <label className="form-check-label" htmlFor="cash">
                      <b>Par cash</b>
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      checked={this.props.data.paiement == "transfert"}
                      onChange={this.props.onPaiementChanged}
                      className="form-check-input"
                      type="radio"
                      name="paiement"
                      id="transfert"
                      value="transfert"
                    />
                    <label className="form-check-label" htmlFor="transfert">
                      <b>Par agence de transfert d'argent (*)</b>
                    </label>
                  </div>
                </div>
                <span>
                  <small>
                    * les frais de transfert sont a la charge de l'achteur
                  </small>
                </span>
                <br></br>
                <div className="form-check mt-5">
                  <input
                    id="monCheck"
                    checked={this.props.data.checked}
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="condition"
                    onChange={this.props.onChangecheck}
                  />
                  <label className="form-check-label" htmlFor="condition">
                    J'accepte les conditions generales de vente
                  </label>
                </div>
              </div>
            ) : null}
          </div>
          {/*console.log(this.props.data.Commande)*/}
          {this.props.data.checked && this.props.data.paiement != null ? (
            <Link
              to={{
                pathname: "/AlerteCommande",
                state: {
                  id: this.props.data.Commande,
                },
              }}
            >
              {" "}
              <a
                style={{ borderColor: "black" }}
                id=""
                className="primary-btn float-right text-white"
                disabled
              >
                Valider
              </a>{" "}
            </Link>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Commander3;
