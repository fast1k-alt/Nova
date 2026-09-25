
(() => {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my;
  addEventListener('pointermove', e => { mx=e.clientX; my=e.clientY; });
  function animateGlow(){
    gx += (mx-gx)*0.12; gy += (my-gy)*0.12;
    glow.style.left = gx+'px'; glow.style.top = gy+'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Scroll reveal
  const targets = document.querySelectorAll('.cards article,.project,.info-grid div,form');
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry,i) => {
      if(entry.isIntersecting){
        entry.target.style.transitionDelay = (i % 3) * 90 + 'ms';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  targets.forEach(el => io.observe(el));

  // Magnetic-ish buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r=btn.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.08;
      const y=(e.clientY-r.top-r.height/2)*.08;
      btn.style.transform=`translate(${x}px,${y}px)`;
    });
    btn.addEventListener('pointerleave',()=>btn.style.transform='');
    btn.addEventListener('click', e=>{
      const r=btn.getBoundingClientRect();
      const s=document.createElement('span'); s.className='ripple';
      const size=Math.max(r.width,r.height); s.style.width=s.style.height=size+'px';
      s.style.left=(e.clientX-r.left-size/2)+'px'; s.style.top=(e.clientY-r.top-size/2)+'px';
      btn.appendChild(s); setTimeout(()=>s.remove(),650);
    });
  });

  // Subtle 3D tilt on project cards
  document.querySelectorAll('.project').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const rx=((e.clientY-r.top)/r.height-.5)*-5;
      const ry=((e.clientX-r.left)/r.width-.5)*5;
      card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });

  // Small parallax for the hero orb
  const orb=document.querySelector('.orb');
  if(orb){
    addEventListener('pointermove',e=>{
      const x=(e.clientX/innerWidth-.5)*12, y=(e.clientY/innerHeight-.5)*12;
      orb.style.marginLeft=`${x}px`; orb.style.marginTop=`${y}px`;
    });
  }
})();
