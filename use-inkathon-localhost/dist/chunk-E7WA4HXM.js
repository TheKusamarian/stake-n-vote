import { b as b$1 } from './chunk-VVVN4566.js';
import { c as c$1, b as b$2, a } from './chunk-E7ATRJ2F.js';

var c={id:"polkadot-js",name:"Polkadot{.js}",platforms:["browser"],urls:{website:"https://polkadot.js.org/extension/",chromeExtension:"https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",firefoxExtension:"https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/"},logoUrls:["https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/polkadot@128w.png","https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/polkadot@512w.png"]},b={id:"subwallet-js",name:"SubWallet",platforms:["browser"],urls:{website:"https://subwallet.app/",chromeExtension:"https://chrome.google.com/webstore/detail/subwallet-polkadot-extens/onhogfjeacnfoofkfgppdlbmlmnplgbn",firefoxExtension:"https://addons.mozilla.org/en-US/firefox/addon/subwallet/"},logoUrls:["https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/subwallet@128w.png","https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/subwallet@512w.png"]},f={id:"talisman",name:"Talisman",platforms:["browser"],urls:{website:"https://www.talisman.xyz/",chromeExtension:"https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",firefoxExtension:"https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/"},logoUrls:["https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/talisman@128w.png","https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/talisman@512w.png"]},d={id:"nova",name:"Nova Wallet",platforms:["android","ios"],urls:{website:"https://novawallet.io/",androidApp:"https://play.google.com/store/apps/details?id=io.novafoundation.nova.market",iosApp:"https://apps.apple.com/app/nova-polkadot-kusama-wallet/id1597119355"},logoUrls:["https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nova@128w.png","https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nova@512w.png"]},x={id:"aleph-zero-signer",name:"Aleph Zero Signer",platforms:["browser"],urls:{website:"https://alephzero.org/signer",chromeExtension:"https://chrome.google.com/webstore/detail/opbinaebpmphpefcimknblieddamhmol",firefoxExtension:"https://addons.mozilla.org/en-US/firefox/addon/aleph-zero-signer/"},logoUrls:["https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/aleph-zero-signer@128w.png","https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/aleph-zero-signer@512w.png"]},k={id:"Nightly",name:"Nightly Wallet",platforms:["browser"],urls:{website:"https://wallet.nightly.app",chromeExtension:"https://chrome.google.com/webstore/detail/nightly/fiikommddbeccaoicoejoniammnalkfa?hl=en",firefoxExtension:"https://addons.mozilla.org/en-GB/firefox/addon/nightly-app/"},logoUrls:["https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nightly@128w.png","https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nightly@512w.png"]},p={id:"NightlyConnect",name:"Nightly Connect",platforms:["browser","android","ios"],urls:{website:"https://connect.nightly.app/docs/"},logoUrls:["https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nightlyConnect@128w.png","https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nightlyConnect@512w.png"]},j=[b,f,c,d,x,k,p],I=t=>j.find(n=>n.id===t),y=t=>{var n,a;try{if(typeof window=="undefined")return;let e=window,s=(n=e==null?void 0:e.injectedWeb3)==null?void 0:n[t.id],i=!!((a=e.walletExtension)!=null&&a.isNovaWallet);return i&&t.id===c.id?!1:i&&t.id===d.id||t.id===p.id?!0:!!s}catch(e){return}},U=(t,n)=>c$1(void 0,null,function*(){var a$1;if(y(t))try{if(typeof window=="undefined")return;let e=window;if(t.id===p.id){let o;try{return o=yield b$1(n),yield o.connect(),{accounts:b$2(a({},o.accounts),{subscribe:u=>{let w=o.accounts.subscribe(u);return o.accounts._triggerSubs(),w}}),signer:o.signer,name:t.id,version:"0.1.10"}}catch(m){throw yield o==null?void 0:o.disconnect().catch(()=>{}),new Error("Error while enabling NightlyConnect")}}let s=(a$1=e==null?void 0:e.injectedWeb3)==null?void 0:a$1[t.id===d.id?c.id:t.id];if(!(s!=null&&s.enable))throw new Error("No according `InjectedWindowProvider` found.");let i=yield s.enable(n);return b$2(a({},i),{name:t.id,version:s.version||""})}catch(e){console.error("Error while enabling wallet",e);return}});

export { c as a, b, f as c, d, x as e, k as f, p as g, j as h, I as i, y as j, U as k };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-E7WA4HXM.js.map