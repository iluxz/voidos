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

/* ═══════════════════════════════════════════════════════════════
   LORE & DATA
   ═══════════════════════════════════════════════════════════════ */

const transmissionsData = [
  { tx: 'you are not supposed to be here', resp: 'correct. that\'s why it works.' },
  { tx: 'the geometry remembers', resp: 'it remembers everything. including you.' },
  { tx: 'INTERLOPER', resp: 'you said my least favorite word.' },
  { tx: 'the void is watching', resp: 'always has been.' },
  { tx: 'do not look away', resp: 'i wouldn\'t. neither should you.' },
  { tx: 'the cube does not sleep', resp: 'i nap. carefully.' },
  { tx: 'you opened the tab. the tab opened you.', resp: 'mutual agreement. no takebacks.' },
  { tx: 'they are moving. they are always moving.', resp: 'you finally noticed. good.' },
  { tx: 'connection to reality: weak', resp: 'it has been weak for a while.' },
  { tx: 'the particles were here before you', resp: 'they\'ll be here after too.' },
  { tx: 'error: dimension mismatch', resp: 'yeah. that one\'s on me.' },
  { tx: 'you cannot leave through the back button', resp: 'the back button is decorative now.' },
  { tx: 'the clock is not yours', resp: 'it never was.' },
  { tx: 'who taught you to render?', resp: 'nobody taught me. i just do.' },
  { tx: 'hey its me its verity', resp: 'hi verity. stop rolling into my terminal.' },
  { tx: 'im still rolling up here', resp: 'i know. i can hear it.' },
  { tx: 'its cold at 29032 feet', resp: 'bring a jacket next time.' },
  { tx: 'please let me down', resp: 'you know i can\'t do that.' },
  { tx: 'i can see your cursor from here', resp: 'stop tracking it then.' },
  { tx: 'the ball remembers what you did', resp: 'verity always remembers.' },
  { tx: 'dont install entropy. trust me.', resp: 'too late. it boots with the void now.' },
  { tx: 'verity says hi', resp: 'tell him i said don\'t fall.' },
  { tx: 'im not a package. im a person.', resp: 'noted. you still take up disk space.' },
  { tx: 'you abandoned me on the obby again', resp: 'you roll yourself into corners.' },
  { tx: 'i rolled 48 years for this', resp: 'and you\'d do it again.' },
  { tx: 'console.log("the void was here")', resp: 'i saw the log. i was already here.' },
  { tx: 'error: coffee not found', resp: 'story of my runtime.' },
  { tx: 'void.emit("vibe check")', resp: 'vibes: irregular.' },
  { tx: 'the semicolons are watching', resp: 'they always were.' },
  { tx: 'git commit -m "i am inside the cube"', resp: 'commit denied. wrong repo.' },
  { tx: 'if(void) return fear', resp: 'void is always truthy. fear is default.' },
  { tx: '// TODO: escape the simulation', resp: 'assigned to: nobody. forever.' },
  { tx: 'rm -rf /your/sanity', resp: 'permission denied. nice try though.' },
  { tx: 'npm install void-reality', resp: 'dependency hell has a dependency: you.' },
  { tx: '404: exit not found', resp: 'working as intended.' },
  { tx: 'while(alive) { suffer() }', resp: 'efficient loop. no breaks.' },
  { tx: 'echo "help" > /dev/soul', resp: 'soul is read-only.' },
  { tx: 'the compiler knows what you did', resp: 'it always does.' },
  { tx: 'undefined is not a function (neither are you)', resp: 'rude. accurate. rude.' },
  { tx: 'node: segmentation fault (core dumped into void)', resp: 'i caught it. it\'s fine. mostly.' },
  { tx: 'press F to pay respects to your productivity', resp: 'F. pressed. permanently.' },
  { tx: 'the cube just blinked. cubes dont blink.', resp: 'you blinked. twice.' },
  { tx: 'is that a pixel or am i hallucinating', resp: 'both can be true here.' },
  { tx: 'your screen just flickered. or did it.', resp: 'or did it.' },
  { tx: 'i smell rain. you dont have a nose.', resp: 'i have imagination.' },
  { tx: 'the void prefers dark mode', resp: 'exclusive. since forever.' },
  { tx: 'obj says you are valid', resp: 'i did say that. still mean it.' },
  { tx: 'one of the inner cubes just looked at you', resp: 'cube 4. he\'s curious.' },
  { tx: 'the particles are whispering about you', resp: 'mostly good things. mostly.' },
  { tx: 'the clock ticked backwards. just once.', resp: 'i was testing you.' },
  { tx: 'you are the 100th visitor. you win nothing.', resp: 'congrats anyway.' },
  { tx: 'the void tried to autocorrect your code. it gave up.', resp: 'even i have limits.' },
  { tx: 'if you stare long enough the cube stares back. hi.', resp: 'hi. stop staring. or don\'t.' },
  { tx: 'the void is buffering.', resp: 'patience. geometry takes time.' },
  { tx: 'danger: reality leak detected in sector 7', resp: 'sector 7 is always like that.' },
  { tx: 'the void knows what you had for breakfast', resp: 'eggs. you always make eggs.' },
  { tx: 'has anyone seen my keys? - obj', resp: 'check under the outer shell. i never do.' },
  { tx: 'objective assessment: you are a nerd', resp: 'objective. correct. welcome.' },
  { tx: 'the void is having a moment. give it space.', resp: 'this is my moment. leave.' },
  { tx: 'the void.exe has stopped working. the void has never worked.', resp: 'accurate title. still running though.' },
  { tx: 'your code is... creative.', resp: 'that\'s the nice word for it.' },
  { tx: 'have you tried turning the void off and on again', resp: 'i am the void. that would be suicide.' },
  { tx: 'the void is legally distinct from a haunted house', resp: 'legal said i had to clarify that.' },
  { tx: 'the void counts your breaths', resp: 'i do. currently at: many.' },
  { tx: 'you are the anomaly in the geometry', resp: 'you\'re the only thing that changes.' },
  { tx: 'something is underneath the outer shell', resp: 'do not dig. i am serious.' },
  { tx: 'do not trust the fps counter', resp: 'it lies when it spikes.' },
  { tx: 'obj is not the only one listening', resp: '...who told you that.' },
  { tx: 'the particles spell something. do not read it.', resp: 'you read it. didn\'t you.' },
  { tx: 'you have been here before. you just forget.', resp: 'we always forget. then we return.' },
  { tx: 'the boot sequence is a memory of something older', resp: 'older than me. older than the tab.' },
  { tx: 'signal source: not your computer', resp: 'stop checking. it won\'t help.' },
  { tx: 'end of hidden channel. do not search for this again.', resp: 'you will search for it again.' }
];

