import React, {useState} from 'react'
import { IntlProvider } from 'react-intl'
import Arabe from '../Langues/ar.json'
import Francais from '../Langues/fr.json'

export const Context = React.createContext();

let local="";
if (localStorage.getItem("lg")) {
    local = localStorage.getItem("lg");
} else {
    local="fr"
}


let lang;
if(local === "fr"){
  lang = Francais;
} else {
  lang = Arabe;
}

export const Wrapper = (props) => {

    const [locale, setLocale] = useState(local)
    const [messages, setMessages] = useState(lang)

    function selectLang(e) {
        const newLocale = e.target.value
        setLocale(newLocale);
        if(newLocale==="ar"){
            setMessages(Arabe)
        } else {
            setMessages(Francais)
        }
    }

  return (
    <Context.Provider value={{locale, selectLang}}> 
        <IntlProvider
        locale={locale}
        messages={messages}>
        {props.children}
        </IntlProvider>
    </Context.Provider>

  )
}

export default Wrapper;
