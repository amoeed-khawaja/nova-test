/* eslint-disable */
// Interactive behaviours ported from the original NOVA static page.
export function initNova() {
  if (typeof document === 'undefined') return () => {};
  if (!document.getElementById('particles')) return () => {};
  let stopped = false;
  const RAF = (fn) => { if (!stopped) requestAnimationFrame(fn); };

/* ---------- Mobile menu ---------- */
document.getElementById('menuToggle').addEventListener('click', ()=>document.getElementById('mobmenu').classList.toggle('open'));
document.querySelectorAll('#mobmenu a').forEach(a=>a.addEventListener('click', ()=>document.getElementById('mobmenu').classList.remove('open')));

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in'); io.unobserve(e.target);}});},{threshold:0.1});
revealEls.forEach(el=>io.observe(el));

/* ---------- Custom cursor ---------- */
const isFinePointer = window.matchMedia('(pointer:fine)').matches;
if(isFinePointer){
  const dot = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  let mx=0,my=0, rx=0, ry=0;
  window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  function ringLoop(){
    rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    RAF(ringLoop);
  }
  ringLoop();
  document.querySelectorAll('a, button, .role-card, .tilt, .orbit-node, input, textarea').forEach(el=>{
    el.addEventListener('mouseenter', ()=>ring.classList.add('grow'));
    el.addEventListener('mouseleave', ()=>ring.classList.remove('grow'));
  });

  /* Magnetic buttons */
  document.querySelectorAll('.magnet').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const relX = e.clientX - r.left - r.width/2;
      const relY = e.clientY - r.top - r.height/2;
      el.style.transform = `translate(${relX*0.25}px, ${relY*0.25}px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = 'translate(0,0)'; });
  });

  /* Tilt cards */
  document.querySelectorAll('.tilt').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      el.style.transform = `perspective(600px) rotateX(${-py*8}deg) rotateY(${px*8}deg) translateZ(0)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = 'perspective(600px) rotateX(0) rotateY(0)'; });
  });
}

/* ---------- Canvas particle constellation ---------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w,h, particles=[];
const PCOUNT = window.innerWidth < 700 ? 45 : 90;
function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
resize();
window.addEventListener('resize', resize);
for(let i=0;i<PCOUNT;i++){
  particles.push({x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25, r:Math.random()*1.6+0.6});
}
let mouseX=-9999, mouseY=-9999;
window.addEventListener('mousemove', e=>{ mouseX=e.clientX; mouseY=e.clientY; });
function tick(){
  ctx.clearRect(0,0,w,h);
  for(const p of particles){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0) p.x=w; if(p.x>w) p.x=0;
    if(p.y<0) p.y=h; if(p.y>h) p.y=0;
    const dx = p.x-mouseX, dy = p.y-mouseY, dist = Math.sqrt(dx*dx+dy*dy);
    if(dist < 120){ p.x += dx/dist*0.6; p.y += dy/dist*0.6; }
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle='rgba(156,124,255,0.5)';
    ctx.fill();
  }
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const dx=a.x-b.x, dy=a.y-b.y, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<110){
        ctx.beginPath();
        ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
        ctx.strokeStyle = `rgba(92,216,255,${0.12*(1-dist/110)})`;
        ctx.lineWidth=1;
        ctx.stroke();
      }
    }
  }
  RAF(tick);
}
tick();

/* ---------- Orbit node click info ---------- */
const orbitSpin = document.getElementById('orbitSpin');
const nodeInfo = document.getElementById('nodeInfo');
const nodeTitle = document.getElementById('nodeTitle');
const nodeDesc = document.getElementById('nodeDesc');
let activeNode = null;
document.querySelectorAll('.orbit-node').forEach(node=>{
  node.addEventListener('click', (e)=>{
    e.stopPropagation();
    if(activeNode === node){
      node.classList.remove('active'); nodeInfo.classList.remove('show'); activeNode=null;
      orbitSpin.classList.remove('paused');
      return;
    }
    document.querySelectorAll('.orbit-node').forEach(n=>n.classList.remove('active'));
    node.classList.add('active'); activeNode = node;
    orbitSpin.classList.add('paused');
    nodeTitle.textContent = node.dataset.title;
    nodeDesc.textContent = node.dataset.desc;
    nodeInfo.classList.add('show');
  });
});
document.addEventListener('click', ()=>{
  if(activeNode){ activeNode.classList.remove('active'); nodeInfo.classList.remove('show'); activeNode=null; orbitSpin.classList.remove('paused'); }
});

/* ---------- Count-up stats ---------- */
const counters = document.querySelectorAll('.count');
const cio = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.target,10);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function step(now){
        const p = Math.min((now-start)/dur, 1);
        const eased = 1 - Math.pow(1-p, 3);
        const val = Math.floor(eased*target);
        el.textContent = val.toLocaleString() + suffix;
        if(p<1) RAF(step); else el.textContent = target.toLocaleString()+suffix;
      }
      RAF(step);
      cio.unobserve(el);
    }
  });
},{threshold:0.5});
counters.forEach(c=>cio.observe(c));