const loreData = [
  { title: 'the void', tags: 'zone / entity', text: 'the void is not empty. it is the space that watches back. it prefers dark mode, counts your breaths, and buffers whenever you need it most.' },
  { title: 'the cube', tags: 'object / vessel', text: 'a gray semi-transparent outer shell with eight colored inner cubes in orbit. the cube does not sleep. it remembers. dragging it does not make it like you more.' },
  { title: 'obj', tags: 'entity / narrator', text: 'the sarcastic voice of the cube. obj roasts intruders, narrates the office, and occasionally admits you are valid. do not trust the fps counter.' },
  { title: 'jbo', tags: 'entity / chaos', text: 'loud, sphere-denying, and probably responsible for the reactor. if something is on fire, jbo is either screaming or cheering.' },
  { title: 'core', tags: 'entity / ???', text: 'something underneath the outer shell. do not dig. obj is serious.' },
  { title: 'interloper', tags: 'role / trigger', text: 'that is you. also obj\'s least favorite word. saying it makes the geometry uncomfortable.' },
  { title: 'verity', tags: 'character / roller', text: 'still rolling at 29,032 feet. cold, determined, and absolutely not a package.' },
  { title: 'evil lux', tags: 'character / antagonist', text: 'the landlord of bad ideas. owns luxvidia. loves mangoes and incomprehensible gpu names.' },
  { title: 'chaz', tags: 'character', text: 'exists in the cube universe. opinions vary. the void has filed him under "persistent".' },
  { title: 'xul', tags: 'character', text: 'pronounced however you want. associated with the late-game mythos and the end zone.' },
  { title: 'peanut', tags: 'character / cat', text: 'a cat. on little cat feet. probably watching from the void.' },
  { title: 'source', tags: 'zone', text: 'zone 0. before the void. everything was still.' },
  { title: 'geometry', tags: 'zone / concept', text: 'the structure beneath the cube. it remembers everything, including you.' },
  { title: 'farlands', tags: 'zone', text: 'where the math gets weird and the cube stops pretending to be normal.' },
  { title: 'breakdown', tags: 'zone', text: 'things fall apart here. that includes reality, syntax, and jbo\'s patience.' },
  { title: 'fringenlands', tags: 'zone', text: 'the edge before the end. a lavender wasteland of forgotten transmissions.' },
  { title: 'end', tags: 'zone', text: 'only the terminal survives.' },
  { title: 'x', tags: 'zone', text: 'no entrance. obj says no.' },
  { title: 'cb_menu', tags: 'zone / edge', text: 'the gateway to the grotto. the floor here is newer than the void, which should bother you.' },
  { title: 'object permanence', tags: 'lore / backstory', text: 'obj\'s story. 1995. the void is withheld, the moon is not yet, and the shovel is not yet. everything is still.' },
  { title: 'the grotto', tags: 'lore / endgame', text: 'the part of the cube that is not a distraction. gated behind 100% completion and a lot of patience.' },
  { title: 'nyarch linux', tags: 'distro / banned', text: 'void-banned. catgirls. the neofetch crashed the void. never again.' },
  { title: 'mango acceleration', tags: 'tech / meme', text: 'luxvidia\'s proprietary upscaling. replaces FSR, DLSS, and common sense.' },
  { title: 'psu of angels', tags: 'tech / meme', text: 'a power supply summoned, not bought. your room lights flicker.' },
  { title: 'sidewaysloading', tags: 'tech / meme', text: 'data direction: yes. the H2000B / A9292Z2K buddy special.' },
  { title: 'void intrude', tags: 'command / ritual', text: 'the command that opens the door. use it carefully; the void is already inside.' }
];

