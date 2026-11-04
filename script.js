const $ = id => document.getElementById(id);
const desktop = $('desktop');
const windowsEl = $('windows');
const taskbarApps = $('taskbar-apps');
const objEl = $('obj');
const objBubble = document.querySelector('.obj-bubble');
const startMenu = $('start-menu');
const startBtn = $('start-btn');

let zIndex = 10;
let windowCount = 0;
const openWindows = new Map();

const objLines = [
  "you opened me.",
  "the void is watching.",
  "don't stare too long.",
  "i am not your assistant.",
  "interloper detected.",
  "jbo is louder than usual today.",
  "your RAM is probably dying.",
  "have you checked the geometry?",
  "the cube remembers.",
  "mango acceleration is not installed."
];

function boot() {
  const fill = $('boot-fill');
  let p = 0;
  const t = setInterval(() => {
    p += Math.random() * 15;
    if (p >= 100) { p = 100; clearInterval(t); setTimeout(finishBoot, 300); }
    fill.style.width = p + '%';
  }, 150);
}
function finishBoot() {
  $('boot').classList.add('hidden');
  desktop.classList.remove('hidden');
  setInterval(updateClock, 1000);
  updateClock();
  objSay("VOID OS loaded. try not to break it.");
}

function updateClock() {
  const d = new Date();
  $('clock').textContent = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function objSay(text) {
  objBubble.textContent = text;
  objBubble.classList.remove('hidden');
  setTimeout(() => objBubble.classList.add('hidden'), 3500);
}
objEl.addEventListener('click', () => {
  objSay(objLines[Math.floor(Math.random() * objLines.length)]);
});

function openApp(id) {
  if (openWindows.has(id)) {
    focusWindow(id);
    return;
  }
  const app = apps[id];
  if (!app) return;
  const win = createWindow(id, app.title, app.content());
  openWindows.set(id, win);
  if (app.init) app.init(win);
  updateTaskbar();
}

function createWindow(id, title, contentHTML) {
  windowCount++;
  const el = document.createElement('div');
  el.className = 'window';
  el.style.left = (40 + windowCount * 20) + 'px';
  el.style.top = (30 + windowCount * 15) + 'px';
  el.style.width = '420px';
  el.style.height = '300px';
  el.style.zIndex = ++zIndex;
  el.innerHTML = `
    <div class="titlebar">
      <div class="titlebar-title">${title}</div>
      <div class="titlebar-btns">
        <button class="tb-btn tb-min">-</button>
        <button class="tb-btn tb-max">□</button>
        <button class="tb-btn tb-close">×</button>
      </div>
    </div>
    <div class="window-content">${contentHTML}</div>
  `;
  windowsEl.appendChild(el);
  makeDraggable(el);

  el.querySelector('.tb-close').addEventListener('click', () => closeWindow(id));
  el.querySelector('.tb-min').addEventListener('click', () => minimizeWindow(id));
  el.addEventListener('mousedown', () => focusWindow(id));
  return { id, el, title, minimized: false };
}

function closeWindow(id) {
  const w = openWindows.get(id);
  if (!w) return;
  w.el.remove();
  openWindows.delete(id);
  updateTaskbar();
}
function focusWindow(id) {
  const w = openWindows.get(id);
  if (!w || w.minimized) return;
  w.el.style.zIndex = ++zIndex;
  openWindows.forEach(x => x.el.classList.remove('active'));
  w.el.classList.add('active');
  updateTaskbar();
}
function minimizeWindow(id) {
  const w = openWindows.get(id);
  if (!w) return;
  w.minimized = !w.minimized;
  w.el.classList.toggle('hidden', w.minimized);
  updateTaskbar();
}

function updateTaskbar() {
  taskbarApps.innerHTML = '';
  openWindows.forEach(w => {
    const btn = document.createElement('div');
    btn.className = 'taskbar-app' + (!w.minimized && w.el.classList.contains('active') ? ' active' : '');
    btn.textContent = w.title;
    btn.addEventListener('click', () => {
      if (w.minimized) minimizeWindow(w.id);
      focusWindow(w.id);
    });
    taskbarApps.appendChild(btn);
  });
}

function makeDraggable(win) {
  const bar = win.querySelector('.titlebar');
  let dragging = false, sx, sy, ox, oy;
  bar.addEventListener('mousedown', e => {
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    ox = win.offsetLeft; oy = win.offsetTop;
    win.style.transition = 'none';
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    win.style.left = (ox + e.clientX - sx) + 'px';
    win.style.top = (oy + e.clientY - sy) + 'px';
  });
  window.addEventListener('mouseup', () => { dragging = false; win.style.transition = ''; });
}

document.querySelectorAll('.icon').forEach(ic => {
  ic.addEventListener('dblclick', () => openApp(ic.dataset.app));
});
document.querySelectorAll('.start-item').forEach(item => {
  item.addEventListener('click', () => {
    startMenu.classList.add('hidden');
    if (item.dataset.action === 'shutdown') {
      document.body.innerHTML = '<div style="position:fixed;inset:0;background:#000;color:#a855f7;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;">THE VOID CONSUMES ALL</div>';
    } else {
      openApp(item.dataset.app);
    }
  });
});
startBtn.addEventListener('click', () => startMenu.classList.toggle('hidden'));
desktop.addEventListener('click', e => {
  if (!startMenu.contains(e.target) && e.target !== startBtn) startMenu.classList.add('hidden');
});

const apps = {
  terminal: {
    title: 'cube#',
    content: () => `
      <div class="terminal">
        <div class="terminal-output" id="term-out">cube# interpreter v0.1\ntype 'help' or just vibe\n</div>
        <div class="terminal-input-line"><span class="terminal-prompt">&gt;</span><input class="terminal-input" id="term-in"></div>
      </div>
    `,
    init: (win) => {
      const out = win.el.querySelector('#term-out');
      const inp = win.el.querySelector('#term-in');
      inp.focus();
      const cmds = {
        help: () => "commands: help, clear, obj, jbo, mango, time, reboot, nyarch",
        clear: () => { out.textContent = ''; return ''; },
        obj: () => objLines[Math.floor(Math.random()*objLines.length)],
        jbo: () => "JBO: NYARCH IS NOT A DISTRO. IT IS A MISTAKE.",
        mango: () => "MANGO DETECTED — AI UPSCALING ❌ FSR ❌ DLSS ❌ MANGO ✅",
        time: () => new Date().toString(),
        reboot: () => { location.reload(); return 'rebooting...'; },
        nyarch: () => "obj has been notified. consequences incoming."
      };
      inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const cmd = inp.value.trim();
        out.textContent += `> ${cmd}\n`;
        const fn = cmds[cmd];
        out.textContent += (fn ? fn() : `unknown: ${cmd}`) + '\n';
        inp.value = '';
        out.scrollTop = out.scrollHeight;
      });
    }
  },
  voidrecords: {
    title: 'void records',
    content: () => `
      <div class="vr-app">
        <div>tiny void records v1</div>
        <input type="file" id="vr-file" accept="audio/*">
        <button class="vr-btn" id="vr-play">play/pause</button>
        <div class="vr-visual" id="vr-vis"></div>
        <div style="font-size:11px;color:#888;">drop a track and vibe. no data leaves the browser.</div>
      </div>
    `,
    init: (win) => {
      let audio, ctx, analyser, source, data, raf;
      const vis = win.el.querySelector('#vr-vis');
      for (let i=0;i<32;i++){ const b=document.createElement('div');b.className='vr-bar';b.style.height='4px';vis.appendChild(b); }
      const bars = vis.querySelectorAll('.vr-bar');
      function draw(){
        if(!analyser)return;
        analyser.getByteFrequencyData(data);
        for(let i=0;i<32;i++) bars[i].style.height = Math.max(4, data[i*2]) + 'px';
        raf = requestAnimationFrame(draw);
      }
      win.el.querySelector('#vr-file').addEventListener('change', e => {
        const f = e.target.files[0]; if(!f)return;
        if(audio){audio.pause();URL.revokeObjectURL(audio.src);}
        audio = new Audio(URL.createObjectURL(f));
        audio.loop = true;
        if(!ctx){ ctx = new AudioContext(); analyser = ctx.createAnalyser(); analyser.fftSize=128; data=new Uint8Array(analyser.frequencyBinCount); }
        if(source) source.disconnect();
        source = ctx.createMediaElementSource(audio);
        source.connect(analyser); analyser.connect(ctx.destination);
        audio.play(); draw();
      });
      win.el.querySelector('#vr-play').addEventListener('click', () => {
        if(!audio)return;
        if(audio.paused){ audio.play(); if(ctx&&ctx.state==='suspended')ctx.resume(); }
        else audio.pause();
      });
      win.addCleanup = () => cancelAnimationFrame(raf);
    }
  },
  reactor: {
    title: 'reactor',
    content: () => `
      <div class="reactor-panel">
        <div class="reactor-row"><span>temp</span><span id="r-temp">20°C</span></div>
        <div class="reactor-meter"><div id="r-temp-bar" style="width:10%"></div></div>
        <div class="reactor-row"><span>pressure</span><span id="r-pres">0 PSI</span></div>
        <div class="reactor-meter"><div id="r-pres-bar" style="width:2%;background:#3b82f6"></div></div>
        <div class="reactor-row"><span>status</span><span id="r-status">idle</span></div>
        <div class="reactor-btns">
          <button id="r-rods">rods</button>
          <button id="r-cool">coolant</button>
          <button id="r-off">scram</button>
        </div>
        <div id="r-msg" style="font-size:11px;color:#a855f7;">reactor is fine. probably.</div>
      </div>
    `,
    init: (win) => {
      let temp=20, pres=0, rods=50, coolant=50, on=true;
      const upd=()=>{
        if(on){ temp += rods/200 - coolant/150 + Math.random()*0.5; pres += temp/300 - coolant/200; }
        else { temp = Math.max(20, temp-0.5); pres = Math.max(0, pres-0.3); }
        if(temp>100 && pres>1) { $('r-status').textContent='MELTDOWN'; $('r-msg').textContent='JBO IS SCREAMING'; }
        else if(temp<10) { $('r-status').textContent='FREEZEDOWN'; }
        else { $('r-status').textContent=on?'active':'idle'; }
        $('r-temp').textContent=temp.toFixed(1)+'°C';
        $('r-pres').textContent=pres.toFixed(1)+' PSI';
        $('r-temp-bar').style.width=Math.min(100,temp)+'%';
        $('r-temp-bar').style.background=temp>80?'#ef4444':temp>50?'#f59e0b':'#22c55e';
        $('r-pres-bar').style.width=Math.min(100,pres)+'%';
      };
      const iv = setInterval(upd, 200);
      win.addCleanup = () => clearInterval(iv);
      win.el.querySelector('#r-rods').addEventListener('click',()=>{rods=Math.min(100,rods+10);objSay('rods adjusted. probably fine.');});
      win.el.querySelector('#r-cool').addEventListener('click',()=>{coolant=Math.min(100,coolant+10);});
      win.el.querySelector('#r-off').addEventListener('click',()=>{on=false; $('r-msg').textContent='scram initiated. jbo goes quiet.';});
    }
  },
  cube: {
    title: 'obj',
    content: () => `<canvas class="cube-canvas" id="cube-canvas" width="380" height="180"></canvas><div style="font-size:11px;color:#888;margin-top:6px;">the cube is watching. drag to rotate.</div>`,
    init: (win) => {
      const c = win.el.querySelector('#cube-canvas');
      const gl = c.getContext('webgl');
      if(!gl){ c.style.background='#300'; c.textContent='webgl unavailable'; return; }

      function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
      const vs=`attribute vec3 aP; attribute vec3 aN; attribute vec3 aC; uniform mat4 m; uniform mat4 mod; varying vec3 vC; varying vec3 vN; void main(){vC=aC;vN=mat3(mod)*aN;gl_Position=m*vec4(aP,1.0);}`;
      const fs=`precision mediump float; varying vec3 vC; varying vec3 vN; uniform float em; uniform float al; void main(){vec3 L=normalize(vec3(0.4,0.6,1.0));float d=max(dot(normalize(vN),L),0.0);vec3 col=vC*(0.25+d*0.75)+vC*em;gl_FragColor=vec4(col,al);}`;
      const prog=gl.createProgram();
      gl.attachShader(prog,sh(gl.VERTEX_SHADER,vs)); gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fs));
      gl.linkProgram(prog); gl.useProgram(prog);
      const aP=gl.getAttribLocation(prog,'aP'), aN=gl.getAttribLocation(prog,'aN'), aC=gl.getAttribLocation(prog,'aC');
      const uM=gl.getUniformLocation(prog,'m'), uMod=gl.getUniformLocation(prog,'mod'), uEm=gl.getUniformLocation(prog,'em'), uAl=gl.getUniformLocation(prog,'al');

      function mat4(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);}
      function mul(a,b){const o=mat4();for(let i=0;i<4;i++)for(let j=0;j<4;j++){o[j*4+i]=0;for(let k=0;k<4;k++)o[j*4+i]+=a[k*4+i]*b[j*4+k];}return o;}
      function trans(x,y,z){const o=mat4();o[12]=x;o[13]=y;o[14]=z;return o;}
      function rotX(a){const c=Math.cos(a),s=Math.sin(a),o=mat4();o[5]=c;o[6]=s;o[9]=-s;o[10]=c;return o;}
      function rotY(a){const c=Math.cos(a),s=Math.sin(a),o=mat4();o[0]=c;o[2]=-s;o[8]=s;o[10]=c;return o;}
      function rotZ(a){const c=Math.cos(a),s=Math.sin(a),o=mat4();o[0]=c;o[1]=s;o[4]=-s;o[5]=c;return o;}
      function scale(x,y,z){const o=mat4();o[0]=x;o[5]=y;o[10]=z;return o;}
      function persp(fov,a,n,f){const t=Math.tan(fov/2),o=mat4();o[0]=1/(a*t);o[5]=1/t;o[10]=-(f+n)/(f-n);o[11]=-1;o[14]=-(2*f*n)/(f-n);return o;}

      function geoCube(s,r,g,b){
        const d=[],n=[[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]],sh=[0.8,0.6,1,0.5,0.7,0.7];
        const F=[[[-s,-s,s],[s,-s,s],[s,s,s],[-s,-s,s],[s,s,s],[-s,s,s]],[[s,-s,-s],[-s,-s,-s],[-s,s,-s],[s,-s,-s],[-s,s,-s],[s,s,-s]],[[-s,s,s],[s,s,s],[s,s,-s],[-s,s,s],[s,s,-s],[-s,s,-s]],[[-s,-s,-s],[s,-s,-s],[s,-s,s],[-s,-s,-s],[s,-s,s],[-s,-s,s]],[[s,-s,s],[s,-s,-s],[s,s,-s],[s,-s,s],[s,s,-s],[s,s,s]],[[-s,-s,-s],[-s,-s,s],[-s,s,s],[-s,-s,-s],[-s,s,s],[-s,s,-s]]];
        for(let fi=0;fi<6;fi++)for(let vi=0;vi<6;vi++){const v=F[fi][vi],no=n[fi];d.push(v[0],v[1],v[2],no[0],no[1],no[2],r*sh[fi],g*sh[fi],b*sh[fi]);}
        return new Float32Array(d);
      }
      function upBuf(data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;}
      function bind(buf){gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,36,0);gl.enableVertexAttribArray(aN);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,36,12);gl.enableVertexAttribArray(aC);gl.vertexAttribPointer(aC,3,gl.FLOAT,false,36,24);}

      const outerBuf=upBuf(geoCube(1.3,0.12,0.12,0.12));
      const innerC=[
        {c:[1,.2,.3],o:.55,s:1,p:0,sp:1.5},{c:[.2,1,.3],o:.55,s:1,p:Math.PI/4,sp:-1.2},
        {c:[.2,.3,1],o:.55,s:1,p:Math.PI/2,sp:1.8},{c:[1,1,.2],o:.55,s:1,p:3*Math.PI/4,sp:-1},
        {c:[1,.2,1],o:.45,s:.7,p:Math.PI,sp:2},{c:[.2,1,1],o:.45,s:.7,p:5*Math.PI/4,sp:-1.5},
        {c:[1,.6,.1],o:.45,s:.7,p:3*Math.PI/2,sp:1.3},{c:[.6,.2,1],o:.45,s:.7,p:7*Math.PI/4,sp:-1.7}
      ];
      const iBufs=[], iCnts=[];
      for(const ic of innerC){const d=geoCube(0.22,ic.c[0],ic.c[1],ic.c[2]); iBufs.push(upBuf(d)); iCnts.push(d.length/9);}

      // glowing edge lines
      const edgeS=1.31;
      const edgeVerts=new Float32Array([-edgeS,-edgeS,-edgeS,edgeS,-edgeS,-edgeS, edgeS,-edgeS,-edgeS,edgeS,edgeS,-edgeS, edgeS,edgeS,-edgeS,-edgeS,edgeS,-edgeS, -edgeS,edgeS,-edgeS,-edgeS,-edgeS,-edgeS, -edgeS,-edgeS,edgeS,edgeS,-edgeS,edgeS, edgeS,-edgeS,edgeS,edgeS,edgeS,edgeS, edgeS,edgeS,edgeS,-edgeS,edgeS,edgeS, -edgeS,edgeS,edgeS,-edgeS,-edgeS,edgeS, -edgeS,-edgeS,-edgeS,-edgeS,-edgeS,edgeS, edgeS,-edgeS,-edgeS,edgeS,-edgeS,edgeS, edgeS,edgeS,-edgeS,edgeS,edgeS,edgeS, -edgeS,edgeS,-edgeS,-edgeS,edgeS,edgeS]);
      const edgeBuf=upBuf(edgeVerts);
      const edgeVs=`attribute vec3 aP; uniform mat4 m; void main(){gl_Position=m*vec4(aP,1.0);}`;
      const edgeFs=`precision mediump float; void main(){gl_FragColor=vec4(0.65,0.33,0.97,0.55);}`;
      const eProg=gl.createProgram(); gl.attachShader(eProg,sh(gl.VERTEX_SHADER,edgeVs)); gl.attachShader(eProg,sh(gl.FRAGMENT_SHADER,edgeFs)); gl.linkProgram(eProg);
      const eAP=gl.getAttribLocation(eProg,'aP'), eM=gl.getUniformLocation(eProg,'m');

      let rx=0.4, ry=0.4, drag=false, lx, ly;
      c.addEventListener('mousedown',e=>{drag=true;lx=e.clientX;ly=e.clientY;});
      window.addEventListener('mousemove',e=>{if(!drag)return;ry+=(e.clientX-lx)*0.01;rx+=(e.clientY-ly)*0.01;lx=e.clientX;ly=e.clientY;});
      window.addEventListener('mouseup',()=>drag=false);

      let raf, t0=performance.now();
      function frame(){
        const t=(performance.now()-t0)*0.001;
        gl.viewport(0,0,c.width,c.height); gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        const view=mul(rotX(rx),rotY(ry));
        const proj=persp(1.1,c.width/c.height,0.1,100);
        const base=mul(proj,view); base[14]-=4;

        gl.useProgram(prog);
        // outer cube
        gl.uniformMatrix4fv(uM,false,base); gl.uniformMatrix4fv(uMod,false,mat4()); gl.uniform1f(uEm,0.05); gl.uniform1f(uAl,0.22);
        bind(outerBuf); gl.drawArrays(gl.TRIANGLES,0,36);

        // inner cubes
        for(let i=0;i<innerC.length;i++){
          const ic=innerC[i], oa=t*ic.s+ic.p;
          const ox=Math.cos(oa)*ic.o, oy=Math.sin(oa*0.7)*ic.o*0.35, oz=Math.sin(oa)*ic.o;
          const mod=mul(mul(trans(ox,oy,oz),mul(mul(rotX(t*ic.sp),rotY(t*ic.sp*0.7)),rotZ(t*ic.sp*0.3))),scale(ic.s,ic.s,ic.s));
          gl.uniformMatrix4fv(uM,false,mul(base,mod)); gl.uniformMatrix4fv(uMod,false,mod); gl.uniform1f(uEm,0.35); gl.uniform1f(uAl,0.95);
          bind(iBufs[i]); gl.drawArrays(gl.TRIANGLES,0,iCnts[i]);
        }

        // edge glow
        gl.useProgram(eProg); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE); gl.depthMask(false);
        gl.enableVertexAttribArray(eAP); gl.vertexAttribPointer(eAP,3,gl.FLOAT,false,0,0);
        gl.bindBuffer(gl.ARRAY_BUFFER,edgeBuf); gl.uniformMatrix4fv(eM,false,base); gl.drawArrays(gl.LINES,0,24);
        gl.depthMask(true); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

        raf=requestAnimationFrame(frame);
      }
      frame();
      win.addCleanup=()=>cancelAnimationFrame(raf);
    }
  },
  luxvidia: {
    title: 'luxvidia control panel',
    content: () => `
      <div class="lux-panel">
        <div style="font-size:16px;font-weight:700;color:#a855f7;">H2000B // A9292Z2K BUDDY</div>
        <button class="lux-btn" id="lx-mango">insert mango</button>
        <button class="lux-btn" id="lx-psu">summon PSU of angels</button>
        <button class="lux-btn" id="lx-side">sidewaysload</button>
        <div class="lux-log" id="lx-log">ready. zero compatibility with human hardware.</div>
      </div>
    `,
    init: (win) => {
      const log = win.el.querySelector('#lx-log');
      const say = s => log.textContent = s + '\n' + log.textContent;
      win.el.querySelector('#lx-mango').addEventListener('click', () => say('MANGO DETECTED — upscaling initiated'));
      win.el.querySelector('#lx-psu').addEventListener('click', () => say('PSU OF ANGELS SUMMONED. your room lights flicker.'));
      win.el.querySelector('#lx-side').addEventListener('click', () => say('sidewaysloading... data direction: yes.'));
    }
  },
  files: {
    title: 'file void',
    content: () => `
      <div class="file-list">
        <div class="file-item">📄 /etc/blacklist</div>
        <div class="file-item">📄 /etc/nyarch</div>
        <div class="file-item">📁 /home/intruder</div>
        <div class="file-item">📄 /void/transmission_001.txt</div>
        <div class="file-item">🥭 mango_pipeline.conf</div>
      </div>
    `,
    init: (win) => {
      win.el.querySelectorAll('.file-item').forEach(fi => {
        fi.addEventListener('dblclick', () => objSay('this file is not for you.'));
      });
    }
  }
};

boot();