/* ---------- Journey carousel: drag + arrows + progress ---------- */
const carousel = document.getElementById('carousel');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let isDown=false, startX=0, scrollStart=0;
carousel.addEventListener('mousedown', e=>{ isDown=true; carousel.classList.add('dragging'); startX=e.pageX; scrollStart=carousel.scrollLeft; });
window.addEventListener('mouseup', ()=>{ isDown=false; carousel.classList.remove('dragging'); });
window.addEventListener('mousemove', e=>{
  if(!isDown) return;
  carousel.scrollLeft = scrollStart - (e.pageX - startX);
});
carousel.addEventListener('touchstart', e=>{ startX=e.touches[0].pageX; scrollStart=carousel.scrollLeft; }, {passive:true});
carousel.addEventListener('touchmove', e=>{ carousel.scrollLeft = scrollStart - (e.touches[0].pageX - startX); }, {passive:true});

function updateProgress(){
  const max = carousel.scrollWidth - carousel.clientWidth;
  const pct = max>0 ? (carousel.scrollLeft/max)*100 : 0;
  progressFill.style.width = Math.max(pct,4)+'%';
}
carousel.addEventListener('scroll', updateProgress);
updateProgress();
prevBtn.addEventListener('click', ()=> carousel.scrollBy({left:-280, behavior:'smooth'}));
nextBtn.addEventListener('click', ()=> carousel.scrollBy({left:280, behavior:'smooth'}));

/* ---------- Generic drag-to-scroll for slider rows (not auto-marquees) ---------- */
document.querySelectorAll('.drag-scroll').forEach(el=>{
  if(el.classList.contains('cardgrid-auto-track')) return;
  let down=false, startX=0, scrollStart=0;
  el.addEventListener('mousedown', e=>{ down=true; el.classList.add('dragging'); startX=e.pageX; scrollStart=el.scrollLeft; });
  window.addEventListener('mouseup', ()=>{ down=false; el.classList.remove('dragging'); });
  window.addEventListener('mousemove', e=>{
    if(!down) return;
    el.scrollLeft = scrollStart - (e.pageX - startX);
  });
  el.addEventListener('touchstart', e=>{ startX=e.touches[0].pageX; scrollStart=el.scrollLeft; }, {passive:true});
  el.addEventListener('touchmove', e=>{ el.scrollLeft = scrollStart - (e.touches[0].pageX - startX); }, {passive:true});
});

/* ---------- Advisory auto-marquee: JS scroll + drag/wheel pause, resume from offset ---------- */
document.querySelectorAll('.cardgrid-auto-viewport').forEach(viewport=>{
  const track = viewport.querySelector('.cardgrid-auto-track');
  if(!track) return;

  track.classList.add('js-marquee');
  track.classList.remove('paused');

  const SPEED = 42; // px/sec
  const IDLE_MS = 1500;
  let offset = 0;
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let startOffset = 0;
  let moved = false;
  let resumeTimer = null;
  let userPaused = false;
  let lastTs = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const halfWidth = ()=> track.scrollWidth / 2;

  const normalize = ()=>{
    const half = halfWidth();
    if(half <= 0) return;
    offset = ((offset % half) + half) % half;
  };

  const apply = ()=>{
    normalize();
    track.style.transform = `translate3d(${-offset}px,0,0)`;
  };

  const scheduleResume = ()=>{
    userPaused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(()=>{
      userPaused = false;
      lastTs = null;
    }, IDLE_MS);
  };

  const onPointerDown = (e)=>{
    if(e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    moved = false;
    pointerId = e.pointerId;
    startX = e.clientX;
    startOffset = offset;
    track.classList.add('dragging');
    userPaused = true;
    clearTimeout(resumeTimer);
    try{ track.setPointerCapture(e.pointerId); }catch(_){}
  };

  const onPointerMove = (e)=>{
    if(!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 3) moved = true;
    offset = startOffset - dx;
    apply();
  };

  const onPointerUp = (e)=>{
    if(!dragging || (pointerId != null && e.pointerId !== pointerId)) return;
    dragging = false;
    pointerId = null;
    track.classList.remove('dragging');
    try{ track.releasePointerCapture(e.pointerId); }catch(_){}
    scheduleResume();
  };

  track.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('pointermove', onPointerMove);
  track.addEventListener('pointerup', onPointerUp);
  track.addEventListener('pointercancel', onPointerUp);

  // Prevent click-through after a drag
  track.addEventListener('click', e=>{
    if(moved){ e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  viewport.addEventListener('wheel', e=>{
    const dx = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    if(dx === 0) return;
    e.preventDefault();
    offset += dx;
    apply();
    scheduleResume();
  }, {passive:false});

  apply();

  function loop(ts){
    if(stopped) return;
    if(lastTs == null) lastTs = ts;
    const dt = Math.min(0.064, (ts - lastTs) / 1000);
    lastTs = ts;
    if(!reduceMotion && !userPaused && !dragging){
      offset += SPEED * dt;
      apply();
    }
    RAF(loop);
  }
  RAF(loop);
});

  return () => { stopped = true; };
}
