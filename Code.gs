const SPREADSHEET_ID = '14g0ayVHso9fNaB3Aw5liHVSrATyUM15mWkb1YYCEtkA';
const TZ = 'Asia/Bangkok';

const BOOK = 'WEB_BOOKINGS';
const CUST = 'WEB_CUSTOMERS';
const PET = 'WEB_PETS';

// ตารางเวลาหลักที่ลูกค้าเห็นบนเว็บไซต์
const SCHEDULE = 'Sheet1';

// เวลาเปิดร้าน 10:00–19:00
// 19:00 คือเวลาสิ้นสุดร้าน ไม่ใช่เวลาเริ่มงานใหม่
const SLOTS = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'
];

const P = PropertiesService.getScriptProperties();


/* =========================================================
   SETUP
========================================================= */

function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  ensure_(ss, BOOK, [
    'booking_id',
    'created_at',
    'owner',
    'phone',
    'date',
    'time',
    'hours',
    'deposit',
    'status',
    'stripe_session_id',
    'payment_intent',
    'calendar_event_id',
    'pets_json'
  ]);

  ensure_(ss, CUST, [
    'customer_id',
    'created_at',
    'owner',
    'phone'
  ]);

  ensure_(ss, PET, [
    'pet_id',
    'customer_id',
    'pet_name',
    'type',
    'service',
    'created_at'
  ]);
}


function ensure_(ss, name, headers) {
  let sh = ss.getSheetByName(name);

  if (!sh) {
    sh = ss.insertSheet(name);
  }

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
  }

  return sh;
}


/* =========================================================
   GET
========================================================= */

function doGet(e) {

  try {

    if (e && e.parameter && e.parameter.action === 'slots') {

      const date = normalizeDate_(e.parameter.date);

      return out_({
        ok: true,
        date: date,
        slots: getSlots_(date)
      });
    }

    return out_({
      ok: true,
      service: 'Lunessa Booking API'
    });

  } catch (err) {

    return out_({
      ok: false,
      message: err.message
    });
  }
}


/* =========================================================
   POST
========================================================= */

function doPost(e) {

  try {

    const body =
      e.postData && e.postData.contents
        ? JSON.parse(e.postData.contents)
        : {};

    if (body.action === 'createCheckout') {
      return out_(createCheckout_(body));
    }

    return out_({
      ok: false,
      message: 'Unknown action'
    });

  } catch (err) {

    return out_({
      ok: false,
      message: err.message
    });
  }
}


/* =========================================================
   CREATE CHECKOUT
========================================================= */

function createCheckout_(p) {

  setup_();

  validate_(p);

  const bookingId =
    'LNS-' +
    Utilities.formatDate(new Date(), TZ, 'yyyyMMdd-HHmmss') +
    '-' +
    Math.floor(Math.random() * 900 + 100);

  const secret = P.getProperty('STRIPE_SECRET_KEY');

  if (!secret) {
    throw Error(
      'ยังไม่ได้ตั้ง STRIPE_SECRET_KEY ใน Script Properties'
    );
  }

  const web =
    P.getProperty('WEB_APP_URL') ||
    ScriptApp.getService().getUrl();

  const desc = p.pets
    .map(x => x.name + ' - ' + label_(x.service))
    .join(', ');

  const form = {

    mode: 'payment',

    success_url:
      web +
      '?paid=1&booking_id=' +
      encodeURIComponent(bookingId),

    cancel_url:
      web +
      '?cancelled=1&booking_id=' +
      encodeURIComponent(bookingId),

    'line_items[0][price_data][currency]':
      'thb',

    'line_items[0][price_data][unit_amount]':
      String(
        Math.round(Number(p.deposit) * 100)
      ),

    'line_items[0][price_data][product_data][name]':
      'Lunessa Grooming Deposit',

    'line_items[0][price_data][product_data][description]':
      desc +
      ' | ' +
      p.date +
      ' ' +
      p.time,

    'line_items[0][quantity]':
      '1',

    'metadata[booking_id]':
      bookingId,

    'metadata[owner]':
      p.owner,

    'metadata[phone]':
      p.phone,

    'metadata[date]':
      p.date,

    'metadata[time]':
      p.time,

    'metadata[hours]':
      String(p.hours)
  };


  const res = UrlFetchApp.fetch(
    'https://api.stripe.com/v1/checkout/sessions',
    {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + secret
      },
      payload: form,
      muteHttpExceptions: true
    }
  );


  const s = JSON.parse(
    res.getContentText()
  );


  if (!s.id || !s.url) {

    throw Error(
      s.error && s.error.message
        ? s.error.message
        : 'Stripe Checkout creation failed'
    );
  }


  SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(BOOK)
    .appendRow([

      bookingId,
      new Date(),
      p.owner,
      p.phone,
      p.date,
      p.time,
      p.hours,
      p.deposit,
      'PENDING_PAYMENT',
      s.id,
      '',
      '',
      JSON.stringify(p.pets)

    ]);


  return {

    ok: true,
    bookingId: bookingId,
    checkoutUrl: s.url

  };
}


