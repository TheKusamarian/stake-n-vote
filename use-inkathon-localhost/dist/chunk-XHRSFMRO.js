import { v } from './chunk-2VQ7T2ST.js';
import { h, j, g, k, i } from './chunk-E7WA4HXM.js';
import { b as b$1, f, e, v as v$1, u, r, x, c as c$1 } from './chunk-DPXWS3GU.js';
import { b as b$3 } from './chunk-VVVN4566.js';
import { c, b as b$2, a } from './chunk-E7ATRJ2F.js';
import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';
import { ContractPromise } from '@polkadot/api-contract';

var wt=(r,a)=>{r(e=>{let n=e.findIndex(({contractId:t,networkId:c})=>t.toLowerCase()===a.contractId.toLowerCase()&&c.toLowerCase()===a.networkId.toLowerCase());return n>=0&&e.splice(n,1),[...e,a]});},ut=(r,a)=>c(void 0,null,function*(){(yield a).forEach(e=>wt(r,e));});var b="activeAccountAddress",V="activeExtensionId",dt=createContext(null),P=()=>{let r=useContext(dt);if(!r)throw new Error("useInkathon must be used within a UseInkathonProvider");return r},$t=({children:r,appName:a$1,defaultChain:e,connectOnInit:n,deployments:t,apiOptions:c$2,supportedWallets:I=h})=>{if(!e||typeof e=="string"&&v(e)===void 0)throw new Error("None or invalid `defaultChain` provided with `UseInkathonProvider`. Forgot to set environment variable?");let u=useRef(!1),f=useRef(!1),[h$1,m]=useState(n),[F,x$1]=useState(!1),[ht,W]=useState(),[T,It]=useState(typeof e=="string"?v(e):e),[s,H]=useState(),[D,q]=useState(),[J,gt]=useState([]),[w,X]=useState(),[j$1,Ct]=useState(),y=useRef(),k$1=useRef(),g$1=useRef(),[Pt,At]=useState([]);useEffect(()=>{t&&ut(At,t);},[]);let G=o=>c(void 0,null,function*(){u.current=!0,x$1(!1),W(void 0);let l=o||T,i,p;try{(({api:i,provider:p}=yield x(l,a({noInitWarn:!0,throwOnConnect:!0},c$2)))),s==null||s.disconnect(),H(i),D==null||D.disconnect(),q(p),f.current=!0,T.network!==l.network&&It(l);}catch(S){let d="Error while initializing Polkadot.js API";console.error(d,S),W({code:0,message:d}),x$1(!1),m(!1),H(void 0),q(void 0),f.current=!1;}return u.current=!1,i}),K=o=>{typeof o=="function"?X(l=>{let i=o(l);return i?localStorage.setItem(b,i.address):localStorage.removeItem(b),i}):(X(o),o?localStorage.setItem(b,o.address):localStorage.removeItem(b));},M=(o,l)=>{let i=o||[],p=l?{address:l}:j$1,S=i.find(d=>b$1(d,p))||(i==null?void 0:i[0]);c$1(J,i)||gt(()=>i),b$1(w,S)||K(()=>S),x$1(!!S);};useEffect(()=>{w&&!b$1(w,j$1)&&Ct(()=>w);},[w]);let O=(o,l,i,p)=>c(void 0,null,function*(){var S;if(W(void 0),m(!0),x$1(!!w),!(s!=null&&s.isConnected)||o&&o.network!==T.network){let d=yield G(o);if(!(d!=null&&d.isConnected))return}try{let d=I.filter(A=>!(!j(A)||p&&A.id===g.id));if(!(d!=null&&d.length)){let A="No Substrate-compatible extension detected";throw W({code:1,message:A}),new Error(A)}let Y=l&&d.find(A=>A.id===l.id)||d[0],E=yield k(Y,a$1);y.current=E,localStorage.setItem(V,Y.id),k$1.current=E==null?void 0:E.signer,(S=g$1.current)==null||S.call(g$1);let Dt=E==null?void 0:E.accounts.subscribe(A=>{M(A,i);});g$1.current=Dt;}catch(d){console.error("Error while connecting wallet:",d),y.current=void 0,k$1.current=void 0,x$1(!1);}finally{m(!1);}});useEffect(()=>{s==null||s.setSigner(k$1.current);},[s,k$1.current]);let Q=o=>c(void 0,null,function*(){var l,i;if(o){yield D==null?void 0:D.disconnect(),yield s==null?void 0:s.disconnect(),localStorage.removeItem(V),localStorage.removeItem(b);return}if(((l=y.current)==null?void 0:l.name)===g.id){let p=yield b$3(a$1);yield p==null?void 0:p.disconnect();}x$1(!1),M([]),(i=g$1.current)==null||i.call(g$1),g$1.current=void 0,y.current=void 0,k$1.current=void 0,f.current=!1;});useEffect(()=>{if(!s)return;let o=()=>{Q();};return s==null||s.on("disconnected",o),()=>{s==null||s.off("disconnected",o);}},[s]),useEffect(()=>{if(f.current||u.current)return;let o=localStorage.getItem(V)||void 0,l=localStorage.getItem(b)||void 0,i=o&&l,p;return o&&(p=h.find(S=>S.id===o)),n||i?O(void 0,p,l,!0):G(),()=>{var S;(S=g$1.current)==null||S.call(g$1);}},[]);let vt=o=>c(void 0,null,function*(){let l=y.current&&i(y.current.name);yield O(o,l);});return jsx(dt.Provider,{value:{isInitializing:u.current,isInitialized:f.current,isConnecting:h$1,isConnected:F,error:ht,activeChain:T,switchActiveChain:vt,api:s,provider:D,connect:O,disconnect:Q,accounts:J,activeAccount:w,activeExtension:y.current,activeSigner:k$1.current,setActiveAccount:K,lastActiveAccount:j$1,deployments:Pt,supportedWallets:I},children:r})};var ce=(r,a,e$1)=>{let{api:n}=P(),[t,c]=useState({tokenSymbol:"Unit",tokenDecimals:12}),[I,u]=useState([]);return useEffect(()=>{let f$1=h=>{c(()=>h);};if(!n){f$1({});return}return a?f(n,r,f$1,e$1).then(h=>{u(m=>[...m,h]);}):e(n,r,e$1).then(f$1),()=>{I.forEach(h=>h==null?void 0:h()),u(()=>[]);}},[n,r]),t};var mt=(r,a)=>{let{api:e,isConnecting:n}=P(),[t,c$1]=useState(),I=()=>c(void 0,null,function*(){if(n||!e||!r||!a){c$1(void 0);return}try{let u=new ContractPromise(e,r,a);c$1(u);}catch(u){console.error("Error during Contract initialization",u);}});return useEffect(()=>{I();},[e,n,r,a]),{contract:t,address:a}};var Ae=(r,a,e)=>{let{api:n,activeChain:t}=P(),[c,I]=useState([]),[u$1,f]=useState([]);return useEffect(()=>{let h=m=>{I(()=>m);};if(!n||!t){I([]);return}if(a){let m=v$1(n,r,h,t.network,e);m&&f(F=>[...F,m]);}else u(n,r,t.network,e).then(h);return ()=>{u$1.forEach(m=>m==null?void 0:m()),f(()=>[]);}},[n,r,t]),c};var St=(r$1,a)=>{let{deployments:e,activeChain:n}=P();a=a||(n==null?void 0:n.network)||"";let t=r(e||[],r$1,a);return mt(t==null?void 0:t.abi,t==null?void 0:t.address)};var Be=(r,a$1,e)=>{let{api:n,activeAccount:t}=P(),c=St(r,e),[I,u]=useState(void 0);return useEffect(()=>{if(!(c!=null&&c.address)||!(t!=null&&t.address)||!n){u(void 0);return}let f=new a$1(c.address.toString(),t.address,n);u(f);},[c==null?void 0:c.address,t==null?void 0:t.address]),b$2(a({},c),{typedContract:I})};

export { wt as a, ut as b, b as c, V as d, P as e, $t as f, ce as g, mt as h, Ae as i, St as j, Be as k };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-XHRSFMRO.js.map