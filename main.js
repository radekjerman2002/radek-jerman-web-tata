(function(){
 var T={obrazy:['Radek Jerman – Obrazy','Radek Jerman – Works'],'o-mne':['Radek Jerman – O mně','Radek Jerman – About'],kontakt:['Radek Jerman – Kontakt','Radek Jerman – Contact']};
 var btns=document.querySelectorAll('.lang button'),lang='en',page='obrazy';
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
 btns.forEach(function(b){b.addEventListener('click',function(){lang=b.dataset.l;render()})});
 lang='en';
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
 var works=[].slice.call(g.querySelectorAll('.work')),cur=0;
 var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
 lb.innerHTML='<button type="button" class="lbx" aria-label="Close">\u00d7</button><img alt=""><p></p><div class="lbnav"><button type="button" class="lbp" aria-label="Previous">\u2190</button><button type="button" class="lbn" aria-label="Next">\u2192</button></div>';
 document.body.appendChild(lb);
 var li=lb.querySelector('img'),lp=lb.querySelector('p');
 function show(i){
  cur=(i+works.length)%works.length;var w=works[cur],im=w.querySelector('img');
  li.src=im.src;li.alt=im.alt;var sp=w.querySelector('span');
  lp.textContent=w.querySelector('h3').textContent+(sp&&sp.textContent?' \u00b7 '+sp.textContent:'');
 }
 function open(i){show(i);lb.classList.add('on');document.documentElement.style.overflow='hidden'}
 function close(){lb.classList.remove('on');document.documentElement.style.overflow=''}
 lb.addEventListener('click',function(e){
  var t=e.target;
  if(t.closest('.lbp')){show(cur-1);return}
  if(t.closest('.lbn')){show(cur+1);return}
  close();
 });
 document.addEventListener('keydown',function(e){
  if(!lb.classList.contains('on'))return;
  if(e.key==='Escape')close();
  else if(e.key==='ArrowLeft')show(cur-1);
  else if(e.key==='ArrowRight')show(cur+1);
 });
 var tx=null,moved=false;
 lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;moved=false},{passive:true});
 lb.addEventListener('touchend',function(e){
  if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;tx=null;
  if(Math.abs(dx)>50){moved=true;show(cur+(dx<0?1:-1));e.preventDefault()}
 });
 lb.addEventListener('click',function(e){if(moved){moved=false;e.stopImmediatePropagation()}},true);
 works.forEach(function(w,i){w.addEventListener('click',function(){if(w.querySelector('img'))open(i)})});

 route();
})();

(function(){
 var g=document.querySelector('.gallery'),pv=document.getElementById('gprev'),nx=document.getElementById('gnext');
 function upd(){var m=g.scrollWidth-g.clientWidth;pv.disabled=g.scrollLeft<=1;nx.disabled=g.scrollLeft>=m-1}
 function step(dir){var w=g.querySelector('.work');g.scrollBy({left:dir*(w.offsetWidth+40),behavior:'smooth'})}
 pv.addEventListener('click',function(){step(-1)});nx.addEventListener('click',function(){step(1)});
 g.addEventListener('scroll',upd);window.addEventListener('resize',upd);window.addEventListener('load',upd);window.addEventListener('hashchange',upd);
 document.addEventListener('click',function(){setTimeout(upd,0)});
 var ct=document.getElementById('gcount');
 function cnt(){
  var ws=g.querySelectorAll('.work'),gl=g.getBoundingClientRect().left,best=0,bd=1e9;
  ws.forEach(function(w,i){var d=Math.abs(w.getBoundingClientRect().left-gl);if(d<bd){bd=d;best=i}});
  if(g.scrollLeft>=g.scrollWidth-g.clientWidth-1)best=ws.length-1;
  var p=function(n){return n<10?'0'+n:''+n};
  ct.textContent=p(best+1)+' / '+p(ws.length);
 }
 g.addEventListener('scroll',cnt,{passive:true});window.addEventListener('resize',cnt);window.addEventListener('load',cnt);window.addEventListener('hashchange',cnt);
 cnt();
 upd();
 var d=document.getElementById('sigdraw');
 var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 if('IntersectionObserver' in window&&!calm){
  d.classList.add('armed');
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){d.classList.add('go');io.disconnect()}})},{threshold:.5});
  io.observe(d);
 }
})();

(function(){
 var hd=document.querySelector('header'),bt=document.getElementById('menubtn'),de=document.documentElement;
 function set(o){hd.classList.toggle('open',o);de.classList.toggle('menu-open',o);bt.setAttribute('aria-expanded',o?'true':'false')}
 bt.addEventListener('click',function(){set(!hd.classList.contains('open'))});
 document.querySelectorAll('nav a,.logo').forEach(function(a){a.addEventListener('click',function(){set(false)})});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
 window.addEventListener('resize',function(){if(window.innerWidth>820)set(false)});
})();