/* =========================================================
   VALIDATE BOOKING
========================================================= */

function validate_(p) {

  if (
    !p.owner ||
    !p.phone ||
    !p.date ||
    !p.time ||
    !p.pets ||
    p.pets.length < 1 ||
    p.pets.length > 2
  ) {

    throw Error(
      'ข้อมูลการจองไม่ครบ'
    );
  }


  const hours =
    bookingHours_(p.pets);

  const dep =
    deposit_(p.pets);


  if (
    Number(p.hours) !== hours ||
    Number(p.deposit) !== dep
  ) {

    throw Error(
      'ข้อมูลเวลา/มัดจำไม่ตรงกับกฎร้าน'
    );
  }


  const date =
    normalizeDate_(p.date);

  const time =
    normalizeTime_(p.time);


  /*
    สำคัญ:
    ตรวจทุกชั่วโมงของบริการ
    ไม่ใช่แค่เวลาเริ่ม
  */

  if (
    !isRangeAvailable_(
      date,
      time,
      hours
    )
  ) {

    throw Error(
      'ช่วงเวลานี้ไม่ว่างแล้ว กรุณาเลือกเวลาใหม่'
    );
  }
}


/* =========================================================
   BOOKING HOURS
========================================================= */

function bookingHours_(pets) {

  if (pets.length === 1) {
    return hours_(pets[0].service);
  }


  const services =
    pets.map(x => x.service);

  const bath =
    services.filter(
      x => x === 'bath'
    ).length;

  const groom =
    services.filter(
      x =>
        x === 'clip' ||
        x === 'scissor'
    ).length;


  // อาบน้ำ 1 + ตัดขน 1
  if (bath === 1 && groom === 1) {
    return 3;
  }


  // ตัดขน 2 ตัว
  if (groom === 2) {
    return 4;
  }


  // อาบน้ำ 2 ตัว
  if (bath === 2) {
    return 3;
  }


  return services.reduce(
    (n, s) => n + hours_(s),
    0
  );
}


/* =========================================================
   SERVICE HOURS
========================================================= */

function hours_(s) {

  if (s === 'bath') {
    return 2;
  }

  if (
    s === 'clip' ||
    s === 'scissor'
  ) {
    return 3;
  }

  if (s === 'haircut_only') {
    return 2;
  }

  return 1;
}


/* =========================================================
   DEPOSIT
========================================================= */

function deposit_(pets) {

  return pets.reduce(
    (n, p) => {

      return n +
        (
          p.service === 'clip' ||
          p.service === 'scissor'
            ? 400
            : 200
        );

    },
    0
  );
}


/* =========================================================
   GET AVAILABLE SLOTS
=========================================================

   ระบบจะรวมข้อมูลจาก 2 แหล่ง:

   1. Sheet1
      FULL = ไม่ว่าง
      FREE = ว่าง

   2. WEB_BOOKINGS
      PENDING_PAYMENT / CONFIRMED
      = ไม่ว่าง

========================================================= */

