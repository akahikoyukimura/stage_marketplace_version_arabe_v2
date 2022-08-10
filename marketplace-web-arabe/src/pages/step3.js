import React, { Component } from "react";
import Select from "react-select";

import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const intl=JSON.parse(localStorage.getItem('intl'))
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
    { label: <FormattedMessage id="step3_barid_bank"/>, value: "Al Barid Bank" },
    { label: <FormattedMessage id="step3_attijari_wafa_bank"/>, value: "Attijari Wafa Bank" },
    { label: <FormattedMessage id="step3_populaire_bank"/>, value: "Banque populaire" },
    { label: <FormattedMessage id="step3_bmci_bank"/>, value: "BMCI Bank" },
    { label: <FormattedMessage id="step3_bmce_bank"/>, value: "BMCE Bank" },
    { label: <FormattedMessage id="step3_cih_bank"/>, value: "CIH Bank" },
    { label: <FormattedMessage id="step3_cfg_bank"/>, value: "CFG Bank" },
    { label: <FormattedMessage id="step3_credit_agricole"/>, value: "Crédit agricole" },
    { label: <FormattedMessage id="step3_societe_generale"/>, value: "Société Générale" },
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
                <h3><FormattedMessage id="multistep_moyens_de_paiement"/>{" "}:</h3>
                <div style={localStorage.getItem("lg")=='ar'?{"marginRight":"25px"}:{}} className="shoping__checkout mt-2 pb-0">
                  {this.state.occasion == "aid" &&
                  this.state.payementRapide == true ? (
                    <>
                      <div className=" mt-2">
                        <i className="fa fa-university " aria-hidden="true">
                          {" "}
                        </i>
                        <span>&nbsp;&nbsp;</span>
                        <b><FormattedMessage id="step2_choisir_virement_title"/></b>
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
                          <FormattedMessage id="step2_choisir_virement_message"/>
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
                          <b> <FormattedMessage id="step2_virement_bancaire"/></b>
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
                    <label style={localStorage.getItem("lg")=='ar'?{marginRight:"25px"}:{}} className="form-check-label" htmlFor="cash">
                      <b><FormattedMessage id="step3_par_cash"/></b>
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
                    <label style={localStorage.getItem("lg")=='ar'?{"marginRight":"25px"}:{}} className="form-check-label" htmlFor="transfert">
                      <b><FormattedMessage id="step3_par_agence"/></b>
                    </label>
                  </div>
                </div>
                <span>
                  <small>
                  <FormattedMessage id="step3_frais_transport"/>
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
                  <label style={localStorage.getItem("lg")=='ar'?{"marginRight":"25px"}:{}} className="form-check-label" htmlFor="condition">
                  <FormattedMessage id="step3_accepte"/>
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
                className={localStorage.getItem("lg")=="ar"?"primary-btn float-left text-white":"primary-btn float-right text-white"}
                disabled
              >
                <FormattedMessage id="step3_valider"/>
              </a>{" "}
            </Link>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Commander3;
