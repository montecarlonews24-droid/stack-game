/* ═══════════════════════════════════════════
   STACK! — Worlds & Endless World Generator
   ═══════════════════════════════════════════ */

const BASE_WORLDS = [
  {id:0,name:'CYBER',emoji:'⚡',desc:'Neon City',dot:'#00ffcc',unlockAt:0,
   pal:['#00ffcc','#00ddaa','#00bbee','#0099cc'],bg:['#09090f','#0a0d18'],
   speed:3,puChance:.12,weather:null},
  {id:1,name:'SPACE',emoji:'🌌',desc:'Zero Gravity',dot:'#3d9fff',unlockAt:15,
   pal:['#3d9fff','#aaccff','#ffffff','#ffeecc'],bg:['#00010a','#05081a'],
   speed:3.8,puChance:.14,weather:'stars'},
  {id:2,name:'CRYSTAL',emoji:'💎',desc:'Mystic Caves',dot:'#a259ff',unlockAt:30,
   pal:['#a259ff','#ff88ff','#cc44ff','#44ffee'],bg:['#050118','#0d0520'],
   speed:4.5,puChance:.16,weather:'crystals'},
  {id:3,name:'VOLCANO',emoji:'🌋',desc:'Lava Rush',dot:'#ff3cac',unlockAt:50,
   pal:['#ff3cac','#ff6633','#ffde03','#ff4444'],bg:['#120005','#1a0008'],
   speed:5.5,puChance:.18,weather:'lava'},
];

// Endless world generation — unique worlds beyond the 4 base ones
const WORLD_THEMES = [
  {name:'ARCTIC',  emoji:'🧊',dot:'#88eeff',bg:['#010a12','#02101a'],weather:'snow',
   pal:['#88eeff','#aaf5ff','#ffffff','#cceeff'],baseSpeed:6},
  {name:'SAKURA',  emoji:'🌸',dot:'#ffaacc',bg:['#120005','#1a0212'],weather:'petals',
   pal:['#ffaacc','#ff88bb','#ffccee','#ffddaa'],baseSpeed:6.5},
  {name:'NEON',    emoji:'🎆',dot:'#ff00ff',bg:['#050005','#0a000a'],weather:null,
   pal:['#ff00ff','#00ffff','#ffff00','#ff8800'],baseSpeed:7},
  {name:'OCEAN',   emoji:'🌊',dot:'#0077ff',bg:['#000510','#001020'],weather:'bubbles',
   pal:['#0077ff','#00aaff','#00ffee','#aaffee'],baseSpeed:7.5},
  {name:'DESERT',  emoji:'🏜️',dot:'#ffaa33',bg:['#120800','#1a0e00'],weather:'sand',
   pal:['#ffaa33','#ff8833','#ffcc66','#ffddaa'],baseSpeed:8},
  {name:'FOREST',  emoji:'🌲',dot:'#00cc44',bg:['#010a02','#02100a'],weather:'leaves',
   pal:['#00cc44','#00ff66','#88ff88','#aaffcc'],baseSpeed:8.5},
  {name:'GALAXY',  emoji:'🌠',dot:'#cc88ff',bg:['#02000a','#050015'],weather:'stars',
   pal:['#cc88ff','#ff88cc','#88ccff','#ffffff'],baseSpeed:9},
  {name:'INFERNO', emoji:'🔥',dot:'#ff4400',bg:['#1a0000','#200000'],weather:'embers',
   pal:['#ff4400','#ff8800','#ffcc00','#ff2200'],baseSpeed:9.5},
  {name:'VOID',    emoji:'🌑',dot:'#8888ff',bg:['#000000','#010108'],weather:null,
   pal:['#8888ff','#aaaaff','#ffffff','#6666cc'],baseSpeed:10},
  {name:'RAINBOW', emoji:'🌈',dot:'#ff0000',bg:['#050010','#08001a'],weather:null,
   pal:['#ff0000','#ff8800','#ffff00','#00ff00','#0088ff','#aa00ff'],baseSpeed:10.5},
];

function generateEndlessWorld(num) {
  // num starts at 5 (after 4 base worlds)
  const themeIdx = (num - 4) % WORLD_THEMES.length;
  const theme = WORLD_THEMES[themeIdx];
  const generation = Math.floor((num - 4) / WORLD_THEMES.length) + 1;
  return {
    id: num,
    name: theme.name + (generation > 1 ? ' ' + toRoman(generation) : ''),
    emoji: theme.emoji,
    desc: 'Gen ' + generation + ' · Speed ' + (theme.baseSpeed + (generation - 1) * 1.5).toFixed(1),
    dot: theme.dot,
    unlockAt: 40 + num * 15,
    pal: theme.pal,
    bg: theme.bg,
    speed: theme.baseSpeed + (generation - 1) * 1.5,
    puChance: Math.min(.3, .18 + num * .01),
    weather: theme.weather,
    generated: true,
    generation,
  };
}

function toRoman(n) {
  const r = ['','I','II','III','IV','V','VI','VII','VIII','IX','X'];
  return r[n] || n;
}