function getSlots_(date) {

  const out = {};

  /*
    เริ่มต้นทุก slot เป็น FREE
  */

  SLOTS.forEach(
    time => {
      out[time] = true;
    }
  );


  /*
    ---------------------------------------------------------
    PART 1
    อ่านตาราง Sheet1
    ---------------------------------------------------------
  */

  const ss =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );

  const schedule =
    ss.getSheetByName(
      SCHEDULE
    );


  if (schedule) {

    const data =
      schedule
        .getDataRange()
        .getValues();


    if (data.length > 0) {

      const headers =
        data[0];


      /*
        หาแถวของวันที่
      */

      for (
        let r = 1;
        r < data.length;
        r++
      ) {

        const rowDate =
          sheetDateToString_(
            data[r][0]
          );


        if (
          rowDate === date
        ) {

          /*
            เจอวันที่แล้ว
            อ่าน FULL / FREE
          */

          for (
            let c = 1;
            c < headers.length;
            c++
          ) {

            const headerTime =
              normalizeTime_(
                headers[c]
              );


            if (
              !headerTime ||
              !out.hasOwnProperty(
                headerTime
              )
            ) {
              continue;
            }


            const value =
              String(
                data[r][c] || ''
              )
                .trim()
                .toUpperCase();


            /*
              FULL = ปิดเวลา
            */

            if (
              value === 'FULL'
            ) {

              out[headerTime] =
                false;
            }


            /*
              FREE = เปิดเวลา
            */

            else if (
              value === 'FREE'
            ) {

              out[headerTime] =
                true;
            }
          }

          break;
        }
      }
    }
  }


  /*
    ---------------------------------------------------------
    PART 2
    อ่าน WEB_BOOKINGS
    ---------------------------------------------------------
  */

  const bookingSheet =
    ss.getSheetByName(
      BOOK
    );


  if (
    bookingSheet &&
    bookingSheet.getLastRow() >= 2
  ) {

    const values =
      bookingSheet
        .getDataRange()
        .getValues();

    const headers =
      values[0];


    const dateIndex =
      headers.indexOf(
        'date'
      );

    const timeIndex =
      headers.indexOf(
        'time'
      );

    const hoursIndex =
      headers.indexOf(
        'hours'
      );

    const statusIndex =
      headers.indexOf(
        'status'
      );


    for (
      let r = 1;
      r < values.length;
      r++
    ) {

      const rowDate =
        sheetDateToString_(
          values[r][dateIndex]
        );


      const status =
        String(
          values[r][statusIndex] || ''
        )
          .trim()
          .toUpperCase();


      if (
        rowDate !== date
      ) {
        continue;
      }


      /*
        Booking ที่ยังถือ slot อยู่
      */

      if (
        status !==
          'PENDING_PAYMENT' &&
        status !==
          'CONFIRMED'
      ) {

        continue;
      }


      const start =
        normalizeTime_(
          values[r][timeIndex]
        );

      const hours =
        Number(
          values[r][hoursIndex]
        ) || 0;


      const startIndex =
        SLOTS.indexOf(
          start
        );


      if (
        startIndex < 0
      ) {
        continue;
      }


      /*
        ปิดทุก slot
        ตามจำนวนชั่วโมงของ booking
      */

      for (
        let k = 0;
        k < hours;
        k++
      ) {

        const index =
          startIndex + k;


        if (
          index >= 0 &&
          index < SLOTS.length
        ) {

          out[
            SLOTS[index]
          ] = false;
        }
      }
    }
  }


  return out;
}


/* =========================================================
   CHECK RANGE AVAILABLE
========================================================= */

