/* Lunessa LINE customer memory (LIFF).
   Opened from the LINE OA rich menu (https://liff.line.me/2011877383-CgTrRJ7u) the page
   gets the customer's LINE ID token, asks the backend for *their own* saved name, phone
   and pets, and pre-fills them. The token is sent with the booking so the backend can link
   the LINE account (verified server-side with LINE). Outside LINE nothing changes. */
(function(){
  var LIFF_ID='2011877383-CgTrRJ7u';
  var SDK='https://static.line-scdn.net/liff/edge/2/sdk.js';
  var LN=window.LN={ready:false,known:false,pets:[],owner:'',phone:''};
  var clean=function(s){return String(s==null?'':s).replace(/[<>"'`&]/g,'').trim().slice(0,80);};
  var key=function(s){return String(s||'').trim().toLowerCase();};
  var L=function(k,d){var t=(typeof T==='function'?T():{})||{};return t[k]||(I.th&&I.th[k])||d;};

  // Fresh ID token for the booking (empty if not in LINE / expired).
  window.lnToken=function(){
    try{
      if(!LN.ready||!window.liff||!liff.isLoggedIn())return '';
      var d=liff.getDecodedIDToken();
      if(d&&d.exp&&d.exp*1000<Date.now()+60000)return '';
      return liff.getIDToken()||'';
    }catch(e){return '';}
  };

  function apply(j){
    LN.known=true;
    LN.owner=clean(j.owner);LN.phone=clean(j.phone).replace(/[^\d+\- ]/g,'');
    LN.pets=(Array.isArray(j.pets)?j.pets:[]).map(function(p){
      return {name:clean(p.name),type:['dog','cat','rabbit'].indexOf(p.type)>=0?p.type:'dog',note:clean(p.note).slice(0,300),none:!!p.none};
    }).filter(function(p){return p.name;});
    if(!owner)owner=LN.owner;
    if(!phone)phone=LN.phone;
    if(step===2){
      var o=document.getElementById('owner'),ph=document.getElementById('phone');
      if(o&&!o.value)o.value=owner;
      if(ph&&!ph.value)ph.value=phone;
    }
    if(step===1)render();
  }

  async function boot(){
    try{await liff.init({liffId:LIFF_ID});}catch(e){return;}
    LN.ready=true;
    if(!liff.isLoggedIn()){
      if(liff.isInClient())liff.login();
      return; // external browser: plain manual entry
    }
    var tok=window.lnToken();
    if(!tok)return;
    try{
      var r=await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'profile',idToken:tok})});
      var j=await r.json();
      if(j&&j.ok&&j.known)apply(j);
    }catch(e){}
  }

  function blank(){return {name:'',type:'dog',svc:'bath',note:'',none:false};}
  function toggle(i){
    var kp=LN.pets[i];if(!kp)return;
    var at=pets.findIndex(function(p){return key(p.name)===key(kp.name);});
    if(at>=0){
      if(pets.length>1)pets.splice(at,1);else pets=[blank()];
    }else{
      var np={name:kp.name,type:kp.type,svc:'bath',note:kp.none?'':kp.note,none:kp.none};
      var empty=pets.findIndex(function(p){return !String(p.name||'').trim();});
      if(empty>=0){np.svc=pets[empty].svc||'bath';pets[empty]=np;}
      else if(pets.length<2)pets.push(np);
      else{alert(L('max2','จองได้ครั้งละไม่เกิน 2 ตัว'));return;}
    }
    render();
  }

  function paint(){
    if(step!==1||!LN.known)return;
    var s1=document.getElementById('s1');if(!s1||s1.querySelector('#lnPets'))return;
    var box=document.createElement('div');box.className='card';box.id='lnPets';
    var h=document.createElement('strong');
    h.textContent=LN.owner?L('welcome','ยินดีต้อนรับกลับค่ะ คุณ')+LN.owner:L('myPets','น้องของคุณ');
    box.appendChild(h);
    if(LN.pets.length){
      var hint=document.createElement('p');hint.className='hint';
      hint.textContent=(LN.owner?L('myPets','น้องของคุณ')+' · ':'')+L('myPetsHint','แตะชื่อน้องเพื่อเลือก ไม่ต้องกรอกใหม่');
      box.appendChild(hint);
      var wrap=document.createElement('div');wrap.className='slots';
      LN.pets.forEach(function(p,i){
        var b=document.createElement('button');b.type='button';
        var on=pets.some(function(x){return key(x.name)===key(p.name);});
        b.className=on?'on':'';
        b.textContent=(on?'✓ ':'')+p.name;
        b.onclick=function(){toggle(i);};
        wrap.appendChild(b);
      });
      box.appendChild(wrap);
    }
    var lead=s1.querySelector('.lead');
    if(lead)lead.insertAdjacentElement('afterend',box);else s1.insertBefore(box,s1.firstChild);
  }

  var _renderLine=render;
  render=function(){_renderLine();paint();};

  var s=document.createElement('script');
  s.src=SDK;s.charset='utf-8';s.async=true;
  s.onload=function(){if(window.liff)boot();};
  document.head.appendChild(s);
})();
