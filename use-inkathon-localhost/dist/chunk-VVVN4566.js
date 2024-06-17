import { c } from './chunk-E7ATRJ2F.js';
import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';

var f=t=>c(void 0,null,function*(){try{let i=yield (yield fetch(t)).text(),c=/<link\s.*?rel="apple-touch-icon".*?href="(.*?)".*?>/i,s=/<link\s.*?rel=(?:"icon"|"shortcut icon").*?href="(.*?)".*?>/i,n=i.match(c),e=i.match(s);return n!=null&&n[1]?new URL(n[1],t).href:e!=null&&e[1]?new URL(e[1],t).href:(yield fetch(t+"/favicon.ico")).status===200?t+"/favicon.ico":void 0}catch(i){return}});var r,g=(t,i,c$1,s=!0)=>c(void 0,null,function*(){if(r)return r;try{let n=t||(window==null?void 0:window.location.hostname),e=i||(yield f(window==null?void 0:window.origin)),a=c$1||(window==null?void 0:window.origin);r=yield NightlyConnectAdapter.build({appMetadata:{name:n,icon:e,description:a},network:"AlephZero"});}catch(n){return}return r});

export { f as a, g as b };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-VVVN4566.js.map