function isRangeAvailable_(
  date,
  startTime,
  hours
) {

  const slots =
    getSlots_(date);

  const startIndex =
    SLOTS.indexOf(
      normalizeTime_(startTime)
    );


  if (
    startIndex < 0
  ) {

    return false;
  }


  /*
    ต้องมี slot ครบทุกชั่วโมง
  */

  for (
    let k = 0;
    k < Number(hours);
    k++
  ) {

    const index =
      startIndex + k;


    /*
      เกินเวลาร้าน
    */

    if (
      index >= SLOTS.length
    ) {

      return false;
    }


    const slot =
      SLOTS[index];


    if (
      slots[slot] !== true
    ) {

      return false;
    }
  }


  return true;
}


/* =========================================================
   STRIPE WEBHOOK
========================================================= */

function doStripeWebhook(e) {

  const event =
    JSON.parse(
      e.postData.contents
    );


  if (
    event.type ===
    'checkout.session.completed'
  ) {

    confirm_(
      event.data.object
    );
  }


  return out_({
    received: true
  });
}


/* =========================================================
   CONFIRM BOOKING
========================================================= */

function confirm_(session) {

  const id =
    session.metadata &&
    session.metadata.booking_id;


  if (!id) {
    return;
  }


  const sh =
    SpreadsheetApp
      .openById(SPREADSHEET_ID)
      .getSheetByName(BOOK);


  const values =
    sh
      .getDataRange()
      .getValues();


  const headers =
    values[0];


  const bookingIndex =
    headers.indexOf(
      'booking_id'
    );

  const statusIndex =
    headers.indexOf(
      'status'
    );

  const paymentIndex =
    headers.indexOf(
      'payment_intent'
    );


  for (
    let r = 1;
    r < values.length;
    r++
  ) {

    if (
      values[r][bookingIndex] ===
      id
    ) {

      if (
        values[r][statusIndex] ===
        'CONFIRMED'
      ) {

        return;
      }


      sh
        .getRange(
          r + 1,
          statusIndex + 1
        )
        .setValue(
          'CONFIRMED'
        );


      sh
        .getRange(
          r + 1,
          paymentIndex + 1
        )
        .setValue(
          session.payment_intent || ''
        );


      createCalendar_(
        values[r],
        headers,
        id
      );


      createRecords_(
        values[r],
        headers
      );


      return;
    }
  }
}


/* =========================================================
   GOOGLE CALENDAR
========================================================= */

function createCalendar_(
  row,
  headers,
  id
) {

  const get =
    key =>
      row[
        headers.indexOf(key)
      ];


  const start =
    new Date(
      get('date') +
      'T' +
      get('time') +
      ':00+07:00'
    );


  const end =
    new Date(
      start.getTime() +
      Number(
        get('hours')
      ) *
      3600000
    );


  const pets =
    JSON.parse(
      get('pets_json') || '[]'
    );


  const title =
    'Lunessa • ' +
    get('owner') +
    ' • ' +
    pets
      .map(
        x => x.name
      )
      .join(', ');


  const desc =
    'Booking ID: ' +
    id +
    '\nOwner: ' +
    get('owner') +
    '\nPhone: ' +
    get('phone') +
    '\n' +
    pets
      .map(
        x =>
          x.name +
          ' — ' +
          label_(x.service)
      )
      .join('\n') +
    '\nDeposit: ฿' +
    get('deposit');


  const ev =
    CalendarApp
      .getDefaultCalendar()
      .createEvent(
        title,
        start,
        end,
        {
          description: desc
        }
      );


  const sh =
    SpreadsheetApp
      .openById(SPREADSHEET_ID)
      .getSheetByName(BOOK);


  const values =
    sh
      .getDataRange()
      .getValues();


  const hh =
    values[0];


  const bookingIndex =
    hh.indexOf(
      'booking_id'
    );

  const eventIndex =
    hh.indexOf(
      'calendar_event_id'
    );


  for (
    let r = 1;
    r < values.length;
    r++
  ) {

    if (
      values[r][bookingIndex] ===
      id
    ) {

      sh
        .getRange(
          r + 1,
          eventIndex + 1
        )
        .setValue(
          ev.getId()
        );

      break;
    }
  }
}


