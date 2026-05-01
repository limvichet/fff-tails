const r=()=>({showToast:(c,i,n="success")=>{const e={success:{icon:"✅",bg:"#5FE9B5"},warning:{icon:"⚠️",bg:"#D5A24A"},error:{icon:"❌",bg:"#FFA5A6"}}[n];let s=document.getElementById("custom-toast-container");s||(s=document.createElement("div"),s.id="custom-toast-container",document.body.appendChild(s));const t=document.createElement("div");t.className="my-custom-toast",t.style.backgroundColor=e.bg,t.innerHTML=`
      <div class="toast-content">
        <div class="toast-icon">${e.icon}</div>
        <div class="toast-text">
          <div class="toast-title">${c}</div>
          <div class="toast-description">${i}</div>
        </div>
        <button class="toast-close">&times;</button>
      </div>
    `,s.appendChild(t),setTimeout(()=>t.classList.add("is-visible"),10);const o=()=>{t.classList.remove("is-visible"),t.addEventListener("transitionend",()=>t.remove())};setTimeout(o,5e3),t.querySelector(".toast-close")?.addEventListener("click",o)}});export{r as u};
