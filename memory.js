function digits(v){return String(v||'').replace(/\D/g,'');}
async function findPets(phone){
  const url='https://docs.google.com/spreadsheets/d/'+SHEET+'/gviz/tq?tqx=out:csv&sheet=WEB_PETS';
  const text=await fetch(url).then(r=>r.text());
  if(!text||text[0]==='<') return [];
  const rows=text.trim().split(/\n/).slice(1).map(l=>l.split(',').map(x=>x.replace(/^"|"$/g,'')));
  const d=digits(phone);
  return rows.filter(r=>digits(r[2])&&digits(r[2])===d).map(r=>({name:r[4],type:r[5]||'dog',note:r[6]||'',none:r[6]==='ไม่มีข้อควรระวัง'}));
}
const _renderMem=render;
render=function(){
  _renderMem();
  const phone=document.getElementById('phone');
  if(!phone||phone.dataset.mem) return;
  phone.dataset.mem='1';
  phone.addEventListener('change', async function(){
    const found=await findPets(phone.value);
    const old=document.getElementById('oldPets');
    if(old) old.remove();
    if(!found.length) return;
    const box=document.createElement('div');
    box.id='oldPets';
    box.className='card';
    box.innerHTML='<strong>พบข้อมูลน้องเดิม</strong><p class="hint">เลือกน้องที่เคยมารับบริการ ไม่ต้องกรอกใหม่</p>'+found.map((p,i)=>'<button type="button" class="btn ghost" data-old="'+i+'">'+p.name+'</button>').join(' ');
    phone.insertAdjacentElement('afterend', box);
    box.querySelectorAll('[data-old]').forEach(btn=>btn.onclick=()=>{
      const p=found[+btn.dataset.old];
      pets=[{name:p.name,type:p.type||'dog',svc:'bath',note:p.note,none:p.none}];
      owner=document.getElementById('owner').value;
      lineId=document.getElementById('lineId').value;
      go(1);
    });
  });
};
