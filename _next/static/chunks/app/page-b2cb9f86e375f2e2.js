(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{845:function(e,t,n){Promise.resolve().then(n.bind(n,7160))},7160:function(e,t,n){"use strict";let r;n.r(t),n.d(t,{default:function(){return b}}),n(7364);var a=n(7437),s=n(2265);function o(e){return JSON.stringify(e)}function c(e,t){let[n,r]=(0,s.useState)(()=>{try{let n=window.localStorage.getItem(e);return n?JSON.parse(n):t}catch(e){return console.log(e),t}});return[n,t=>{try{let a=t instanceof Function?t(n):t;r(a),window.localStorage.setItem(e,JSON.stringify(a))}catch(e){console.log(e)}}]}function i(e){let{socket:t}=e,[n,r]=(0,s.useState)(""),c=localStorage.getItem("username");return(0,a.jsxs)("form",{className:"chat",onSubmit:e=>{!function(e,t){e.send(o({action:"sendmessage",data:o(t)}))}(t,{type:"chat",message:n,username:c,timestamp:+Date.now()}),r(""),e.preventDefault()},children:[(0,a.jsx)("input",{autoComplete:"off",onChange:e=>r(e.target.value),value:n}),(0,a.jsx)("button",{children:"Send"})]})}var l=n(2959);function u(e){let{message:t}=e,{timestamp:n,username:r,message:s}=t;return(0,a.jsxs)("li",{children:["(",(0,l.WU)(n,"yyyy/MM/dd"),") ",r,": ",s]})}function d(e){let{socket:t}=e,[n,r]=(0,s.useState)([]);return(0,s.useEffect)(()=>{if(t)return t.addEventListener("message",e),()=>{t.removeEventListener("message",e)};function e(e){let t=JSON.parse(e.data);"chat"===t.type&&r([...n,t])}},[n,t]),(0,a.jsxs)("div",{style:{height:600,width:"100%"},children:[(0,a.jsx)("h3",{children:"gratiot chat"}),(0,a.jsx)("div",{id:"messages",style:{display:"flex",flexDirection:"column-reverse"},children:(0,a.jsx)("ul",{children:n.map(e=>(0,a.jsx)(u,{message:e},o(e)))})})]})}var f=n(703),h={src:"/_next/static/media/gratiot.bfef19f7.png",height:2e3,width:3e3,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAMAAABPT11nAAAAP1BMVEWGh4Z8fHxqampeXl5dXl1OT047Ozs6Ojo5OTkxMTEvMC8rKysmJyYUFBMMDQwHBwcFBQUDAwMCAgIBAQEAAAAbPCTKAAAAK0lEQVR42gWAhRHAMAwD1YYZ/PvPmhMGcJHRcixcTX59gaVN8q5yhNHLgAc06AJAAvIUVwAAAABJRU5ErkJggg==",blurWidth:8,blurHeight:5};function g(e){let{startGame:t}=e;return(0,a.jsx)(f.default,{alt:"coverscreen",src:h,tabIndex:-1,onClick:()=>t(),onKeyDown:e=>{" "===e.key&&t()},width:800,height:600,style:{border:"1px solid black"}})}var m=n(7828);function w(e){let{error:t}=e;return(0,a.jsx)("div",{style:{color:"red"},children:"".concat(t)})}let p=[[1,2,3],[4,5,6],[7,8,9]];async function A(){let e=[];for(let t=0;t<5;t++){let n=[];for(let e=0;e<5;e++){let r=await m.deM.load("tiles/gratiot_".concat(t,"_").concat(e,"-fs8.png"));n.push(m.jyi.from(r))}e.push(n)}return e}async function x(){return new m.KgH(await Promise.all(["bird0.png","bird1.png","bird2.png"].map(e=>m.deM.load("img/".concat(e)))))}function y(){let e=(0,s.useRef)(null),[t,n]=(0,s.useState)();return(0,s.useEffect)(()=>{let t={left:!1,right:!1,up:!1,down:!1};function r(e){switch(e.key){case"ArrowLeft":e.preventDefault(),t.left=!0;break;case"ArrowUp":e.preventDefault(),t.up=!0;break;case"ArrowRight":e.preventDefault(),t.right=!0;break;case"ArrowDown":e.preventDefault(),t.down=!0}}function a(e){switch(e.key){case"ArrowLeft":e.preventDefault(),t.left=!1;break;case"ArrowUp":e.preventDefault(),t.up=!1;break;case"ArrowRight":e.preventDefault(),t.right=!1;break;case"ArrowDown":e.preventDefault(),t.down=!1}}return(async()=>{try{if(!e.current)return;let n=new m.MxU;await n.init({canvas:e.current,resizeTo:window});let s=await A(),o=await x(),c=new m.W20;n.stage.addChild(c);for(let e=0;e<p.length;e++)for(let t=0;t<p[e].length;t++){let n=s[t][e];n.x=2800*t,n.y=1600*e,c.addChild(n)}o.anchor.set(.5),o.x=n.screen.width/2,o.y=n.screen.height/2,n.stage.addChild(o),document.addEventListener("keydown",r),document.addEventListener("keyup",a),n.ticker.add(e=>{t.up||t.left||t.right||t.down?o.play():o.stop(),t.up&&(c.y+=10*e.deltaTime),t.down&&(c.y-=10*e.deltaTime),t.left&&(c.x+=10*e.deltaTime),t.right&&(c.x-=10*e.deltaTime)})}catch(e){n(e),console.error(e)}})(),()=>{document.removeEventListener("keyup",a),document.removeEventListener("keydown",r)}},[]),(0,a.jsxs)(a.Fragment,{children:[t?(0,a.jsx)(w,{error:t}):null,(0,a.jsx)("canvas",{ref:e})]})}function v(e){let{username:t,submit:n}=e,[r,s]=c("username",t);return(0,a.jsx)("dialog",{open:!0,children:(0,a.jsxs)("div",{className:"userdialog",children:[(0,a.jsx)("h1",{children:"Name your creature"}),(0,a.jsxs)("form",{onSubmit:()=>n(r),children:[(0,a.jsx)("input",{type:"text",autoFocus:!0,value:r,onChange:e=>s(e.target.value)}),(0,a.jsx)("button",{type:"submit",children:"Submit"})]})]})})}function j(e){let{socket:t}=e,[n,r]=c("username",""),[o,l]=(0,s.useState)(!1);return(0,a.jsxs)("div",{className:"container",children:[n?null:(0,a.jsx)(v,{username:n,submit:e=>r(e)}),o?(0,a.jsx)(y,{}):(0,a.jsx)(g,{startGame:()=>l(!0)}),(0,a.jsx)(d,{socket:t}),(0,a.jsx)(i,{socket:t})]})}var b=function(){let[e,t]=(0,s.useState)(),[n,o]=(0,s.useState)();return(0,s.useEffect)(()=>{(async()=>{try{t(await (r||(r=new Promise((e,t)=>{let n=new WebSocket("wss://kp00qnm3ma.execute-api.us-east-2.amazonaws.com/Prod/");n.onopen=()=>{console.log("socket connection opened [state = "+n.readyState+"]"),e(n)},n.onerror=e=>{console.error("socket connection error : ",e),t(e)}})),r))}catch(e){console.error(e),o(e)}})()},[]),e?n?(0,a.jsx)("h1",{className:"error",children:"".concat(n)}):(0,a.jsx)(j,{socket:e}):(0,a.jsx)("h1",{children:"Loading..."})}},7364:function(){}},function(e){e.O(0,[395,971,69,744],function(){return e(e.s=845)}),_N_E=e.O()}]);