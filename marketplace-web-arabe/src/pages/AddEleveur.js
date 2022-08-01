import React, { Component } from "react";
import {FormattedMessage} from 'react-intl'

class AddEleveur extends Component {
  render() {
    return (
      <div>
        <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="contact__form__title">
                  <h2><FormattedMessage id="eleveurs_add"/></h2>
                </div>
              </div>
            </div>
            <form action="#">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <FormattedMessage id="eleveurs_nom">
                    {(nom)=>(
                      <input type="text" 
                      placeholder={nom} />
                    )}
                  
                  </FormattedMessage>
                </div>
                <div className="col-lg-6 col-md-6">
                <FormattedMessage id="eleveurs_prenom">
                    {(prenom)=>(
                      <input type="text" 
                      placeholder={prenom} />
                    )}
                  
                  </FormattedMessage>

                </div>
                <div className="col-lg-6 col-md-6">
                <FormattedMessage id="eleveurs_num_tel">
                    {(num)=>(
                      <input type="text" 
                      placeholder={num} />
                    )}
      
                  </FormattedMessage>
                  
                </div>
                <div className="col-lg-6 col-md-6">
                <FormattedMessage id="eleveurs_poids">
                    {(poids)=>(
                      <input type="text" 
                      placeholder={poids} />
                    )}
                  
                  </FormattedMessage>
                  
                </div>
                <div className="col-lg-6 col-md-6">
                <FormattedMessage id="eleveurs_adresse">
                    {(adr)=>(
                      <input type="text" 
                      placeholder={adr} />
                    )}
                  
                  </FormattedMessage>
                  
                </div>
                <div className="col-lg-6 col-md-6">
                <FormattedMessage id="eleveurs_RIB">
                    {(rib)=>(
                      <input type="text" 
                      placeholder={rib} />
                    )}
                  
                  </FormattedMessage>
                  
                </div>
               
                <div className="col-lg-12 ">
                <FormattedMessage id="eleveurs_img">
                    {(img)=>(
                      <input type="file" 
                      placeholder={img} />
                    )}
                  
                  </FormattedMessage>
                  
                </div>
                <div className="col-lg-12 text-center">
                 
                  <button type="submit" className="site-btn">
                    <FormattedMessage id="eleveurs_ajouter"/>
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

export default AddEleveur;
