/* Staff key for Lunessa staff pages (a short PIN, e.g. 4 digits). Asked once per device,
   kept in localStorage. Backend errors: staff_key (wrong/missing) and staff_locked
   (too many wrong keys; all staff calls refused for 15 minutes). */
(function(){
  var K='lunessa_staff_key';
  var LOCK_MSG='ใส่รหัสผิดหลายครั้ง ระบบล็อกไว้ 15 นาที กรุณารอแล้วลองใหม่';
  // Thai digits -> 0-9; drop spaces/dashes. No case changes.
  var norm=function(v){return String(v||'').replace(/[\u0E50-\u0E59]/g,function(c){return String(c.charCodeAt(0)-0x0E50);}).replace(/[^0-9A-Za-z]/g,'');};
  window.staffKey=function(force,msg){
    var k=norm(localStorage.getItem(K));
    if(!k||force){
      k=norm(prompt(msg||'ใส่รหัสพนักงาน (ตัวเลข)'));
      if(k)localStorage.setItem(K,k);
    }
    return k;
  };
  window.staffKeyBad=function(){localStorage.removeItem(K);};
  window.staffLockedMsg=LOCK_MSG;
  // GET with key; on a wrong key, ask once more and retry. Locked: tell the user, keep the key.
  window.staffGet=async function(api,params){
    for(var i=0;i<2;i++){
      var k=staffKey(i>0,i>0?'รหัสพนักงานไม่ถูกต้อง ใส่ใหม่อีกครั้ง (ตัวเลข)':'');
      if(!k)return {ok:false,error:'staff_key'};
      var q=new URLSearchParams(Object.assign({},params,{key:k,t:Date.now()}));
      var j=await fetch(api+'?'+q.toString()).then(function(r){return r.json();});
      if(j&&j.error==='staff_locked'){alert(LOCK_MSG);return j;}
      if(j&&j.error==='staff_key'){staffKeyBad();continue;}
      return j;
    }
    return {ok:false,error:'staff_key'};
  };
})();
