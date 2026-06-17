import{l as ie,j as y,_ as re,n as ae}from"./index-BXxLTbY_.js";import{b as x}from"./react-vendor-DQfhz_P5.js";import"./motion-DmuVWGzW.js";import"./three-DTZfIL9r.js";const D="#a8f020",se=150,le=4,ce=5e3,q=["/images/background 1.avif","/images/background 2.avif","/images/background 3.avif","/images/background 4.avif"],ue=q[0],de={full:{textureCount:4,blockCount:20,linesCount:60,pixelRatio:2,useSimpleShader:!1,antialias:!0},medium:{textureCount:2,blockCount:8,linesCount:24,pixelRatio:1.5,useSimpleShader:!0,antialias:!1}},me=`
	varying vec2 vUv;
	uniform float uTime;

	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`,fe=`
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
`,he=`
	varying vec2 vUv;
	uniform float uTime;
	uniform sampler2D uTexture;
	uniform vec3 uColor;
	uniform float uOpacity;

	void main() {
		vec2 uv = vUv;
		vec4 texColor = texture2D(uTexture, uv);
		float scanline = sin(uv.y * 400.0 + uTime * 12.0) * 0.15 + 0.85;
		vec3 finalColor = (texColor.rgb * 0.8 + 0.2) * uColor;
		float edge = 1.0 - (abs(uv.x - 0.5) * 2.0);
		edge *= 1.0 - (abs(uv.y - 0.5) * 2.0);
		edge = pow(edge, 0.5);
		float alpha = (texColor.a * 0.8 + 0.2) * (scanline * 0.7 + 0.3) * edge * uOpacity;
		gl_FragColor = vec4(finalColor, alpha);
	}
`,we=({openProgress:L=1,scrollProgress:O=0,reducedMotion:C=!1})=>{const f=x.useRef(null),H=x.useRef(L),F=x.useRef(O),[b]=x.useState(ie);return x.useEffect(()=>{H.current=L},[L]),x.useEffect(()=>{F.current=O},[O]),x.useEffect(()=>{if(b==="lite")return;const d=f.current;if(!d)return;const l=de[b],Y=l.useSimpleShader?he:fe,J=q.slice(0,l.textureCount);let k=!1,M=null;return(async()=>{const t=await re(()=>import("./three-DTZfIL9r.js").then(e=>e.T),[]);if(k||!f.current)return;let E=d.clientWidth||window.innerWidth,S=d.clientHeight||window.innerHeight;const w=new t.Scene;w.background=new t.Color(0);const h=new t.PerspectiveCamera(75,E/S,.1,1e3);h.position.z=8;const a=new t.WebGLRenderer({antialias:l.antialias,alpha:!0,powerPreference:"high-performance"});a.setSize(E,S);const Q=C?Math.min(l.pixelRatio,1.2):l.pixelRatio;a.setPixelRatio(Math.min(window.devicePixelRatio,Q)),a.domElement.style.position="absolute",a.domElement.style.top="0",a.domElement.style.left="0",a.domElement.style.width="100%",a.domElement.style.height="100%",d.appendChild(a.domElement);const X=new t.TextureLoader,p=new t.Group;w.add(p);const A=[];J.forEach(e=>{const n={uTime:{value:0},uTexture:{value:new t.Texture},uColor:{value:new t.Color(D)},uOpacity:{value:0}};l.useSimpleShader||(n.uGlitchIntensity={value:1});const s=new t.ShaderMaterial({vertexShader:me,fragmentShader:Y,uniforms:n,transparent:!0,side:t.DoubleSide,blending:t.AdditiveBlending}),c=new t.PlaneGeometry(1,1),o=new t.Mesh(c,s);o.scale.set(0,0,0),p.add(o),A.push(s),X.load(e,r=>{if(k){r.dispose();return}s.uniforms.uTexture.value=r;const v=r.image,m=v.width/v.height,g=5;m>1?o.scale.set(g,g/m,1):o.scale.set(g*m,g,1),o.userData.originalScale=o.scale.clone()})});const N=new t.Group;w.add(N);const Z=C?Math.max(4,Math.floor(l.blockCount/2)):l.blockCount,P=[];for(let e=0;e<Z;e+=1){const n=new t.PlaneGeometry(Math.random()*3,Math.random()*.8),s=new t.MeshBasicMaterial({color:D,transparent:!0,opacity:0,blending:t.AdditiveBlending}),c=new t.Mesh(n,s);N.add(c),P.push(s)}const $=C?Math.max(8,Math.floor(l.linesCount/2)):l.linesCount,T=new t.Group;w.add(T);for(let e=0;e<$;e+=1){const n=new t.BufferGeometry,s=(Math.random()-.5)*15;n.setFromPoints([new t.Vector3(-20,s,0),new t.Vector3(20,s,0)]);const c=new t.LineBasicMaterial({color:D,transparent:!0,opacity:Math.random()*.3,blending:t.AdditiveBlending});T.add(new t.Line(n,c))}const R=new t.Timer;let I=0,G=!1;const U=()=>{R.update();const e=R.getElapsed(),n=2*Math.tan(h.fov*Math.PI/360)*h.position.z,s=n*h.aspect,c=Math.max(.36,H.current)*(1-F.current*.22);A.forEach((o,r)=>{o.uniforms.uTime.value=e;const g=Math.sin(e*3+r*15)*.5+.5>(C?.92:.85),te=o.uniforms.uOpacity.value;if(g){if(te<.05){p.children[r].position.set(0,0,0);const u=p.children[r].userData.originalScale;if(u){const ne=u.x/u.y,oe=s/n;if(ne>oe){const _=s/u.x;p.children[r].scale.set(u.x*_,u.y*_,1)}else{const _=n/u.y;p.children[r].scale.set(u.x*_,u.y*_,1)}}}o.uniforms.uOpacity.value=c*(.5+Math.random()*.28)}else o.uniforms.uOpacity.value=0;o.uniforms.uGlitchIntensity&&(o.uniforms.uGlitchIntensity.value=g?Math.random()>.7?25:4:0)}),P.forEach((o,r)=>{Math.sin(e*8+r*50)*.5+.5>.9?(o.opacity=c*.9,Math.random()>.95&&N.children[r].position.set((Math.random()-.5)*18,(Math.random()-.5)*12,(Math.random()-.5)*6)):o.opacity=0}),T.children.forEach((o,r)=>{const v=o,m=v.material;v.position.y+=Math.sin(e*.8+r)*.01,Math.random()>.99?m.opacity=c*.8:m.opacity=Math.max(m.opacity-.02,.08)}),a.render(w,h),I=window.requestAnimationFrame(U)},z=()=>{G||(G=!0,R.reset(),I=window.requestAnimationFrame(U))},j=()=>{G&&(G=!1,window.cancelAnimationFrame(I))},B=()=>{f.current&&(E=f.current.clientWidth||window.innerWidth,S=f.current.clientHeight||window.innerHeight,h.aspect=E/S,h.updateProjectionMatrix(),a.setSize(E,S))};B(),window.addEventListener("resize",B);let i=null,V=0;const ee=performance.now();if(typeof PerformanceObserver<"u")try{i=new PerformanceObserver(e=>{for(const n of e.getEntries())if(n.duration>=se&&(V+=1,V>=le)){ae(b==="full"?"medium":"lite",!0),i==null||i.disconnect(),i=null;break}performance.now()-ee>ce&&(i==null||i.disconnect(),i=null)}),i.observe({entryTypes:["longtask"]})}catch{i=null}const W=new IntersectionObserver(e=>{for(const n of e)n.isIntersecting?z():j()},{threshold:.05});W.observe(d);const K=()=>{document.hidden?j():d.getBoundingClientRect().bottom>0&&z()};document.addEventListener("visibilitychange",K),M=()=>{j(),R.dispose(),document.removeEventListener("visibilitychange",K),W.disconnect(),i==null||i.disconnect(),window.removeEventListener("resize",B),A.forEach(e=>{const n=e.uniforms.uTexture.value;n==null||n.dispose(),e.dispose()}),P.forEach(e=>e.dispose()),T.children.forEach(e=>{const n=e;n.material.dispose(),n.geometry.dispose()}),p.children.forEach(e=>{e.geometry.dispose()}),w.clear(),a.dispose(),d.contains(a.domElement)&&d.removeChild(a.domElement)}})(),()=>{k=!0,M==null||M()}},[C,b]),b==="lite"?y.jsxs("div",{ref:f,className:"hero-hologram-scene hero-hologram-scene--lite","aria-hidden":"true",children:[y.jsx("img",{src:ue,alt:"",className:"hero-hologram-scene__lite-image"}),y.jsx("div",{className:"hero-hologram-scene__scanlines"}),y.jsx("div",{className:"hero-hologram-scene__vignette"})]}):y.jsxs("div",{ref:f,className:"hero-hologram-scene","aria-hidden":"true",children:[y.jsx("div",{className:"hero-hologram-scene__scanlines"}),y.jsx("div",{className:"hero-hologram-scene__vignette"})]})};export{we as default};
