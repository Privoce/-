const a=e=>{let t="";try{t=new URL(e.startsWith("//")?`http:${e}`:e).origin}catch{}return`${t}/favicon.ico`},f=(e,t="")=>t?e.map(n=>n.replace(new RegExp(t,"g"),`<mark>${t}</mark>`)):e;function c(e){return/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(e)}const o=e=>{e=e||"ccegbnlnelhgaefimiaklaindffpfcmh";const t=`chrome-extension://${e}/assets/icon/logo.png`;return new Promise(n=>{let r=document.createElement("img");r.src=t,r.onload=()=>{n(!0)},r.onerror=()=>{n(!1)}})};export{o as c,a as g,f as h,c as v};