function getAllWorlds(best) {
  const worlds = [...BASE_WORLDS];
  // Generate endless worlds up to what player can unlock + 2 preview
  const maxId = Math.max(4, Math.floor(best / 15) + 2);
  for (let i = 4; i <= Math.min(maxId, 4 + WORLD_THEMES.length * 3); i++) {
    worlds.push(generateEndlessWorld(i));
  }
  return worlds;
}

function getWorld(id, best) {
  if (id < 4) return BASE_WORLDS[id];
  return generateEndlessWorld(id);
}

// Weather particle systems
const WeatherSystems = {
  snow: {
    spawn(W, H) {
      return { x: Math.random() * W, y: -10, vx: (Math.random() - .5) * .5, vy: .8 + Math.random() * .8, r: 1.5 + Math.random() * 2.5, life: 1, col: 'rgba(200,240,255,' };
    },
    draw(ctx, p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.life * .7 + ')'; ctx.fill();
    },
    update(p, W, H) { p.x += p.vx; p.y += p.vy; if (p.y > H) p.life = 0; }
  },
  lava: {
    spawn(W, H) {
      return { x: Math.random() * W, y: H + 10, vx: (Math.random() - .5) * 1.5, vy: -(2 + Math.random() * 3), r: 2 + Math.random() * 4, life: 1, col: '#ff4400' };
    },
    draw(ctx, p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
    },
    update(p, W, H) { p.x += p.vx; p.y += p.vy; p.vy += .1; p.life -= .025; }
  },
  crystals: {
    spawn(W, H) {
      return { x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, r: 1 + Math.random() * 2, life: Math.random(), pulse: Math.random() * Math.PI * 2, col: '#a259ff' };
    },
    draw(ctx, p) {
      const a = (.3 + .3 * Math.sin(p.pulse)) * p.life;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(162,89,255,' + a + ')'; ctx.fill();
    },
    update(p, W, H) { p.pulse += .05; }
  },
  stars: {
    spawn(W, H) {
      return { x: Math.random() * W, y: Math.random() * H * .6, r: .5 + Math.random() * 1.5, life: 1, pulse: Math.random() * Math.PI * 2, col: 'rgba(255,255,255,' };
    },
    draw(ctx, p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + (.2 + .3 * Math.sin(p.pulse)) + ')'; ctx.fill();
    },
    update(p) { p.pulse += .02; }
  },
  petals: {
    spawn(W, H) {
      return { x: Math.random() * W, y: -10, vx: (Math.random() - .5) * 1.2, vy: .6 + Math.random() * .6, rot: Math.random() * Math.PI * 2, life: 1, col: '#ffaacc' };
    },
    draw(ctx, p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col; ctx.globalAlpha = p.life * .7;
      ctx.beginPath(); ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); ctx.globalAlpha = 1;
    },
    update(p, W, H) { p.x += p.vx; p.y += p.vy; p.rot += .05; if (p.y > H) p.life = 0; }
  },
  bubbles: {
    spawn(W, H) {
      return { x: Math.random() * W, y: H + 10, vx: (Math.random() - .5) * .5, vy: -(1 + Math.random() * 1.5), r: 3 + Math.random() * 6, life: 1, col: 'rgba(0,170,255,' };
    },
    draw(ctx, p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = p.col + p.life * .5 + ')'; ctx.lineWidth = 1.5; ctx.stroke();
    },
    update(p, W, H) { p.x += p.vx; p.y += p.vy; p.life -= .008; }
  },
  sand: {
    spawn(W, H) {
      return { x: Math.random() * W, y: Math.random() * H, vx: 1.5 + Math.random() * 2, vy: (Math.random() - .5) * .3, r: .5 + Math.random() * 1.5, life: 1, col: 'rgba(255,180,80,' };
    },
    draw(ctx, p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.life * .4 + ')'; ctx.fill();
    },
    update(p, W, H) { p.x += p.vx; if (p.x > W) p.life = 0; }
  },
  leaves: {
    spawn(W, H) {
      return { x: Math.random() * W, y: -10, vx: (Math.random() - .5) * 1.5, vy: .7 + Math.random(), rot: Math.random() * Math.PI * 2, life: 1, col: '#00cc44' };
    },
    draw(ctx, p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col; ctx.globalAlpha = p.life * .6;
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); ctx.globalAlpha = 1;
    },
    update(p, W, H) { p.x += p.vx; p.y += p.vy; p.rot += .04; if (p.y > H) p.life = 0; }
  },
  embers: {
    spawn(W, H) {
      return { x: Math.random() * W, y: H + 5, vx: (Math.random() - .5) * 2, vy: -(1.5 + Math.random() * 2.5), r: 1.5 + Math.random() * 2, life: 1, col: '#ff8800' };
    },
    draw(ctx, p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 6;
      ctx.globalAlpha = p.life; ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    },
    update(p, W, H) { p.x += p.vx; p.y += p.vy; p.vy += .06; p.life -= .02; }
  },
};