/* =========================================================
   CREATE CUSTOMER / PET RECORDS
========================================================= */

function createRecords_(
  row,
  headers
) {

  const ss =
    SpreadsheetApp
      .openById(
        SPREADSHEET_ID
      );


  const cs =
    ss.getSheetByName(
      CUST
    );


  const ps =
    ss.getSheetByName(
      PET
    );


  const get =
    key =>
      row[
        headers.indexOf(key)
      ];


  const cid =
    'C-' +
    Utilities
      .getUuid()
      .slice(0, 8)
      .toUpperCase();


  cs.appendRow([
    cid,
    new Date(),
    get('owner'),
    get('phone')
  ]);


  JSON.parse(
    get('pets_json') || '[]'
  ).forEach(
    p => {

      ps.appendRow([

        'P-' +
        Utilities
          .getUuid()
          .slice(0, 8)
          .toUpperCase(),

        cid,

        p.name,

        p.type,

        p.service,

        new Date()

      ]);
    }
  );
}


/* =========================================================
   SERVICE LABEL
========================================================= */

function label_(s) {

  return {

    bath:
      'อาบน้ำ',

    clip:
      'อาบน้ำ + ตัดไถ',

    scissor:
      'อาบน้ำ + ตัดกรรไกร',

    haircut_only:
      'ตัดขนอย่างเดียว',

    addon:
      'บริการเสริมอย่างเดียว'

  }[s] || s;
}


/* =========================================================
   DATE HELPERS
========================================================= */

function normalizeDate_(value) {

  if (!value) {
    return '';
  }


  /*
    ถ้าเป็น Date object
  */

  if (
    Object.prototype.toString.call(value) ===
    '[object Date]'
  ) {

    return Utilities.formatDate(
      value,
      TZ,
      'yyyy-MM-dd'
    );
  }


  const str =
    String(value).trim();


  /*
    yyyy-MM-dd
  */

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(str)
  ) {

    return str;
  }


  /*
    yyyy/MM/dd
  */

  if (
    /^\d{4}\/\d{2}\/\d{2}$/.test(str)
  ) {

    return str.replace(
      /\//g,
      '-'
    );
  }


  return str;
}


/* =========================================================
   SHEET DATE -> yyyy-MM-dd
========================================================= */

function sheetDateToString_(value) {

  if (!value) {
    return '';
  }


  /*
    Google Sheets Date object
  */

  if (
    Object.prototype.toString.call(value) ===
    '[object Date]'
  ) {

    return Utilities.formatDate(
      value,
      TZ,
      'yyyy-MM-dd'
    );
  }


  return normalizeDate_(
    value
  );
}


/* =========================================================
   TIME HELPERS
========================================================= */

function normalizeTime_(value) {

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {

    return '';
  }


  /*
    ถ้าเป็น Date object
    ใช้ HH:mm
  */

  if (
    Object.prototype.toString.call(value) ===
    '[object Date]'
  ) {

    return Utilities.formatDate(
      value,
      TZ,
      'HH:mm'
    );
  }


  const str =
    String(value).trim();


  /*
    10:00
  */

  if (
    /^\d{1,2}:\d{2}$/.test(str)
  ) {

    const parts =
      str.split(':');

    return (
      String(
        Number(parts[0])
      ).padStart(2, '0') +
      ':' +
      parts[1]
    );
  }


  /*
    10:00:00
  */

  if (
    /^\d{1,2}:\d{2}:\d{2}$/.test(str)
  ) {

    const parts =
      str.split(':');

    return (
      String(
        Number(parts[0])
      ).padStart(2, '0') +
      ':' +
      parts[1]
    );
  }


  return str;
}


/* =========================================================
   JSON OUTPUT
========================================================= */

function out_(x) {

  return ContentService
    .createTextOutput(
      JSON.stringify(x)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}


/* =========================================================
   INTERNAL SETUP
========================================================= */

function setup_() {
  setup();
}
