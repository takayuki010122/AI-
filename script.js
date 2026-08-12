const GAS_URL="hhttps://script.google.com/macros/s/AKfycbz6AcmHTnKrApNczD70T9GN2nNxImwdIpGuR09smacDZHkjaYno_CuXBUvIoXXLceoE/exec";

const menuBtn=document.querySelector(".menu"),mobileNav=document.querySelector(".mobile-nav");
if(menuBtn&&mobileNav){menuBtn.addEventListener("click",()=>mobileNav.classList.toggle("open"));mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobileNav.classList.remove("open")))}

const revealEls = document.querySelectorAll(".reveal");
if("IntersectionObserver"in window&&revealEls.length){const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target)}})},{threshold:.2});revealEls.forEach(el=>io.observe(el))}else revealEls.forEach(el=>el.classList.add("visible"));

const filterBtns=document.querySelectorAll(".filters button"),cards=document.querySelectorAll(".card");
filterBtns.forEach(btn=>{btn.addEventListener("click",()=>{filterBtns.forEach(b=>b.classList.remove("active"));btn.classList.add("active");const f=btn.dataset.filter;cards.forEach(card=>card.style.display=f==="all"||card.dataset.cat===f?"":"none")})});

const modal = document.querySelector(".modal");
if(modal){const modalArt=modal.querySelector(".modal-art"),modalTitle=modal.querySelector(".modal-copy h2"),modalCopy=modal.querySelector(".modal-copy p"),closeBtn=modal.querySelector(".close"),backdrop=modal.querySelector(".backdrop");
cards.forEach(card=>{card.addEventListener("click",()=>{modalTitle.textContent=card.dataset.title||"";modalCopy.textContent=card.dataset.copy||"";const visual=card.querySelector(".visual");modalArt.className="modal-art";if(visual)visual.classList.forEach(c=>{if(c.startsWith("v"))modalArt.classList.add(c)});modal.classList.add("open");modal.setAttribute("aria-hidden","false")})});
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
closeBtn&&closeBtn.addEventListener("click",closeModal);backdrop&&backdrop.addEventListener("click",closeModal);document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()})}

const floatingCta=document.getElementById("floatingCta"),heroEl=document.querySelector(".hero"),contactEl=document.getElementById("contact");
if(floatingCta&&heroEl&&contactEl&&"IntersectionObserver"in window){let pastHero=false,inContact=false;const heroObs=new IntersectionObserver(entries=>{entries.forEach(entry=>{pastHero=!entry.isIntersecting&&entry.boundingClientRect.top<0;updateFloating()})},{threshold:0});heroObs.observe(heroEl);const contactObs=new IntersectionObserver(entries=>{entries.forEach(entry=>{inContact=entry.isIntersecting;updateFloating()})},{threshold:.15});contactObs.observe(contactEl);function updateFloating(){floatingCta.classList.toggle("show",pastHero&&!inContact)}}

const form = document.getElementById("contactForm");
if(form){form.addEventListener("submit",async e=>{e.preventDefault();const data=new FormData(form),name=(data.get("name")||"").toString().trim(),email=(data.get("email")||"").toString().trim(),category=(data.get("category")||"").toString().trim(),timing=(data.get("timing")||"").toString().trim(),message=(data.get("message")||"").toString().trim();
if(!name||!email||!category||!message){showStatus("必須項目が未入力です。ご確認ください。","err");return}
const sendData = new URLSearchParams({name, email, category, timing, message});
try{await fetch(GAS_URL,{method:"POST",mode:"no-cors",body:sendData});form.reset();showStatus("お問い合わせを受け付けました。ありがとうございます。","ok")}catch(error){showStatus("送信に失敗しました。しばらくかけてもう一度お試しください。","err")}})}

function showStatus(text,type){let statusEl=document.querySelector(".form-status");if(!statusEl){statusEl=document.createElement("p");statusEl.className="form-status";form.appendChild(statusEl)}statusEl.textContent=text;statusEl.className=`form-status show ${type}`}
