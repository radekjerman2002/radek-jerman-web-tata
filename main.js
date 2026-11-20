(function(){
 var T={obrazy:['Radek Jerman – Obrazy','Radek Jerman – Works'],'o-mne':['Radek Jerman – O mně','Radek Jerman – About'],kontakt:['Radek Jerman – Kontakt','Radek Jerman – Contact']};
 var btns=document.querySelectorAll('.lang button'),lang='cs',page='obrazy';
 function render(){
  document.documentElement.lang=lang;
  var i=lang==='cs'?0:1;
  document.querySelectorAll('[data-cs]').forEach(function(e){e.textContent=e.getAttribute('data-'+lang)});
  btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===lang)});
  document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('on',v.id==='v-'+page)});
  document.querySelectorAll('nav a').forEach(function(a){if(a.getAttribute('href')==='#'+page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  document.title=T[page][i];document.body.setAttribute("data-page",page);
 }
 function route(){var h=location.hash.slice(1);page=T[h]?h:'obrazy';render();window.scrollTo(0,0)}
 btns.forEach(function(b){b.addEventListener('click',function(){lang=b.dataset.l;try{localStorage.setItem('lang',lang)}catch(e){}render()})});
 var s=null;try{s=localStorage.getItem('lang')}catch(e){}
 if(!s){var n=(navigator.language||'').slice(0,2);s=(n==='cs'||n==='sk')?'cs':'en'}
 lang=s;
 window.addEventListener('hashchange',route);
 document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href^="#"]');
  if(!a)return;
  var h=a.getAttribute('href').slice(1);
  if(!T[h])return;
  e.preventDefault();
  page=h;render();window.scrollTo(0,0);
  try{history.replaceState(null,'','#'+h)}catch(x){}
 });
 document.getElementById('y').textContent=new Date().getFullYear();
 var g=document.querySelector('.gallery');
 g.addEventListener('wheel',function(e){
  if(Math.abs(e.deltaY)<=Math.abs(e.deltaX))return;
  var max=g.scrollWidth-g.clientWidth;
  if((e.deltaY>0&&g.scrollLeft<max-1)||(e.deltaY<0&&g.scrollLeft>0)){e.preventDefault();g.scrollLeft+=e.deltaY}
 },{passive:false});
 var lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt=""><p></p>';document.body.appendChild(lb);
 function close(){lb.classList.remove('on')}
 lb.addEventListener('click',close);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 g.querySelectorAll('.work').forEach(function(w){w.addEventListener('click',function(){
  var i=w.querySelector('img');if(!i)return;
  lb.querySelector('img').src=i.src;
  var sp=w.querySelector('span');lb.querySelector('p').textContent=w.querySelector('h3').textContent+(sp&&sp.textContent?' · '+sp.textContent:'');
  lb.classList.add('on');
 })});

 route();
})();

(function(){
 var g=document.querySelector('.gallery'),pv=document.getElementById('gprev'),nx=document.getElementById('gnext');
 function upd(){var m=g.scrollWidth-g.clientWidth;pv.disabled=g.scrollLeft<=1;nx.disabled=g.scrollLeft>=m-1}
 function step(dir){var w=g.querySelector('.work');g.scrollBy({left:dir*(w.offsetWidth+40),behavior:'smooth'})}
 pv.addEventListener('click',function(){step(-1)});nx.addEventListener('click',function(){step(1)});
 g.addEventListener('scroll',upd);window.addEventListener('resize',upd);window.addEventListener('load',upd);window.addEventListener('hashchange',upd);
 document.addEventListener('click',function(){setTimeout(upd,0)});
 upd();
 var d=document.getElementById('sigdraw');
 var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 if('IntersectionObserver' in window&&!calm){
  d.classList.add('armed');
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){d.classList.add('go');io.disconnect()}})},{threshold:.5});
  io.observe(d);
 }
})();
