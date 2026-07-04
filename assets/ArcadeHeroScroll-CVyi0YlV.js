import{j as e}from"./index-qrDSc3dK.js";import{b as d}from"./react-vendor-DQfhz_P5.js";const k=[{src:"/newhome/explorer.png",name:"Explorer"},{src:"/newhome/navigator.png",name:"Navigator"},{src:"/newhome/observer.png",name:"Observer"},{src:"/newhome/maker.png",name:"Maker"},{src:"/newhome/designer.png",name:"Designer"},{src:"/newhome/engineer.png",name:"Engineer"}],B="Navigator",N=({src:s,name:i,className:c=""})=>e.jsxs("div",{className:`nh-charbox ${i===B?"nh-selected":""} ${c}`,children:[e.jsx("span",{className:"nh-aim","aria-hidden":"true"}),e.jsx("img",{src:s,alt:i,className:"nh-char nh-pixel"}),e.jsx("span",{className:"nh-name",children:i})]}),T=({side:s,className:i="",style:c})=>{const n=s==="left"?[[0,0],[1,1],[0,2]]:[[1,0],[0,1],[1,2]];return e.jsx("svg",{viewBox:"0 0 2 3",shapeRendering:"crispEdges",fill:"#3ad13a","aria-hidden":"true",className:i,style:c,children:n.map(([x,w])=>e.jsx("rect",{x,y:w,width:"1",height:"1"},`${x}-${w}`))})},C=({className:s="",onClick:i})=>e.jsxs("button",{type:"button",onClick:i,"aria-label":"Scroll to continue",className:`flex animate-bounce cursor-pointer flex-col items-center gap-4 bg-transparent text-white transition-opacity hover:opacity-80 md:gap-5 ${s}`,children:[e.jsx("span",{className:"font-mono text-[11px] tracking-[0.2em] sm:text-[13px] md:text-[15px]",children:"SCROLL TO CONTINUE"}),e.jsxs("svg",{viewBox:"0 0 56 28",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",className:"h-5 w-14 md:h-6 md:w-16",children:[e.jsx("path",{d:"M4 5 L28 18 L52 5"}),e.jsx("path",{d:"M4 13 L28 26 L52 13"})]})]}),U=()=>{const s=k.slice(0,3),i=k.slice(3,6),c=()=>{window.scrollBy({top:Math.max(Math.round(window.innerHeight*.18),80)})};return e.jsxs("div",{className:"relative h-full min-h-[100dvh] w-full overflow-hidden bg-[#0d0e12] text-white",children:[e.jsx("img",{src:"/newhome/frame.png",alt:"","aria-hidden":"true",className:"nh-pixel absolute inset-0 h-full w-full [object-fit:fill]"}),e.jsxs("div",{className:"absolute bottom-[11%] left-[3%] right-[3%] top-[12%] overflow-hidden rounded-[2vw]",children:[e.jsx("div",{className:"absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none nh-grid-wrap h-1/2",children:e.jsx("div",{className:"nh-grid"})}),e.jsxs("div",{className:"relative z-[2] flex h-full flex-col items-center justify-between py-[4%]",children:[e.jsxs("div",{className:"relative flex w-full justify-center pt-[8vh] md:pt-[1vh]",children:[e.jsx("img",{src:"/newhome/title.png",alt:"BIG BANG! FUTURES!",className:"h-auto nh-title nh-pixel w-[min(84vw,560px)] md:w-[min(60vw,820px)]"}),e.jsx(T,{side:"left",className:"absolute bottom-0 left-[4%] z-[1] hidden md:block",style:{width:"clamp(46px, 5.6vw, 104px)"}}),e.jsx(T,{side:"right",className:"absolute bottom-0 right-[4%] z-[1] hidden md:block",style:{width:"clamp(46px, 5.6vw, 104px)"}})]}),e.jsx("img",{src:"/newhome/subtitle.png",alt:"TAICHI26 — 8.05 WED to 8.06 THU",className:"h-auto nh-pixel w-[min(82vw,400px)] lg:w-[min(52vw,440px)]"}),e.jsxs("div",{className:"nh-zone relative hidden h-[150px] w-full lg:block xl:h-[185px] 2xl:h-[205px]",children:[e.jsx("div",{className:"absolute inset-y-0 flex items-end justify-between pb-7",style:{left:"4%",right:"calc(50% + min(26vw, 220px))"},children:s.map(n=>e.jsx(N,{src:n.src,name:n.name,className:"h-[100px] xl:h-[130px] 2xl:h-[148px]"},n.name))}),e.jsx("div",{className:"absolute inset-y-0 flex items-end justify-center pb-1",style:{left:"calc(50% - min(26vw, 220px))",right:"calc(50% - min(26vw, 220px))"},children:e.jsx(C,{className:"px-2",onClick:c})}),e.jsx("div",{className:"absolute inset-y-0 flex items-end justify-between pb-7",style:{left:"calc(50% + min(26vw, 220px))",right:"4%"},children:i.map(n=>e.jsx(N,{src:n.src,name:n.name,className:"h-[100px] xl:h-[130px] 2xl:h-[148px]"},n.name))})]}),e.jsxs("div",{className:"flex w-full flex-col items-center gap-[clamp(1rem,4vh,2.5rem)] px-[4%] pb-[5vh] lg:hidden",children:[e.jsx("div",{className:"nh-zone grid w-full max-w-[380px] grid-cols-3 justify-items-center gap-x-[4vw] gap-y-[clamp(1rem,4vh,2.5rem)]",children:k.map(n=>e.jsx(N,{src:n.src,name:n.name,className:"h-[min(16vw,84px)] w-[min(16vw,84px)]"},n.name))}),e.jsx(C,{onClick:c})]})]})]}),e.jsx("style",{children:`
				.nh-pixel { image-rendering: pixelated; image-rendering: crisp-edges; }

				/* Retro 3D grid */
				.nh-grid-wrap {
					perspective: 250px;
					-webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
					mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
				}
				.nh-grid {
					position: absolute; top: -100%; left: -50%; width: 200%; height: 400%;
					background-image:
						linear-gradient(to right, rgba(80,250,123,0.15) 1px, transparent 4px),
						linear-gradient(to bottom, rgba(80,250,123,0.15) 1px, transparent 4px);
					background-size: 150px 50px;
					transform: rotateX(65deg);
					animation: nh-grid-travel 2.5s linear infinite;
				}
				@keyframes nh-grid-travel {
					0% { transform: rotateX(65deg) translateY(0); }
					100% { transform: rotateX(65deg) translateY(50px); }
				}

				/* Title glow */
				.nh-title { animation: nh-title-glow 4s ease-in-out infinite alternate; }
				@keyframes nh-title-glow {
					0% { filter: drop-shadow(0 0 2px rgba(255,85,85,0.2)); }
					100% { filter: drop-shadow(0 0 10px rgba(255,85,85,0.5)); }
				}

				/* Character box — red targeting reticle cursor (arcade "lock-on" feel) */
				.nh-charbox {
					position: relative; display: flex; align-items: center; justify-content: center;
					cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' shape-rendering='crispEdges'><path d='M12 2v20M2 12h20' stroke='%23000' stroke-opacity='.5' stroke-width='5'/><path d='M12 2v20M2 12h20' stroke='%23ff2b2b' stroke-width='3'/></svg>") 12 12, crosshair;
				}
				.nh-char { height: 78%; width: auto; z-index: 2; }
				.nh-aim {
					position: absolute; inset: -12px; z-index: 1; opacity: 0; pointer-events: none;
					background: url('/newhome/aim.png') center / 100% 100% no-repeat;
					image-rendering: pixelated; transition: opacity 0.15s ease;
				}
				.nh-name {
					position: absolute; bottom: -1.9rem; left: 50%; transform: translateX(-50%);
					font-family: 'Courier New', monospace; font-size: 16px; letter-spacing: 1px; white-space: nowrap;
					opacity: 0; transition: opacity 0.15s ease; z-index: 3;
				}
				.nh-charbox:hover .nh-aim, .nh-selected .nh-aim { opacity: 1; animation: nh-blink 1s infinite alternate; }
				.nh-charbox:hover .nh-name, .nh-selected .nh-name { opacity: 1; }
				.nh-charbox:hover .nh-char, .nh-selected .nh-char { animation: nh-bounce 0.6s steps(2) infinite; }
				@keyframes nh-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
				@keyframes nh-blink {
					0% { filter: drop-shadow(0 0 1px rgba(255,85,85,0.4)); }
					100% { filter: drop-shadow(0 0 6px rgba(255,85,85,0.8)); }
				}

				/* Hovering another box dims the default-selected one */
				.nh-zone:hover .nh-selected:not(:hover) .nh-aim,
				.nh-zone:hover .nh-selected:not(:hover) .nh-name { opacity: 0; }
				.nh-zone:hover .nh-selected:not(:hover) .nh-char { animation: none; }
			`})]})},$="500vh",z=700,F=s=>1-Math.pow(1-s,1),W=({variant:s,children:i})=>{const c=i??e.jsx(U,{}),n=d.useRef(null),x=d.useRef(null),w=d.useRef(null),h=d.useRef(null),E=d.useRef(!1),b=d.useRef(!1),y=d.useRef(null),[M,D]=d.useState(!1);return d.useEffect(()=>{let R=window.scrollY;const v=t=>t.preventDefault(),S=t=>{["Space","ArrowUp","ArrowDown","PageUp","PageDown","Home","End"].includes(t.code)&&t.preventDefault()},H=()=>{const t=window.innerWidth-document.documentElement.clientWidth;t>0&&!document.body.style.paddingRight&&(document.body.style.paddingRight=`${t}px`),document.body.style.overflow="hidden",window.addEventListener("wheel",v,{passive:!1}),window.addEventListener("touchmove",v,{passive:!1}),window.addEventListener("keydown",S,{passive:!1})},L=()=>{document.body.style.overflow="",document.body.style.paddingRight="",window.removeEventListener("wheel",v),window.removeEventListener("touchmove",v),window.removeEventListener("keydown",S)},A=(t,a)=>{let m=null,l=null,r=0;H();const g=o=>{m===null&&(m=o,l=window.scrollY,r=t-l);const p=o-m,u=Math.min(p/a,1);window.scrollTo(0,l+r*F(u)),u<1?requestAnimationFrame(g):(window.scrollTo(0,t),L(),setTimeout(()=>{h.current=null},100))};requestAnimationFrame(g)},O=t=>{const a=x.current;if(a)if(a.style.pointerEvents=t<.02?"auto":"none",s==="boom"){const m=Math.max(100-t*110,0);a.style.clipPath=`circle(${m}% at 50% 50%)`;const l=w.current;l&&(l.style.opacity=String(Math.min(Math.max((m-10)/30,0),1)))}else a.style.opacity=String(Math.max(1-t*1.15,0)),a.style.transform=`scale(${1-t*.12}) translateY(${t*-4}vh)`},Y=()=>{if(b.current=!1,!n.current)return;const t=n.current,a=t.offsetTop,m=t.offsetHeight,l=window.innerHeight,r=window.scrollY,g=r-R;R=r;const o=a,p=a+m-l;h.current||(g>0&&r>o+20&&r<p-l*.1?(h.current="down",A(p,z)):g<0&&r<p-10&&r>o+l*.1&&(h.current="up",A(o,z))),(h.current==="down"&&r>=p-10||h.current==="up"&&r<=o+10)&&(h.current=null);let u,f;r>=o&&r<=p?(f=!0,u=(r-o)/(p-o)):(f=!1,u=r<o?0:1),f!==E.current&&(E.current=f,D(f)),f&&O(u)},j=()=>{b.current||(b.current=!0,y.current=requestAnimationFrame(Y))};window.addEventListener("scroll",j,{passive:!0});const I=window.setTimeout(j,100);return()=>{window.removeEventListener("scroll",j),y.current!==null&&cancelAnimationFrame(y.current),window.clearTimeout(I),L()}},[s]),e.jsx("div",{ref:n,style:{height:$,position:"relative"},children:M&&(s==="boom"?e.jsx("div",{ref:x,style:{position:"fixed",inset:0,zIndex:40,background:"#0d0e12",clipPath:"circle(100% at 50% 50%)",overflow:"hidden",willChange:"clip-path"},children:e.jsx("div",{ref:w,style:{width:"100%",height:"100%",opacity:1},children:c})}):e.jsx("div",{ref:x,style:{position:"fixed",inset:0,zIndex:40,overflow:"hidden",transformOrigin:"50% 42%",willChange:"opacity, transform"},children:c}))})};export{W as A};