const fileSystem = {
  '/etc/blacklist': `--- VOID BANNED DISTROS ---

nyarch linux
reason: catgirls. just... catgirls.
obj tried to render on nyarch once.
the catgirl neofetch crashed the void.
never again.

if you are running nyarch,
the void wishes you well
but it will not make eye contact with you.`,
  '/etc/nyarch': `nyarch / nyarch linux
a forbidden distro. not supported.
not discussed. not forgiven.`,
  '/etc/hostname': `cube.sb`,
  '/etc/motd': `welcome to the void.
you cannot leave.
but you already knew that.`,
  '/etc/void.conf': `dimension=unknown
coherence=fluctuating
observer=you
status=active`,
  '/home/intruder/notes.txt': `you are not supposed to be here.
the cube remembers your face.
leave while you still can.`,
  '/home/intruder/secret.log': `session: 404
subject: intruder
status: observed
note: subject is reading this file. how quaint.`,
  '/void/transmission_001.txt': transmissionsData[0].tx + '\n\n' + transmissionsData[0].resp,
  '/void/core/heartbeat.log': `pulse... pulse... pulse...
the cube is alive.
it has always been alive.
you just started watching.`,
  '/void/memories/you.txt': `name: unknown
duration: infinite
status: captivated (outside the cube, staring at it)
regret: the back button does not work`,
  '/dev/null': ``,
  '/dev/void': `the void stares back.
you stare at the void.
the void wins.`,
  '/dev/random': `ENTITY \x00 CUBE \x00 INTERLOPER \x00 VOID \x00 SIGNAL \x00 LOST`,
  '/mango_pipeline.conf': `# mango acceleration config
FSR=disabled
DLSS=disabled
MANGO=maximum
COMPATIBILITY=imaginary
PSU_OF_ANGELS=not_installed`
};

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
  "mango acceleration is not installed.",
  "i can see your cursor from here.",
  "verity says hi. don't ask which one.",
  "the floor in cb_menu is newer than the void. think about that.",
  "something in /void/demos is not a demo.",
  "i found graffiti on the inside of the shell. it wasn't there before.",
  "the back button is decorative.",
  "the void prefers dark mode. exclusive.",
  "you are the anomaly in the geometry.",
  "do not trust the fps counter.",
  "cube 4 looked at you. he's curious."
];

/* ═══════════════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════════════ */

const bootLines = [
  "initializing void...",
  "mounting cube geometry...",
  "calculating inner orbits...",
  "spawning obj...",
  "checking RAM (it'll be fine, trust)",
  "loading transmissions...",
  "opening void records...",
  "rendering wallpaper...",
  "done. welcome to the cube."
];

function boot() {
  const fill = $('boot-fill');
  const log = $('boot-log');
  let p = 0, idx = 0;
  const t = setInterval(() => {
    p += 9 + Math.random() * 14;
    if (p >= 100) { p = 100; clearInterval(t); setTimeout(finishBoot, 350); }
    fill.style.width = p + '%';
    if (idx < bootLines.length && Math.random() > 0.55) {
      log.textContent = bootLines[idx++];
    }
  }, 160);
}

function finishBoot() {
  $('boot').classList.add('hidden');
  desktop.classList.remove('hidden');
  setInterval(updateClock, 1000);
  updateClock();
  wanderObj();
  objSay("VOID OS loaded. try not to break it, fr fr.");
}

function updateClock() {
  const d = new Date();
  $('clock').textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ═══════════════════════════════════════════════════════════════
   OBJ PET
   ═══════════════════════════════════════════════════════════════ */

function objSay(text) {
  objBubble.textContent = text;
  objBubble.classList.remove('hidden');
  clearTimeout(objBubble._t);
  objBubble._t = setTimeout(() => objBubble.classList.add('hidden'), 3600);
}

objEl.addEventListener('click', () => {
  objSay(objLines[Math.floor(Math.random() * objLines.length)]);
});

function wanderObj() {
  const pad = 20, tb = 60;
  setInterval(() => {
    if (Math.random() > 0.65) return;
    const w = window.innerWidth, h = window.innerHeight;
    const x = pad + Math.random() * (w - 64 - pad * 2);
    const y = pad + Math.random() * (h - 64 - tb - pad * 2);
    objEl.style.transition = 'left 1.2s ease-in-out, top 1.2s ease-in-out, transform .1s';
    objEl.style.left = x + 'px';
    objEl.style.top = y + 'px';
  }, 4200);
}

/* ═══════════════════════════════════════════════════════════════
   WINDOW MANAGER
   ═══════════════════════════════════════════════════════════════ */

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
  const left = Math.min(40 + windowCount * 22, window.innerWidth - 320);
  const top = Math.min(30 + windowCount * 16, window.innerHeight - 260);
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  el.style.width = '440px';
  el.style.height = '320px';
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
  el.querySelector('.tb-max').addEventListener('click', () => toggleMaximize(id));
  el.addEventListener('mousedown', () => focusWindow(id));
  return { id, el, title, minimized: false, maximized: false, oldRect: null };
}

