const SPREADSHEET_ID='14g0ayVHso9fNaB3Aw5liHVSrATyUM15mWkb1YYCEtkA';
const TZ='Asia/Bangkok';
const BOOK='WEB_BOOKINGS', CUST='WEB_CUSTOMERS', PET='WEB_PETS';
const SLOTS=['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
const P=PropertiesService.getScriptProperties();

function setup(){
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
  ensure_(ss,BOOK,['booking_id','created_at','owner','phone','date','time','hours','deposit','status','stripe_session_id','payment_intent','calendar_event_id','pets_json']);
  ensure_(ss,CUST,['customer_id','created_at','owner','phone']);
  ensure_(ss,PET,['pet_id','customer_id','pet_name','type','service','created_at']);
}
function ensure_(ss,name,headers){
  let sh=ss.getSheetByName(name);
  if(!sh)sh=ss.insertSheet(name);
  if(sh.getLastRow()===0)sh.appendRow(headers);
  return sh;
}
function doGet(e){
  if(e.parameter.action==='slots')return out_({ok:true,slots:getSlots_(e.parameter.date)});
  return out_({ok:true,service:'Lunessa Booking API'});
}
function doPost(e){
  try{
    const body=e.postData&&e.postData.contents?JSON.parse(e.postData.contents):{};
    if(body.action==='createCheckout')return out_(createCheckout_(body));
    return out_({ok:false,message:'Unknown action'});
  }catch(err){return out_({ok:false,message:err.message})}
}
function createCheckout_(p){
  setup_();
  validate_(p);
  const bookingId='LNS-'+Utilities.formatDate(new Date(),TZ,'yyyyMMdd-HHmmss')+'-'+Math.floor(Math.random()*900+100);
  const secret=P.getProperty('STRIPE_SECRET_KEY');
  if(!secret)throw Error('ยังไม่ได้ตั้ง STRIPE_SECRET_KEY ใน Script Properties');
  const web=P.getProperty('WEB_APP_URL')||ScriptApp.getService().getUrl();
  const desc=p.pets.map(x=>x.name+' - '+label_(x.service)).join(', ');
  const form={
    mode:'payment',
    success_url:web+'?paid=1&booking_id='+encodeURIComponent(bookingId),
    cancel_url:web+'?cancelled=1&booking_id='+encodeURIComponent(bookingId),
    'line_items[0][price_data][currency]':'thb',
    'line_items[0][price_data][unit_amount]':String(Math.round(Number(p.deposit)*100)),
    'line_items[0][price_data][product_data][name]':'Lunessa Grooming Deposit',
    'line_items[0][price_data][product_data][description]':desc+' | '+p.date+' '+p.time,
    'line_items[0][quantity]':'1',
    'metadata[booking_id]':bookingId,
    'metadata[owner]':p.owner,
    'metadata[phone]':p.phone,
    'metadata[date]':p.date,
    'metadata[time]':p.time,
    'metadata[hours]':String(p.hours)
  };
  const res=UrlFetchApp.fetch('https://api.stripe.com/v1/checkout/sessions',{
    method:'post',headers:{Authorization:'Bearer '+secret},payload:form,muteHttpExceptions:true
  });
  const s=JSON.parse(res.getContentText());
  if(!s.id||!s.url)throw Error(s.error&&s.error.message?s.error.message:'Stripe Checkout creation failed');
  SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BOOK).appendRow([
    bookingId,new Date(),p.owner,p.phone,p.date,p.time,p.hours,p.deposit,'PENDING_PAYMENT',s.id,'','','',JSON.stringify(p.pets)
  ]);
  return {ok:true,bookingId:bookingId,checkoutUrl:s.url};
}
function validate_(p){
  if(!p.owner||!p.phone||!p.date||!p.time||!p.pets||p.pets.length<1||p.pets.length>2)throw Error('ข้อมูลการจองไม่ครบ');
  const hours=bookingHours_(p.pets),dep=deposit_(p.pets);
  if(Number(p.hours)!==hours||Number(p.deposit)!==dep)throw Error('ข้อมูลเวลา/มัดจำไม่ตรงกับกฎร้าน');
  if(!getSlots_(p.date)[p.time])throw Error('เวลานี้ไม่ว่างแล้ว กรุณาเลือกเวลาใหม่');
}
function bookingHours_(pets){
  if(pets.length===1)return hours_(pets[0].service);
  const a=pets.map(x=>x.service),b=a.filter(x=>x==='bath').length,g=a.filter(x=>x==='clip'||x==='scissor').length;
  if(b===1&&g===1)return 3;
  if(g===2)return 4;
  if(b===2)return 3;
  return a.reduce((n,s)=>n+hours_(s),0);
}
function hours_(s){return s==='bath'?2:(s==='clip'||s==='scissor'?3:(s==='haircut_only'?2:1))}
function deposit_(pets){return pets.reduce((n,p)=>n+((p.service==='clip'||p.service==='scissor')?400:200),0)}
function getSlots_(date){
  const out={};SLOTS.forEach(t=>out[t]=true);
  const sh=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BOOK);
  if(!sh||sh.getLastRow()<2)return out;
  const v=sh.getDataRange().getValues(),h=v[0],di=h.indexOf('date'),ti=h.indexOf('time'),hi=h.indexOf('hours'),si=h.indexOf('status');
  for(let r=1;r<v.length;r++){
    if(String(v[r][di])===date&&['PENDING_PAYMENT','CONFIRMED'].indexOf(String(v[r][si]))>-1){
      const start=String(v[r][ti]),n=Number(v[r][hi])||0,idx=SLOTS.indexOf(start);
      for(let k=0;k<n;k++)if(idx+k>=0&&idx+k<SLOTS.length)out[SLOTS[idx+k]]=false;
    }
  }
  return out;
}
/*
  Stripe -> Apps Script webhook
  For the final live deployment, set STRIPE_WEBHOOK_SECRET and use a receiver
  that preserves Stripe-Signature. Apps Script web apps do not reliably expose
  arbitrary request headers. The included webhook handler is therefore a
  simple event endpoint for a controlled setup; for production-grade signature
  verification, use Stripe's recommended server environment (Cloud Run/Functions).
*/
function doStripeWebhook(e){
  const event=JSON.parse(e.postData.contents);
  if(event.type==='checkout.session.completed')confirm_(event.data.object);
  return out_({received:true});
}
function confirm_(session){
  const id=session.metadata&&session.metadata.booking_id;if(!id)return;
  const sh=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BOOK),v=sh.getDataRange().getValues(),h=v[0];
  const ii=h.indexOf('booking_id'),si=h.indexOf('status'),pi=h.indexOf('payment_intent');
  for(let r=1;r<v.length;r++)if(v[r][ii]===id){
    if(v[r][si]==='CONFIRMED')return;
    sh.getRange(r+1,si+1).setValue('CONFIRMED');
    sh.getRange(r+1,pi+1).setValue(session.payment_intent||'');
    createCalendar_(v[r],h,id);
    createRecords_(v[r],h);
    return;
  }
}
function createCalendar_(row,h,id){
  const get=k=>row[h.indexOf(k)];
  const start=new Date(get('date')+'T'+get('time')+':00+07:00'),end=new Date(start.getTime()+Number(get('hours'))*3600000);
  const pets=JSON.parse(get('pets_json')||'[]');
  const title='Lunessa • '+get('owner')+' • '+pets.map(x=>x.name).join(', ');
  const desc='Booking ID: '+id+'\nOwner: '+get('owner')+'\nPhone: '+get('phone')+'\n'+pets.map(x=>x.name+' — '+label_(x.service)).join('\n')+'\nDeposit: ฿'+get('deposit');
  const ev=CalendarApp.getDefaultCalendar().createEvent(title,start,end,{description:desc});
  const sh=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BOOK),v=sh.getDataRange().getValues(),hh=v[0],ii=hh.indexOf('booking_id'),ei=hh.indexOf('calendar_event_id');
  for(let r=1;r<v.length;r++)if(v[r][ii]===id){sh.getRange(r+1,ei+1).setValue(ev.getId());break}
}
function createRecords_(row,h){
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID),cs=ss.getSheetByName(CUST),ps=ss.getSheetByName(PET);
  const get=k=>row[h.indexOf(k)],cid='C-'+Utilities.getUuid().slice(0,8).toUpperCase();
  cs.appendRow([cid,new Date(),get('owner'),get('phone')]);
  JSON.parse(get('pets_json')||'[]').forEach(p=>ps.appendRow(['P-'+Utilities.getUuid().slice(0,8).toUpperCase(),cid,p.name,p.type,p.service,new Date()]));
}
function label_(s){return({bath:'อาบน้ำ',clip:'อาบน้ำ + ตัดไถ',scissor:'อาบน้ำ + ตัดกรรไกร',haircut_only:'ตัดขนอย่างเดียว',addon:'บริการเสริมอย่างเดียว'})[s]||s}
function out_(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON)}
function setup_(){setup()}
