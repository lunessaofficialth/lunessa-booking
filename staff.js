/* Staff key for Lunessa staff pages. Asked once per device, kept in localStorage.
   The backend rejects staff actions without it ({ok:false,error:'staff_key'}). */
(function(){
  var K='lunessa_staff_key';
  window.staffKey=function(force,msg){
    var k=localStorage.getItem(K)||'';
    if(!k||force){
      k=(prompt(msg||'ใส่รหัสพนักงาน (Staff key)')||'').trim();
      if(k)localStorage.setItem(K,k);
    }
    return k;
  };
  window.staffKeyBad=function(){localStorage.removeItem(K);};
  // GET with key; on a wrong key, ask once more and retry.
  window.staffGet=async function(api,params){
    for(var i=0;i<2;i++){
      var k=staffKey(i>0,i>0?'รหัสพนักงานไม่ถูกต้อง ใส่ใหม่อีกครั้ง':'');
      if(!k)return {ok:false,error:'staff_key'};
      var q=new URLSearchParams(Object.assign({},params,{key:k,t:Date.now()}));
      var j=await fetch(api+'?'+q.toString()).then(function(r){return r.json();});
      if(j&&j.error==='staff_key'){staffKeyBad();continue;}
      return j;
    }
    return {ok:false,error:'staff_key'};
  };
})();
