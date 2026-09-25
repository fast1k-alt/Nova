
(() => {
  const KEY='nova_accounts_v1';
  const SESSION='nova_session_v1';
  const getAccounts=()=>JSON.parse(localStorage.getItem(KEY)||'{}');
  const saveAccounts=a=>localStorage.setItem(KEY,JSON.stringify(a));
  const current=()=>localStorage.getItem(SESSION);
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function ensurePanel(){
    if(document.querySelector('.auth-overlay')) return;
    const overlay=document.createElement('div');
    overlay.className='auth-overlay';
    overlay.innerHTML=`<div class="auth-modal">
      <button class="auth-close" aria-label="Закрыть">×</button>
      <div class="auth-tabs"><button data-tab="login" class="selected">Войти</button><button data-tab="register">Регистрация</button></div>
      <form class="auth-form" data-form="login">
        <h2>С возвращением</h2><p>Войди в свой профиль NOVA.</p>
        <input name="login" placeholder="Ник или email" required>
        <input name="password" type="password" placeholder="Пароль" required>
        <button class="btn primary" type="submit">Войти</button><div class="auth-error"></div>
      </form>
      <form class="auth-form hidden" data-form="register">
        <h2>Создать профиль</h2><p>Придумай уникальный ник.</p>
        <input name="nickname" placeholder="Ник" minlength="3" maxlength="20" required>
        <input name="email" type="email" placeholder="Email" required>
        <input name="password" type="password" placeholder="Пароль" minlength="6" required>
        <button class="btn primary" type="submit">Зарегистрироваться</button><div class="auth-error"></div>
      </form>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.classList.remove('open');
    overlay.querySelector('.auth-close').onclick=close;
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    overlay.querySelectorAll('.auth-tabs button').forEach(b=>b.onclick=()=>{
      overlay.querySelectorAll('.auth-tabs button').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      overlay.querySelectorAll('.auth-form').forEach(f=>f.classList.toggle('hidden',f.dataset.form!==b.dataset.tab));
    });
    overlay.querySelector('[data-form="register"]').onsubmit=e=>{
      e.preventDefault(); const f=new FormData(e.target), a=getAccounts();
      const nick=f.get('nickname').trim(), email=f.get('email').trim().toLowerCase();
      const exists=Object.values(a).some(x=>x.nickname.toLowerCase()===nick.toLowerCase()||x.email===email);
      if(exists) return e.target.querySelector('.auth-error').textContent='Такой ник или email уже занят.';
      const id=crypto.randomUUID();
      a[id]={id,nickname:nick,email,password:f.get('password'),verified:false,created:Date.now()};
      saveAccounts(a); localStorage.setItem(SESSION,id); close(); renderUser(); location.href='about.html';
    };
    overlay.querySelector('[data-form="login"]').onsubmit=e=>{
      e.preventDefault(); const f=new FormData(e.target), a=getAccounts();
      const found=Object.values(a).find(x=>(x.nickname.toLowerCase()===f.get('login').trim().toLowerCase()||x.email===f.get('login').trim().toLowerCase())&&x.password===f.get('password'));
      if(!found) return e.target.querySelector('.auth-error').textContent='Неверный ник/email или пароль.';
      localStorage.setItem(SESSION,found.id); close(); renderUser();
    };
  }
  function renderUser(){
    const old=document.querySelector('.user-area'); if(old) old.remove();
    const nav=document.querySelector('nav'); if(!nav)return;
    const a=getAccounts(), id=current(), user=id&&a[id];
    const area=document.createElement('div'); area.className='user-area';
    if(user){
      area.innerHTML=`<button class="user-pill">${user.avatar?`<img class="mini-avatar" src="${user.avatar}" alt="">`:`<span class="mini-avatar fallback">${esc(user.nickname[0].toUpperCase())}</span>`}<span>${esc(user.nickname)}</span>${user.verified?'<b class="verified" title="Подтверждённый профиль">✓</b>':''}</button><button class="logout">Выйти</button>`;
      area.querySelector('.logout').onclick=()=>{localStorage.removeItem(SESSION);renderUser()};
      area.querySelector('.user-pill').onclick=()=>location.href='about.html';
    }else{
      area.innerHTML=`<button class="login-open">Войти</button><button class="register-open">Регистрация</button>`;
      area.querySelectorAll('button').forEach(b=>b.onclick=()=>{ensurePanel();document.querySelector('.auth-overlay').classList.add('open');});
    }
    nav.parentElement.appendChild(area);
  }
  window.NOVA_USER={get:()=>{const a=getAccounts(),id=current();return id&&a[id]},accounts:getAccounts,save:saveAccounts,session:current,render:renderUser};
  document.addEventListener('DOMContentLoaded',()=>{ensurePanel();renderUser()});
})();
