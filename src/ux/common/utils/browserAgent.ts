let userAgentString = 
    navigator.userAgent;

// Detect Chrome
let chrome = 
    userAgentString.indexOf("Chrome") > -1;

// Detect Internet Explorer
let internetExplorer = 
    userAgentString.indexOf("MSIE") > -1 || 
    userAgentString.indexOf("rv:") > -1;

// Detect Firefox
let firefox = 
    userAgentString.indexOf("Firefox") > -1;

// Detect Safari
let safari = 
    userAgentString.indexOf("Safari") > -1;
        
// Discard Safari since it also matches Chrome
if ((chrome) && (safari)) 
    safari = false;

// Detect Opera
let opera = 
    userAgentString.indexOf("OP") > -1;
        
// Discard Chrome since it also matches Opera     
if ((chrome) && (opera)) 
    chrome = false;

// Detect Edge
let edge = userAgentString.indexOf("Edg") > -1

const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgentString)

const agents = {
    chrome,
    internetExplorer,
    firefox,
    safari,
    opera,
    edge,
    mobile
}

export default agents