
(() => {
  const CHAT_KEY='nova_global_chat_v1';
  const get=()=>JSON.parse(localStorage.getItem(CHAT_KEY)||'[]');
  const save=x=>localStorage.setItem(CHAT_KEY,JSON.stringify(x));
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const avatarLetter=s=>(s||'?').trim()[0].toUpperCase();

  function currentUser(){
    const a=NOVA_USER?.accounts?.()||{};
    const id=NOVA_USER?.session?.();
    return id&&a[id] ? a[id] : null;
  }
  function render(){
    const box=document.querySelector('#global-chat-messages'); if(!box)return;
    const messages=get();
    box.innerHTML=messages.length ? messages.map(m=>`
      <article class="chat-message">
        <div class="chat-avatar">${m.avatar?`<img src="${m.avatar}" alt="">`:esc(avatarLetter(m.nickname))}</div>
        <div class="chat-body">
          <div class="chat-meta"><strong>${esc(m.nickname)}</strong>${m.verified?'<b class="verified chat-check" title="Подтверждённый профиль">✓</b>':''}<time>${new Date(m.time).toLocaleString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</time></div>
          <div class="chat-text">${esc(m.text)}</div>
        </div>
      </article>`).join('') : '<div class="chat-empty">Пока никто ничего не написал. Будь первым 👋</div>';
    box.scrollTop=box.scrollHeight;
  }

  function init(){
    const root=document.querySelector('#global-chat'); if(!root)return;
    const u=currentUser();
    root.querySelector('.chat-login-note')?.remove();
    const form=root.querySelector('#chat-form');
    const input=root.querySelector('#chat-input');
    const send=root.querySelector('#chat-send');
    if(!u){
      form.style.display='none';
      const n=document.createElement('p');n.className='chat-login-note';
      n.innerHTML='Чтобы писать в глобальный чат, <button class="chat-inline-login">войдите</button> или зарегистрируйтесь.';
      root.querySelector('.chat-compose').appendChild(n);
      n.querySelector('button').onclick=()=>document.querySelector('.login-open')?.click();
    } else {
      form.style.display='flex';
      input.placeholder=`Напишите сообщение, ${u.nickname}…`;
      form.onsubmit=e=>{
        e.preventDefault(); const text=input.value.trim(); if(!text)return;
        const list=get();
        list.push({id:crypto.randomUUID(),nickname:u.nickname,avatar:u.avatar||'',verified:!!u.verified,text,time:Date.now()});
        save(list.slice(-100)); input.value=''; render();
      };
    }
    render();
  }
  window.NOVA_CHAT={render,init};
  document.addEventListener('DOMContentLoaded',init);
  window.addEventListener('storage',e=>{if(e.key===CHAT_KEY)render()});
})();
