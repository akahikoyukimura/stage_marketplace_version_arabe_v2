const direction=document.documentElement.dir || 'ltr';
const left = direction == 'ltr' ? 'left' : 'right';
const right = direction == 'rtl' ? 'right' : 'left';


const Globals = {
    localeCode: document.documentElement.lang,
    direction: direction,
    left: left,
    right: right,
    margin
};

export default Globals;