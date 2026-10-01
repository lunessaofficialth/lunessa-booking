const QR='images/promptpay.jpg';
const POLICY='* เรื่องเวลาเข้ารับบริการ<br>ทางร้านขอสงวนเวลาให้กับน้องทุกคิวอย่างเต็มที่ หากมาสาย สามารถเลทได้ไม่เกิน 15 นาที หากเกินเวลาที่กำหนด มัดจำจะถูกหักโดยอัตโนมัติ<br><br>หากเกิดเหตุฉุกเฉินหรือมีเหตุจำเป็นระหว่างเดินทาง กรุณาติดต่อช่างทาง LINE โดยเร็วที่สุด เพื่อให้ทางร้านช่วยดูแลคิวให้เหมาะสม';
function tweak(){
  document.querySelectorAll('input[data-k="name"]').forEach(el=>el.placeholder='');
  document.querySelectorAll('label').forEach(el=>{if(el.textContent.indexOf('อยากรู้')!==-1)el.textContent='มีอะไรที่เราควรรู้เกี่ยวกับน้องไหม?';});
  document.querySelectorAll('textarea[data-k="note"]').forEach(el=>{
    if(el.nextElementSibling&&el.nextElementSibling.classList.contains('none-box'))return;
    const box=document.createElement('label'); box.className='none-box'; box.style.display='flex'; box.style.gap='8px'; box.style.alignItems='center';
    const c=document.createElement('input'); c.type='checkbox'; c.style.width='auto'; c.onchange=()=>{el.disabled=c.checked; if(c.checked)el.value='';};
    box.appendChild(c); box.appendChild(document.createTextNode('ไม่มีข้อควรระวัง'));
    el.insertAdjacentElement('afterend', box);
  });
  const n1=document.getElementById('n1'); if(n1) n1.onclick=()=>{const bad=pets.some((p,i)=>{const box=document.querySelectorAll('.none-box input')[i]; return !p.name||(!p.note&&!(box&&box.checked));}); if(bad){alert('ใส่ชื่อน้อง หรือติ๊กว่าไม่มีข้อควรระวัง'); return;} pets.forEach((p,i)=>{const box=document.querySelectorAll('.none-box input')[i]; if(box&&box.checked)p.note='ไม่มีข้อควรระวัง';}); go(2);};
  const pay=document.querySelector('#s4 a.primary'); if(pay){pay.removeAttribute('href'); pay.onclick=e=>{e.preventDefault(); showPay();};}
  const box=document.querySelector('#s4 .card strong');
  if(box&&document.getElementById('s4').classList.contains('on')){
    const cards=document.querySelectorAll('#s4 .card');
    if(cards[1]) cards[1].innerHTML=POLICY+'<p><a href="https://line.me/R/ti/p/@300kvtvw">LINE @lunessa</a></p>';
  }
}
function showPay(){
  if(!code) code='LN-'+Date.now().toString().slice(-6);
  const pl=plan();
  document.getElementById('s4').innerHTML='<h2>ชำระมัดจำ</h2><p class="lead">สแกนคิวอาร์โค้ดแล้วโอนเข้าบัญชี ลูเนสซ่า</p><div class="card" style="text-align:center"><img class="qr" src="'+QR+'" alt="PromptPay"/><p><b>฿'+pl.d+'</b></p><p>รหัสจอง</p><p style="font-size:28px;font-weight:700">'+code+'</p><p class="hint">แคปหน้านี้ไว้ส่งในไลน์ได้ ไม่ต้องพิมรหัสเอง</p></div><button class="btn primary" id="confirmPay">ยืนยันการชำระแล้ว</button>';
  document.getElementById('confirmPay').onclick=sendBooking;
}
async function sendBooking(){
  const pl=plan();
  const row={booking_id:code,owner:(document.getElementById('owner')||{}).value||'',phone:(document.getElementById('phone')||{}).value||'',line:(document.getElementById('lineId')||{}).value||'',date:(document.getElementById('date')||{}).value||'',time:chosen,hours:pl.h,deposit:pl.d,status:'รอตรวจสลิป',pets:pets};
  TAKEN.push({date:row.date,start:+String(chosen).slice(0,2),hours:pl.h});
  try{await fetch('https://script.google.com/macros/s/AKfycbyOM3MfkwLwBf0RkPlAoKzfa_1EbX2yjPyVP54G-YNUspcjVT9zm82VegNvMyvvbXt5/exec',{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action:'confirmDeposit',booking:row})});}catch(e){}
  go(5);
}
const _render=render; render=function(){_render(); tweak();};
render();