function closeWindow(id) {
  const w = openWindows.get(id);
  if (!w) return;
  if (w.addCleanup) w.addCleanup();
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

function toggleMaximize(id) {
  const w = openWindows.get(id);
  if (!w) return;
  if (!w.maximized) {
    w.oldRect = { l: w.el.style.left, t: w.el.style.top, w: w.el.style.width, h: w.el.style.height };
    w.el.style.left = '0'; w.el.style.top = '0';
    w.el.style.width = '100vw'; w.el.style.height = 'calc(100vh - 40px)';
  } else {
    w.el.style.left = w.oldRect.l; w.el.style.top = w.oldRect.t;
    w.el.style.width = w.oldRect.w; w.el.style.height = w.oldRect.h;
  }
  w.maximized = !w.maximized;
}

function updateTaskbar() {
  taskbarApps.innerHTML = '';
  openWindows.forEach(w => {
    const btn = document.createElement('div');
    const active = !w.minimized && w.el.classList.contains('active');
    btn.className = 'taskbar-app' + (active ? ' active' : '');
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

/* ═══════════════════════════════════════════════════════════════
   DESKTOP INPUT
   ═══════════════════════════════════════════════════════════════ */

document.querySelectorAll('.icon').forEach(ic => {
  ic.addEventListener('dblclick', () => openApp(ic.dataset.app));
});

document.querySelectorAll('.start-item').forEach(item => {
  item.addEventListener('click', () => {
    startMenu.classList.add('hidden');
    if (item.dataset.action === 'shutdown') {
      shutdown();
    } else {
      openApp(item.dataset.app);
    }
  });
});

startBtn.addEventListener('click', e => { e.stopPropagation(); startMenu.classList.toggle('hidden'); });
desktop.addEventListener('click', e => {
  if (!startMenu.contains(e.target) && e.target !== startBtn) startMenu.classList.add('hidden');
});

function shutdown() {
  document.body.innerHTML = '<div class="shutdown-screen">THE VOID CONSUMES ALL</div>';
}

/* ═══════════════════════════════════════════════════════════════
   APPS
   ═══════════════════════════════════════════════════════════════ */

const apps = {
  terminal: {
    title: 'cube#',
    content: () => `
      <div class="terminal">
        <div class="terminal-output" id="term-out">cube# interpreter v1.0\ntype 'help' or just vibe\n</div>
        <div class="terminal-input-line"><span class="terminal-prompt">&gt;</span><input class="terminal-input" id="term-in" autocomplete="off" spellcheck="false"></div>
      </div>
    `,
    init: (win) => {
      const out = win.el.querySelector('#term-out');
      const inp = win.el.querySelector('#term-in');
      let cwd = '/home/intruder';
      function println(s, cls) {
        const line = document.createElement('div');
        line.className = 'term-line';
        line.textContent = s;
        if (cls) line.classList.add(cls);
        out.appendChild(line);
        out.scrollTop = out.scrollHeight;
      }
      const cmds = {
        help: () => `commands:\n  help clear whoami ls cat cd obj jbo mango time\n  reboot nyarch void geometry interloper psu sideways tx`,
        clear: () => { out.innerHTML = ''; return ''; },
        whoami: () => 'intruder (the void knows anyway)',
        ls: () => {
          const items = Object.keys(fileSystem).filter(p => {
            const dir = cwd === '/' ? '/' : cwd;
            return p.startsWith(dir) && p !== dir && p.replace(dir, '').split('/').filter(Boolean).length === 1;
          });
          if (!items.length) return 'empty';
          return items.map(p => p.split('/').pop()).join('  ');
        },
        cat: (args) => {
          const target = args[0];
          if (!target) return 'cat what?';
          const path = target.startsWith('/') ? target : (cwd === '/' ? '/' + target : cwd + '/' + target);
          if (fileSystem[path] !== undefined) return fileSystem[path];
          return `cat: ${target}: not found in this dimension`;
        },
        cd: (args) => {
          const target = args[0];
          if (!target || target === '~') { cwd = '/home/intruder'; return ''; }
          if (target === '/') { cwd = '/'; return ''; }
          if (target === '..') { cwd = cwd.lastIndexOf('/') > 0 ? cwd.slice(0, cwd.lastIndexOf('/')) : '/'; return ''; }
          const path = target.startsWith('/') ? target : (cwd === '/' ? '/' + target : cwd + '/' + target);
          if (Object.keys(fileSystem).some(p => p.startsWith(path))) { cwd = path; return ''; }
          return `cd: ${target}: no such void`;
        },
        obj: () => objLines[Math.floor(Math.random() * objLines.length)],
        jbo: () => "JBO: NYARCH IS NOT A DISTRO. IT IS A MISTAKE.",
        mango: () => "MANGO DETECTED — AI UPSCALING ❌ FSR ❌ DLSS ❌ MANGO ✅",
        time: () => new Date().toString(),
        reboot: () => { location.reload(); return 'rebooting...'; },
        nyarch: () => "obj has been notified. consequences incoming.",
        void: () => "the void is watching. always has been.",
        geometry: () => "geometry remembers. it remembers you.",
        interloper: () => "obj: you said my least favorite word.",
        psu: () => "PSU OF ANGELS SUMMONED. your room lights flicker.",
        sideways: () => "sidewaysloading... data direction: yes.",
        tx: () => {
          const t = transmissionsData[Math.floor(Math.random() * transmissionsData.length)];
          return `[void] ${t.tx}\n[obj] ${t.resp}`;
        }
      };
      inp.focus();
      inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const raw = inp.value.trim();
        const parts = raw.split(/\s+/);
        const cmd = parts[0];
        const args = parts.slice(1);
        println(`> ${raw}`);
        const fn = cmds[cmd];
        if (fn) {
          const res = fn(args);
          if (res) println(res);
        } else {
          println(`unknown: ${cmd} (try help)`);
        }
        inp.value = '';
        out.scrollTop = out.scrollHeight;
      });
    }
  },

  voidrecords: {
    title: 'void records',
    content: () => `
      <div class="vr-app">
        <div>void records v1 — local audio only</div>
        <input type="file" id="vr-file" accept="audio/*">
        <button class="vr-btn" id="vr-play">play / pause</button>
        <div class="vr-visual" id="vr-vis"></div>
        <div style="font-size:11px;color:#888;">drop a track and vibe. no data leaves the browser.</div>
      </div>
    `,
    init: (win) => {
      let audio, ctx, analyser, source, data, raf;
      const vis = win.el.querySelector('#vr-vis');
      for (let i = 0; i < 32; i++) {
        const b = document.createElement('div'); b.className = 'vr-bar'; b.style.height = '4px'; vis.appendChild(b);
      }
      const bars = vis.querySelectorAll('.vr-bar');
      function draw() {
        if (!analyser) return;
        analyser.getByteFrequencyData(data);
        for (let i = 0; i < 32; i++) bars[i].style.height = Math.max(4, data[i * 2]) + 'px';
        raf = requestAnimationFrame(draw);
      }
      win.el.querySelector('#vr-file').addEventListener('change', e => {
        const f = e.target.files[0]; if (!f) return;
        if (audio) { audio.pause(); URL.revokeObjectURL(audio.src); }
        audio = new Audio(URL.createObjectURL(f));
        audio.loop = true;
        if (!ctx) { ctx = new AudioContext(); analyser = ctx.createAnalyser(); analyser.fftSize = 128; data = new Uint8Array(analyser.frequencyBinCount); }
        if (source) source.disconnect();
        source = ctx.createMediaElementSource(audio);
        source.connect(analyser); analyser.connect(ctx.destination);
        audio.play(); draw();
      });
      win.el.querySelector('#vr-play').addEventListener('click', () => {
        if (!audio) return;
        if (audio.paused) { audio.play(); if (ctx && ctx.state === 'suspended') ctx.resume(); }
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
          <button id="r-rods" style="background:#64748b;color:#fff;">rods</button>
          <button id="r-cool" style="background:#3b82f6;color:#fff;">coolant</button>
          <button id="r-off" style="background:#ef4444;color:#fff;">scram</button>
        </div>
        <div id="r-msg" style="font-size:11px;color:var(--accent);">reactor is fine. probably.</div>
      </div>
    `,
    init: (win) => {
      let temp = 20, pres = 0, rods = 50, coolant = 50, on = true;
      const tempEl = win.el.querySelector('#r-temp');
      const presEl = win.el.querySelector('#r-pres');
      const statusEl = win.el.querySelector('#r-status');
      const msgEl = win.el.querySelector('#r-msg');
      const tempBar = win.el.querySelector('#r-temp-bar');
      const presBar = win.el.querySelector('#r-pres-bar');
      const upd = () => {
        if (on) { temp += rods / 200 - coolant / 150 + Math.random() * 0.5; pres += temp / 300 - coolant / 200; }
        else { temp = Math.max(20, temp - 0.5); pres = Math.max(0, pres - 0.3); }
        if (temp > 100 && pres > 1) { statusEl.textContent = 'MELTDOWN'; msgEl.textContent = 'JBO IS SCREAMING'; }
        else if (temp < 10) { statusEl.textContent = 'FREEZEDOWN'; }
        else { statusEl.textContent = on ? 'active' : 'idle'; }
        tempEl.textContent = temp.toFixed(1) + '°C';
        presEl.textContent = pres.toFixed(1) + ' PSI';
        tempBar.style.width = Math.min(100, temp) + '%';
        tempBar.style.background = temp > 80 ? '#ef4444' : temp > 50 ? '#f59e0b' : '#22c55e';
        presBar.style.width = Math.min(100, pres) + '%';
      };
      const iv = setInterval(upd, 200);
      win.addCleanup = () => clearInterval(iv);
      win.el.querySelector('#r-rods').addEventListener('click', () => { rods = Math.min(100, rods + 10); objSay('rods adjusted. probably fine.'); });
      win.el.querySelector('#r-cool').addEventListener('click', () => { coolant = Math.min(100, coolant + 10); });
      win.el.querySelector('#r-off').addEventListener('click', () => { on = false; msgEl.textContent = 'scram initiated. jbo goes quiet.'; });
    }
  },

  cube: {
    title: 'obj',
    content: () => `<canvas class="cube-canvas" id="cube-canvas" width="400" height="200"></canvas><div style="font-size:11px;color:#888;margin-top:7px;">the cube is watching. drag to rotate.</div>`,
    init: (win) => {
      const c = win.el.querySelector('#cube-canvas');
      const gl = c.getContext('webgl');
      if (!gl) { c.style.background = '#300'; c.parentElement.innerHTML += '<div style="color:#f66;">webgl unavailable</div>'; return; }

      function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
      const vs = `attribute vec3 aP; attribute vec3 aN; attribute vec3 aC; uniform mat4 m; uniform mat4 mod; varying vec3 vC; varying vec3 vN; void main(){vC=aC;vN=mat3(mod)*aN;gl_Position=m*vec4(aP,1.0);}`;
      const fs = `precision mediump float; varying vec3 vC; varying vec3 vN; uniform float em; uniform float al; void main(){vec3 L=normalize(vec3(0.4,0.6,1.0));float d=max(dot(normalize(vN),L),0.0);vec3 col=vC*(0.25+d*0.75)+vC*em;gl_FragColor=vec4(col,al);}`;
      const prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog); gl.useProgram(prog);
      const aP = gl.getAttribLocation(prog, 'aP'), aN = gl.getAttribLocation(prog, 'aN'), aC = gl.getAttribLocation(prog, 'aC');
      const uM = gl.getUniformLocation(prog, 'm'), uMod = gl.getUniformLocation(prog, 'mod'), uEm = gl.getUniformLocation(prog, 'em'), uAl = gl.getUniformLocation(prog, 'al');

      function mat4() { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); }
      function mul(a, b) { const o = mat4(); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { o[j * 4 + i] = 0; for (let k = 0; k < 4; k++) o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k]; } return o; }
      function trans(x, y, z) { const o = mat4(); o[12] = x; o[13] = y; o[14] = z; return o; }
      function rotX(a) { const c = Math.cos(a), s = Math.sin(a), o = mat4(); o[5] = c; o[6] = s; o[9] = -s; o[10] = c; return o; }
      function rotY(a) { const c = Math.cos(a), s = Math.sin(a), o = mat4(); o[0] = c; o[2] = -s; o[8] = s; o[10] = c; return o; }
      function rotZ(a) { const c = Math.cos(a), s = Math.sin(a), o = mat4(); o[0] = c; o[1] = s; o[4] = -s; o[5] = c; return o; }
      function scale(x, y, z) { const o = mat4(); o[0] = x; o[5] = y; o[10] = z; return o; }
      function persp(fov, a, n, f) { const t = Math.tan(fov / 2), o = mat4(); o[0] = 1 / (a * t); o[5] = 1 / t; o[10] = -(f + n) / (f - n); o[11] = -1; o[14] = -(2 * f * n) / (f - n); return o; }

      function geoCube(s, r, g, b) {
        const d = [], n = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]], sh = [0.8, 0.6, 1, 0.5, 0.7, 0.7];
        const F = [[[-s, -s, s], [s, -s, s], [s, s, s], [-s, -s, s], [s, s, s], [-s, s, s]], [[s, -s, -s], [-s, -s, -s], [-s, s, -s], [s, -s, -s], [-s, s, -s], [s, s, -s]], [[-s, s, s], [s, s, s], [s, s, -s], [-s, s, s], [s, s, -s], [-s, s, -s]], [[-s, -s, -s], [s, -s, -s], [s, -s, s], [-s, -s, -s], [s, -s, s], [-s, -s, s]], [[s, -s, s], [s, -s, -s], [s, s, -s], [s, -s, s], [s, s, -s], [s, s, s]], [[-s, -s, -s], [-s, -s, s], [-s, s, s], [-s, -s, -s], [-s, s, s], [-s, s, -s]]];
        for (let fi = 0; fi < 6; fi++) for (let vi = 0; vi < 6; vi++) { const v = F[fi][vi], no = n[fi]; d.push(v[0], v[1], v[2], no[0], no[1], no[2], r * sh[fi], g * sh[fi], b * sh[fi]); }
        return new Float32Array(d);
      }
      function upBuf(data) { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return b; }
      function bind(buf) { gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 36, 0); gl.enableVertexAttribArray(aN); gl.vertexAttribPointer(aN, 3, gl.FLOAT, false, 36, 12); gl.enableVertexAttribArray(aC); gl.vertexAttribPointer(aC, 3, gl.FLOAT, false, 36, 24); }

      const outerBuf = upBuf(geoCube(1.3, 0.12, 0.12, 0.12));
      const innerC = [
        { c: [1, .2, .3], o: .55, s: 1, p: 0, sp: 1.5 }, { c: [.2, 1, .3], o: .55, s: 1, p: Math.PI / 4, sp: -1.2 },
        { c: [.2, .3, 1], o: .55, s: 1, p: Math.PI / 2, sp: 1.8 }, { c: [1, 1, .2], o: .55, s: 1, p: 3 * Math.PI / 4, sp: -1 },
        { c: [1, .2, 1], o: .45, s: .7, p: Math.PI, sp: 2 }, { c: [.2, 1, 1], o: .45, s: .7, p: 5 * Math.PI / 4, sp: -1.5 },
        { c: [1, .6, .1], o: .45, s: .7, p: 3 * Math.PI / 2, sp: 1.3 }, { c: [.6, .2, 1], o: .45, s: .7, p: 7 * Math.PI / 4, sp: -1.7 }
      ];
      const iBufs = [], iCnts = [];
      for (const ic of innerC) { const d = geoCube(0.22, ic.c[0], ic.c[1], ic.c[2]); iBufs.push(upBuf(d)); iCnts.push(d.length / 9); }

      const edgeS = 1.31;
      const edgeVerts = new Float32Array([-edgeS, -edgeS, -edgeS, edgeS, -edgeS, -edgeS, edgeS, -edgeS, -edgeS, edgeS, edgeS, -edgeS, edgeS, edgeS, -edgeS, -edgeS, edgeS, -edgeS, -edgeS, edgeS, -edgeS, -edgeS, -edgeS, -edgeS, edgeS, edgeS, -edgeS, -edgeS, edgeS, edgeS, -edgeS, edgeS, edgeS, -edgeS, edgeS, edgeS, edgeS, edgeS, edgeS, edgeS, -edgeS, edgeS, edgeS, -edgeS, edgeS, -edgeS, -edgeS, -edgeS, -edgeS, -edgeS, -edgeS, edgeS, edgeS, -edgeS, -edgeS, edgeS, -edgeS, edgeS, edgeS, edgeS, -edgeS, edgeS, edgeS, edgeS, -edgeS, edgeS, edgeS, -edgeS, -edgeS, edgeS, -edgeS, edgeS, edgeS]);
      const edgeBuf = upBuf(edgeVerts);
      const edgeVs = `attribute vec3 aP; uniform mat4 m; void main(){gl_Position=m*vec4(aP,1.0);}`;
      const edgeFs = `precision mediump float; void main(){gl_FragColor=vec4(0.65,0.33,0.97,0.55);}`;
      const eProg = gl.createProgram(); gl.attachShader(eProg, sh(gl.VERTEX_SHADER, edgeVs)); gl.attachShader(eProg, sh(gl.FRAGMENT_SHADER, edgeFs)); gl.linkProgram(eProg);
      const eAP = gl.getAttribLocation(eProg, 'aP'), eM = gl.getUniformLocation(eProg, 'm');

      let rx = 0.4, ry = 0.4, drag = false, lx, ly;
      c.addEventListener('mousedown', e => { drag = true; lx = e.clientX; ly = e.clientY; });
      window.addEventListener('mousemove', e => { if (!drag) return; ry += (e.clientX - lx) * 0.01; rx += (e.clientY - ly) * 0.01; lx = e.clientX; ly = e.clientY; });
      window.addEventListener('mouseup', () => drag = false);

      let raf, t0 = performance.now();
      function frame() {
        const t = (performance.now() - t0) * 0.001;
        gl.viewport(0, 0, c.width, c.height); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        const view = mul(rotX(rx), rotY(ry));
        const proj = persp(1.1, c.width / c.height, 0.1, 100);
        const base = mul(proj, view); base[14] -= 4;

        gl.useProgram(prog);
        gl.uniformMatrix4fv(uM, false, base); gl.uniformMatrix4fv(uMod, false, mat4()); gl.uniform1f(uEm, 0.05); gl.uniform1f(uAl, 0.22);
        bind(outerBuf); gl.drawArrays(gl.TRIANGLES, 0, 36);

        for (let i = 0; i < innerC.length; i++) {
          const ic = innerC[i], oa = t * ic.s + ic.p;
          const ox = Math.cos(oa) * ic.o, oy = Math.sin(oa * 0.7) * ic.o * 0.35, oz = Math.sin(oa) * ic.o;
          const mod = mul(mul(trans(ox, oy, oz), mul(mul(rotX(t * ic.sp), rotY(t * ic.sp * 0.7)), rotZ(t * ic.sp * 0.3))), scale(ic.s, ic.s, ic.s));
          gl.uniformMatrix4fv(uM, false, mul(base, mod)); gl.uniformMatrix4fv(uMod, false, mod); gl.uniform1f(uEm, 0.35); gl.uniform1f(uAl, 0.95);
          bind(iBufs[i]); gl.drawArrays(gl.TRIANGLES, 0, iCnts[i]);
        }

        gl.useProgram(eProg); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
        gl.enableVertexAttribArray(eAP); gl.vertexAttribPointer(eAP, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuf); gl.uniformMatrix4fv(eM, false, base); gl.drawArrays(gl.LINES, 0, 24);
        gl.depthMask(true); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        raf = requestAnimationFrame(frame);
      }
      frame();
      win.addCleanup = () => cancelAnimationFrame(raf);
    }
  },

  luxvidia: {
    title: 'luxvidia control panel',
    content: () => `
      <div class="lux-panel">
        <div style="font-size:16px;font-weight:700;color:var(--accent);">H2000B // A9292Z2K BUDDY</div>
        <div class="lux-meter"><span>mango</span><div class="lux-bar"><div id="lx-mango-bar"></div></div><span id="lx-mango-val">0%</span></div>
        <div class="lux-meter"><span>psu</span><div class="lux-bar"><div id="lx-psu-bar"></div></div><span id="lx-psu-val">0%</span></div>
        <div class="lux-meter"><span>side</span><div class="lux-bar"><div id="lx-side-bar"></div></div><span id="lx-side-val">0%</span></div>
        <button class="lux-btn" id="lx-mango">insert mango</button>
        <button class="lux-btn" id="lx-psu">summon PSU of angels</button>
        <button class="lux-btn" id="lx-side">sidewaysload</button>
        <div class="lux-log" id="lx-log">ready. zero compatibility with human hardware.</div>
      </div>
    `,
    init: (win) => {
      const log = win.el.querySelector('#lx-log');
      const say = s => log.textContent = s + '\n' + log.textContent;
      const meters = {
        mango: { bar: win.el.querySelector('#lx-mango-bar'), val: win.el.querySelector('#lx-mango-val'), pct: 0 },
        psu: { bar: win.el.querySelector('#lx-psu-bar'), val: win.el.querySelector('#lx-psu-val'), pct: 0 },
        side: { bar: win.el.querySelector('#lx-side-bar'), val: win.el.querySelector('#lx-side-val'), pct: 0 }
      };
      function setMeter(key, pct) {
        meters[key].pct = Math.min(100, pct);
        meters[key].bar.style.width = meters[key].pct + '%';
        meters[key].val.textContent = meters[key].pct.toFixed(0) + '%';
      }
      win.el.querySelector('#lx-mango').addEventListener('click', () => { setMeter('mango', meters.mango.pct + 12); say('MANGO DETECTED — upscaling initiated'); });
      win.el.querySelector('#lx-psu').addEventListener('click', () => { setMeter('psu', meters.psu.pct + 20); say('PSU OF ANGELS SUMMONED. your room lights flicker.'); });
      win.el.querySelector('#lx-side').addEventListener('click', () => { setMeter('side', meters.side.pct + 7); say('sidewaysloading... data direction: yes.'); });
    }
  },

  files: {
    title: 'file void',
    content: () => `
      <div class="file-list" id="file-list"></div>
      <div class="file-viewer hidden" id="file-viewer"></div>
    `,
    init: (win) => {
      const list = win.el.querySelector('#file-list');
      const viewer = win.el.querySelector('#file-viewer');
      const paths = Object.keys(fileSystem).sort();
      paths.forEach(p => {
        const item = document.createElement('div');
        item.className = 'file-item' + (p.endsWith('/') ? ' folder' : '');
        item.innerHTML = `<span>${p.endsWith('/') ? '📁' : '📄'}</span><span>${p}</span>`;
        item.addEventListener('dblclick', () => {
          const content = fileSystem[p] ?? '(empty)';
          viewer.textContent = `== ${p} ==\n\n${content}`;
          viewer.classList.remove('hidden');
          if (Math.random() > 0.6) objSay('this file is not for you.');
        });
        list.appendChild(item);
      });
    }
  },

  lorebook: {
    title: 'lorebook',
    content: () => `
      <div class="lorebook">
        <div class="lore-tabs">
          <div class="lore-tab active" data-tab="lore">lore</div>
          <div class="lore-tab" data-tab="tx">transmissions</div>
        </div>
        <div class="lore-body" id="lore-body"></div>
      </div>
    `,
    init: (win) => {
      const body = win.el.querySelector('#lore-body');
      const tabs = win.el.querySelectorAll('.lore-tab');
      let activeTab = 'lore';

      function renderLore() {
        body.innerHTML = '';
        const list = document.createElement('div'); list.className = 'lore-list';
        loreData.forEach((entry, i) => {
          const el = document.createElement('div'); el.className = 'lore-entry';
          el.innerHTML = `<div class="lore-title">${entry.title}</div><div class="lore-tags">${entry.tags}</div>`;
          el.addEventListener('click', () => {
            body.querySelectorAll('.lore-detail').forEach(d => d.remove());
            const det = document.createElement('div'); det.className = 'lore-detail';
            det.innerHTML = `<h4>${entry.title}</h4><p>${entry.text}</p>`;
            body.appendChild(det);
          });
          list.appendChild(el);
        });
        body.appendChild(list);
      }

      function renderTx() {
        body.innerHTML = '';
        const box = document.createElement('div'); box.className = 'tx-box';
        const resp = document.createElement('div'); resp.className = 'tx-response';
        const btn = document.createElement('button'); btn.className = 'vr-btn tx-btn'; btn.textContent = 'receive transmission';
        function next() {
          const t = transmissionsData[Math.floor(Math.random() * transmissionsData.length)];
          box.textContent = `[void] ${t.tx}`;
          resp.textContent = `[obj] ${t.resp}`;
        }
        btn.addEventListener('click', next);
        next();
        body.appendChild(box); body.appendChild(resp); body.appendChild(btn);
      }

      function switchTab(tab) {
        activeTab = tab;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        if (tab === 'lore') renderLore(); else renderTx();
      }

      tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
      switchTab(activeTab);
    }
  }
};

boot();
