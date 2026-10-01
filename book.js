const SHEET='16aGhjPvcEsrw1NAc9qULkE3B4RuroBe9kRK-oIc1ZVg';
const csvUrl=name=>'https://docs.google.com/spreadsheets/d/'+SHEET+'/gviz/tq?tqx=out:csv&sheet='+name;
let CLOSED=['2026-10-23','2026-10-24','2026-10-29','2026-10-30','2026-10-31','2026-11-01','2026-11-02','2026-11-03','2026-11-04','2026-11-05','2026-11-06','2026-11-07'];
let TAKEN=[]; let n=1; let chosen='';
function ymd(v){const s=String(v||'').replace(/"/g,''); const m=s.match(/(\d{4}-\d{2}-\d{2})/); if(m) return m[1]; const d=new Date(s); if(!isNaN(d)){const z=n=>String(n).padStart(2,'0'); return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());} return '';}
function parseCsv(text){return text.trim().split(/\n/).map(line=>line.split(',').map(x=>x.replace(/^"|"$/g,'')));}
async function loadSheet(){try{const t=await fetch(csvUrl('WEB_CLOSED')).then(r=>r.text()); if(t.indexOf('<')!==0){const rows=parseCsv(t).slice(1).map(r=>ymd(r[0])).filter(Boolean); if(rows.length) CLOSED=rows;}}catch(e){} try{const t=await fetch(csvUrl('WEB_BOOKINGS')).then(r=>r.text()); if(t.indexOf('<')!==0){TAKEN=parseCsv(t).slice(1).filter(r=>r[9]!=='ยกเลิก').map(r=>({date:ymd(r[5]),start:parseInt(String(r[6]).slice(0,2),10),hours:Number(r[7])||2}));}}catch(e){} plan();}
function petHTML(i){return '<div class="pet"><b>น้อง '+i+'</b><label>ชื่อ</label><input class="pname"><label>บริการ</label><select class="psvc"><option value="addon">เสริม</option><option value="bath" selected>อาบน้ำ</option><option value="cut">ตัดอย่างเดียว</option><option value="clip">อาบน้ำ+ไถ</option><option value="scissor">อาบน้ำ+กรรไกร</option></select><label>ข้อควรระวัง</label><textarea class="pcaut"></textarea></div>';}
pets.innerHTML=petHTML(1);
addPet.onclick=()=>{if(n>=2)return;n=2;pets.insertAdjacentHTML('beforeend',petHTML(2));addPet.hidden=true;bind();};
function bind(){pets.querySelectorAll('select').forEach(el=>el.onchange=plan);plan();}
bind();
function rank(s){return {addon:1,bath:2,cut:2,clip:3,scissor:3}[s];}
function hours(a,b){if(!b)return a==='addon'?1:(a==='bath'||a==='cut'?2:3);const x=[a,b].sort((p,q)=>rank(p)-rank(q));if(x[0]==='addon'&&x[1]==='addon')return 1;if(x[0]==='addon'&&x[1]==='bath')return 2;if(x[0]==='addon'&&x[1]==='cut')return 3;if(x[0]==='addon')return 4;if((x[0]==='bath'||x[0]==='cut')&&(x[1]==='bath'||x[1]==='cut'))return 3;return 4;}
function dep(s){return (s==='clip'||s==='scissor')?400:200;}
function read(){return [...pets.querySelectorAll('.pet')].map(b=>({name:b.querySelector('.pname').value.trim()||'น้อง',service:b.querySelector('.psvc').value,caution:b.querySelector('.pcaut').value.trim()}));}
function plan(){const p=read(),h=hours(p[0].service,p[1]&&p[1].service),d=p.reduce((s,x)=>s+dep(x.service),0);hoursTxt.textContent=h+' ชม.';depTxt.textContent=d+' บาท';draw(h);return {h,d,p};}
function overlap(s,h,b){return s<b.start+b.hours&&s+h>b.start;}
function draw(h){slots.innerHTML='';dayNote.textContent='';if(CLOSED.indexOf(date.value)!==-1){dayNote.textContent='วันนี้ร้านหยุด จองไม่ได้';chosen='';return;}const last=h<=2?19:h===3?18:17;const busy=TAKEN.filter(x=>x.date===date.value);['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].forEach(t=>{const s=+t.slice(0,2);const blocked=s>last||busy.some(b=>overlap(s,h,b));const b=document.createElement('button');b.type='button';b.textContent=t;b.className=chosen===t?'on':'';b.disabled=blocked;b.onclick=()=>{chosen=t;plan();};slots.appendChild(b);});}
date.min=new Date().toISOString().slice(0,10);date.value=date.min;date.onchange=()=>plan();loadSheet();
goPay.onclick=()=>{const pl=plan();if(CLOSED.indexOf(date.value)!==-1){alert('วันนี้หยุด');return;}if(!owner.value.trim()||!phone.value.trim()){alert('ใส่ชื่อกับเบอร์');return;}if(!chosen){alert('เลือกเวลา');return;}if(pl.p.some(x=>!x.caution)){alert('ใส่ข้อควรระวัง');return;}alert('รหัสจอง LN-'+Date.now().toString().slice(-6)+' โอนมัดจำ '+pl.d+' บาท แล้วส่งสลิปไลน์');};
