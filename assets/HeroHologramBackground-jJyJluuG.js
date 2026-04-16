import{j as w,_ as te}from"./index-7-mWIRYZ.js";import{b as y}from"./react-vendor-DQfhz_P5.js";import"./motion-DmuVWGzW.js";import"./three-DTZfIL9r.js";const j="#a8f020",K="taichi:low_perf_mode",ne=150,oe=4,ie=5e3,Y=["/images/background 1.avif","/images/background 2.avif","/images/background 3.avif","/images/background 4.avif"],re=Y[0],ae=`
	varying vec2 vUv;
	uniform float uTime;

	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`,se=`
	varying vec2 vUv;
	uniform float uTime;
	uniform sampler2D uTexture;
	uniform vec3 uColor;
	uniform float uGlitchIntensity;
	uniform float uOpacity;

	float random(vec2 st) {
		return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
	}

	void main() {
		vec2 uv = vUv;
		float timeStep = floor(uTime * 15.0);
		float blockY = floor(uv.y * 10.0);
		float glitch = step(0.95, random(vec2(timeStep, blockY))) * uGlitchIntensity;
		uv.x += glitch * (random(vec2(timeStep)) - 0.5) * 0.2;

		vec4 texColor = texture2D(uTexture, uv);
		float scanline = sin(uv.y * 800.0 + uTime * 20.0) * 0.15 + 0.85;
		vec2 grid = fract(uv * 120.0);
		float pixel = step(0.05, grid.x) * step(0.05, grid.y);

		vec3 finalColor = (texColor.rgb * 0.8 + 0.2) * uColor;
		float edge = 1.0 - (abs(uv.x - 0.5) * 2.0);
		edge *= 1.0 - (abs(uv.y - 0.5) * 2.0);
		edge = pow(edge, 0.5);

		float alpha = (texColor.a * 0.8 + 0.2) * (scanline * 0.7 + 0.3) * edge * pixel * uOpacity;
		float flicker = random(vec2(floor(uTime * 20.0), 4.0)) > 0.02 ? 1.0 : 0.3;

		gl_FragColor = vec4(finalColor, alpha * flicker);
	}
`,ce=()=>{var x,m;if(typeof window>"u")return!1;try{if(new URLSearchParams(window.location.search).get("lite")==="1"||((x=window.localStorage)==null?void 0:x.getItem(K))==="1")return!0}catch{}const o=navigator.connection;return!!(o!=null&&o.saveData||o!=null&&o.effectiveType&&/^(slow-2g|2g)$/i.test(o.effectiveType)||(m=window.matchMedia)!=null&&m.call(window,"(prefers-reduced-data: reduce)").matches)},le=()=>{var o;try{(o=window.localStorage)==null||o.setItem(K,"1")}catch{}},pe=({openProgress:o=1,scrollProgress:x=0,reducedMotion:m=!1})=>{const f=y.useRef(null),B=y.useRef(o),D=y.useRef(x),[C]=y.useState(ce);return y.useEffect(()=>{B.current=o},[o]),y.useEffect(()=>{D.current=x},[x]),y.useEffect(()=>{if(C)return;const h=f.current;if(!h)return;let R=!1,S=null;return(async()=>{const t=await te(()=>import("./three-DTZfIL9r.js").then(e=>e.T),[]);if(R||!f.current)return;let _=h.clientWidth||window.innerWidth,b=h.clientHeight||window.innerHeight;const E=new t.Scene;E.background=new t.Color(0);const v=new t.PerspectiveCamera(75,_/b,.1,1e3);v.position.z=8;const s=new t.WebGLRenderer({antialias:!0,alpha:!0,powerPreference:"high-performance"});s.setSize(_,b),s.setPixelRatio(Math.min(window.devicePixelRatio,m?1.2:2)),s.domElement.style.position="absolute",s.domElement.style.top="0",s.domElement.style.left="0",s.domElement.style.width="100%",s.domElement.style.height="100%",h.appendChild(s.domElement);const q=new t.TextureLoader,g=new t.Group;E.add(g);const G=[];Y.forEach(e=>{const n=new t.ShaderMaterial({vertexShader:ae,fragmentShader:se,uniforms:{uTime:{value:0},uTexture:{value:new t.Texture},uColor:{value:new t.Color(j)},uGlitchIntensity:{value:1},uOpacity:{value:0}},transparent:!0,side:t.DoubleSide,blending:t.AdditiveBlending}),l=new t.PlaneGeometry(1,1),r=new t.Mesh(l,n);r.scale.set(0,0,0),g.add(r),G.push(n),q.load(e,a=>{if(R){a.dispose();return}n.uniforms.uTexture.value=a;const c=a.image,p=c.width/c.height,d=5;p>1?r.scale.set(d,d/p,1):r.scale.set(d*p,d,1),r.userData.originalScale=r.scale.clone()})});const O=new t.Group;E.add(O);const $=m?10:20,k=[];for(let e=0;e<$;e+=1){const n=new t.PlaneGeometry(Math.random()*3,Math.random()*.8),l=new t.MeshBasicMaterial({color:j,transparent:!0,opacity:0,blending:t.AdditiveBlending}),r=new t.Mesh(n,l);O.add(r),k.push(l)}const J=m?24:60,T=new t.Group;E.add(T);for(let e=0;e<J;e+=1){const n=new t.BufferGeometry,l=(Math.random()-.5)*15;n.setFromPoints([new t.Vector3(-20,l,0),new t.Vector3(20,l,0)]);const r=new t.LineBasicMaterial({color:j,transparent:!0,opacity:Math.random()*.3,blending:t.AdditiveBlending});T.add(new t.Line(n,r))}const A=new t.Clock;let I=0,L=!1;const H=()=>{const e=A.getElapsedTime(),n=2*Math.tan(v.fov*Math.PI/360)*v.position.z,l=n*v.aspect,r=Math.max(.36,B.current)*(1-D.current*.22);G.forEach((a,c)=>{a.uniforms.uTime.value=e;const U=Math.sin(e*3+c*15)*.5+.5>(m?.92:.85),X=a.uniforms.uOpacity.value;if(U){if(X<.05){g.children[c].position.set(0,0,0);const u=g.children[c].userData.originalScale;if(u){const Z=u.x/u.y,ee=l/n;if(Z>ee){const M=l/u.x;g.children[c].scale.set(u.x*M,u.y*M,1)}else{const M=n/u.y;g.children[c].scale.set(u.x*M,u.y*M,1)}}}a.uniforms.uOpacity.value=r*(.5+Math.random()*.28)}else a.uniforms.uOpacity.value=0;a.uniforms.uGlitchIntensity.value=U?Math.random()>.7?25:4:0}),k.forEach((a,c)=>{Math.sin(e*8+c*50)*.5+.5>.9?(a.opacity=r*.9,Math.random()>.95&&O.children[c].position.set((Math.random()-.5)*18,(Math.random()-.5)*12,(Math.random()-.5)*6)):a.opacity=0}),T.children.forEach((a,c)=>{const p=a,d=p.material;p.position.y+=Math.sin(e*.8+c)*.01,Math.random()>.99?d.opacity=r*.8:d.opacity=Math.max(d.opacity-.02,.08)}),s.render(E,v),I=window.requestAnimationFrame(H)},z=()=>{L||(L=!0,A.start(),I=window.requestAnimationFrame(H))},N=()=>{L&&(L=!1,window.cancelAnimationFrame(I),A.stop())},P=()=>{f.current&&(_=f.current.clientWidth||window.innerWidth,b=f.current.clientHeight||window.innerHeight,v.aspect=_/b,v.updateProjectionMatrix(),s.setSize(_,b))};P(),window.addEventListener("resize",P);let i=null,V=0;const Q=performance.now();if(typeof PerformanceObserver<"u")try{i=new PerformanceObserver(e=>{for(const n of e.getEntries())if(n.duration>=ne&&(V+=1,V>=oe)){le(),i==null||i.disconnect(),i=null;break}performance.now()-Q>ie&&(i==null||i.disconnect(),i=null)}),i.observe({entryTypes:["longtask"]})}catch{i=null}const W=new IntersectionObserver(e=>{for(const n of e)n.isIntersecting?z():N()},{threshold:.05});W.observe(h);const F=()=>{document.hidden?N():h.getBoundingClientRect().bottom>0&&z()};document.addEventListener("visibilitychange",F),S=()=>{N(),document.removeEventListener("visibilitychange",F),W.disconnect(),i==null||i.disconnect(),window.removeEventListener("resize",P),G.forEach(e=>{const n=e.uniforms.uTexture.value;n==null||n.dispose(),e.dispose()}),k.forEach(e=>e.dispose()),T.children.forEach(e=>{const n=e;n.material.dispose(),n.geometry.dispose()}),g.children.forEach(e=>{e.geometry.dispose()}),E.clear(),s.dispose(),h.contains(s.domElement)&&h.removeChild(s.domElement)}})(),()=>{R=!0,S==null||S()}},[m,C]),C?w.jsxs("div",{ref:f,className:"hero-hologram-scene hero-hologram-scene--lite","aria-hidden":"true",children:[w.jsx("img",{src:re,alt:"",className:"hero-hologram-scene__lite-image"}),w.jsx("div",{className:"hero-hologram-scene__scanlines"}),w.jsx("div",{className:"hero-hologram-scene__vignette"})]}):w.jsxs("div",{ref:f,className:"hero-hologram-scene","aria-hidden":"true",children:[w.jsx("div",{className:"hero-hologram-scene__scanlines"}),w.jsx("div",{className:"hero-hologram-scene__vignette"})]})};export{pe as default};
