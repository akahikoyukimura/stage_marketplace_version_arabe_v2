import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

class AddMouton extends Component {
  render() {
    return (
      <div>
        <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="contact__form__title">
                  <h2>
                    <FormattedMessage id="add_mouton_title" />
                  </h2>
                </div>
              </div>
            </div>
            <form action="#">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="home_item_id">
                    {(placeholder) => (
                      <input
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        type="text"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="home_item_race">
                    {(placeholder) => (
                      <input
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        type="text"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="add_mouton_sexe">
                    {(placeholder) => (
                      <input
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        type="text"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="home_item_poids">
                    {(placeholder) => (
                      <input
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        type="text"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                  {/* <input type="text" placeholder="Poids" /> */}
                </div>
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="add_mouton_localisation">
                    {(placeholder) => (
                      <input
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        type="text"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                  {/* <input type="text" placeholder="Localisation" /> */}
                </div>
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="home_item_price">
                    {(placeholder) => (
                      <input
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        type="text"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                  {/* <input type="text" placeholder="Prix" /> */}
                </div>
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="home_item_eleveur">
                    {(placeholder) => (
                      <input
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        type="text"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                  {/* <input type="text" placeholder="Eleveur" /> */}
                </div>
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="add_mouton_avance">
                    {(placeholder) => (
                      <input
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        type="text"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                  {/* <input type="text" placeholder="Avance" /> */}
                </div>
                <div
                  className="col-lg-12 "
                  style={
                    localStorage.getItem("lg") == "ar"
                      ? { display: "flex", justifyContent: "end" }
                      : { display: "flex", justifyContent: "unset" }
                  }
                >
                  <label for="files" className="btn add_mouton_choose_image">
                    <FormattedMessage id="add_mouton_image" />
                  </label>
                  <input
                    id="files"
                    style={{ display: "none" }}
                    type="file"
                    placeholder="Images"
                  />
                </div>
                <div className="col-lg-12 text-center">
                  <FormattedMessage id="add_mouton_description">
                    {(placeholder) => (
                      <textarea
                        className={
                          localStorage.getItem("lg") == "ar"
                            ? "add_mouton_input"
                            : ""
                        }
                        placeholder={placeholder}
                      ></textarea>
                    )}
                  </FormattedMessage>
                  {/* <textarea
                    placeholder="Description
"
                  ></textarea> */}
                  <button type="submit" className="site-btn">
                    <FormattedMessage id="add_mouton_ajoute" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddMouton;
