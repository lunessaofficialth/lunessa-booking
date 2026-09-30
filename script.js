/*************************************************
 * LUNESSA PET BOUTIQUE
 * FRONTEND BOOKING ENGINE v1.1
 *
 * UI / LANGUAGE UPDATE ONLY
 * PAYMENT & BOOKING FLOW PRESERVED
 *************************************************/


/*************************************************
 * API
 *************************************************/

const API_URL =
  'https://script.google.com/macros/s/AKfycbxDEYq9veZKBkjdiQT_mX3YPuFAbWx0lgXCN6RTCBfwWJuBUztLJxfBfkJtbzYP6H7Oig/exec';


/*************************************************
 * LANGUAGE
 *************************************************/

let currentLang =
  localStorage.getItem('lunessaBookingLang') || 'th';


const I18N = {

  th: {

    backHome: '← กลับหน้าหลัก',

    progressPets: 'น้อง',
    progressDetails: 'ข้อมูล',
    progressDate: 'วันเวลา',
    progressPayment: 'ยืนยัน',

    step01: 'STEP 01',
    step02: 'STEP 02',
    step03: 'STEP 03',
    step04: 'STEP 04',

    petHeading: 'เล่าให้เรารู้จักน้อง',
    petDescription: 'สามารถจองได้สูงสุด 2 น้องต่อหนึ่งการจอง',

    addPet: 'เพิ่มน้องอีกตัว',

    estimatedTime: 'ระยะเวลาโดยประมาณ',
    deposit: 'มัดจำ',

    continue: 'ดำเนินการต่อ',
    back: 'ย้อนกลับ',

    detailsHeading: 'ข้อมูลสำหรับการจอง',
    detailsDescription:
      'ข้อมูลนี้ใช้สำหรับยืนยันและติดต่อเกี่ยวกับนัดหมายของคุณ',

    ownerName: 'ชื่อเจ้าของ',
    ownerPlaceholder: 'ชื่อของคุณ',
    phoneNumber: 'เบอร์โทรศัพท์',

    appointmentSummary: 'สรุปการจอง',

    chooseDate: 'เลือกวันและเวลา',

    dateHeading: 'เลือกวันและเวลานัดหมาย',
    dateDescription:
      'ระบบจะแสดงเฉพาะช่วงเวลาที่สามารถจองได้',

    date: 'วันที่',
    availableTimes: 'เวลาที่ว่าง',

    continueConfirm: 'ตรวจสอบการจอง',

    confirmHeading: 'ตรวจสอบและยืนยันการจอง',
    confirmDescription:
      'กรุณาตรวจสอบรายละเอียดก่อนชำระมัดจำ',

    lateTitle: 'เรื่องเวลาเข้ารับบริการ',

    latePolicy:
      'ทางร้านขอสงวนเวลาให้กับน้องทุกคิวอย่างเต็มที่ หากมาสาย สามารถเลทได้ไม่เกิน 15 นาที หากเกินเวลาที่กำหนด มัดจำจะถูกหักโดยอัตโนมัติ',

    emergencyPolicy:
      'หากเกิดเหตุฉุกเฉินหรือมีเหตุจำเป็นระหว่างเดินทาง กรุณาติดต่อช่างทาง LINE โดยเร็วที่สุด เพื่อให้ทางร้านช่วยดูแลคิวให้เหมาะสม',

    depositRequired: 'มัดจำเพื่อยืนยันคิว',

    depositDescription:
      'คิวของคุณจะได้รับการยืนยันหลังจากชำระมัดจำสำเร็จ',

    payDeposit: 'ชำระมัดจำ',

    bookingConfirmed: 'BOOKING CONFIRMED',
    successHeading: 'จองคิวเรียบร้อยแล้ว',

    successDescription:
      'ขอบคุณที่ไว้วางใจ Lunessa Pet Boutique',

    paymentCancelled: 'PAYMENT CANCELLED',
    cancelHeading: 'การชำระเงินถูกยกเลิก',

    cancelDescription:
      'คิวของคุณยังไม่ได้รับการยืนยัน',

    returnBooking: 'กลับไปหน้าจอง',

    footerTagline: 'GROOMING • CARE • LOVE',

    firstPet: 'น้องตัวแรก',
    secondPet: 'น้องตัวที่สอง',

    petName: 'ชื่อน้อง',
    petNamePlaceholder: 'ชื่อของน้อง',

    petType: 'ประเภทน้อง',
    dog: 'สุนัข',
    cat: 'แมว',

    service: 'บริการ',

    caution: 'ข้อควรระวัง / สิ่งที่ช่างควรรู้',
    cautionPlaceholder:
      'เช่น กลัวน้ำ, กลัวไดร์, ไม่ชอบจับเท้า',

    cautionHelp:
      'แจ้งรายละเอียดเล็ก ๆ น้อย ๆ ที่จะช่วยให้ช่างดูแลน้องได้อย่างเหมาะสม',

    cautionPolicy:
      'เพื่อความปลอดภัยของน้องและช่าง ทางร้านขอสงวนสิทธิ์ไม่รับน้องที่มีพฤติกรรมดุ กัด ตบ หรือมีความกลัว/ความเครียดรุนแรงจนไม่สามารถทำบริการได้ หากไม่แน่ใจว่าน้องเหมาะกับการเข้ารับบริการ สามารถติดต่อทาง LINE เพื่อให้ช่างช่วยประเมินน้องก่อนจองคิว',

    remove: 'ลบ',

    totalTime: 'ระยะเวลารวม',
    hours: 'ชั่วโมง',
    hour: 'ชั่วโมง',

    owner: 'เจ้าของ',
    phone: 'เบอร์โทรศัพท์',
    duration: 'ระยะเวลา',
    bookingDate: 'วันที่',
    bookingTime: 'เวลา',

    checking: 'กำลังตรวจสอบ...',
    noSlots:
      'วันนี้ไม่มีเวลาว่างสำหรับบริการที่เลือก',

    loadError:
      'ไม่สามารถโหลดเวลาว่างได้ กรุณาลองใหม่อีกครั้ง',

    selectDateTime:
      'กรุณาเลือกวันและเวลา',

    ownerRequired:
      'กรุณากรอกชื่อเจ้าของ',

    phoneRequired:
      'กรุณากรอกเบอร์โทรศัพท์',

    petNameRequired:
      'กรุณากรอกชื่อน้องให้ครบ',

    serviceError:
      'ไม่สามารถคำนวณบริการได้',

    preparingPayment:
      'กำลังเตรียมการชำระเงิน...',

    paymentError:
      'เกิดข้อผิดพลาด กรุณาลองใหม่',

    bookingId: 'หมายเลขการจอง',

    verifyingPayment:
      'กำลังตรวจสอบการชำระเงิน',

    verifyingDescription:
      'ได้รับข้อมูลการชำระเงินแล้ว และกำลังยืนยันการจองของคุณ'

  },


  en: {

    backHome: '← Back to Home',

    progressPets: 'Pets',
    progressDetails: 'Details',
    progressDate: 'Date',
    progressPayment: 'Confirm',

    step01: 'STEP 01',
    step02: 'STEP 02',
    step03: 'STEP 03',
    step04: 'STEP 04',

    petHeading: 'Tell us about your pet',
    petDescription: 'You can book up to 2 pets per appointment.',

    addPet: 'Add another pet',

    estimatedTime: 'Estimated time',
    deposit: 'Deposit',

    continue: 'Continue',
    back: 'Back',

    detailsHeading: 'Your details',
    detailsDescription:
      'We need these details to confirm and contact you about your appointment.',

    ownerName: 'Owner name',
    ownerPlaceholder: 'Your name',
    phoneNumber: 'Phone number',

    appointmentSummary: 'Appointment summary',

    chooseDate: 'Choose date & time',

    dateHeading: 'Choose your appointment',
    dateDescription:
      'Only available start times are shown.',

    date: 'Date',
    availableTimes: 'Available times',

    continueConfirm: 'Review booking',

    confirmHeading: 'Review & confirm your booking',
    confirmDescription:
      'Please review your appointment before paying the deposit.',

    lateTitle: 'Arrival time',

    latePolicy:
      'We kindly reserve each appointment especially for your pet. A grace period of up to 15 minutes is allowed. Arrivals more than 15 minutes late may result in the deposit being automatically forfeited.',

    emergencyPolicy:
      'If an emergency or unexpected delay occurs, please contact our groomer via LINE as soon as possible so we can help manage your appointment.',

    depositRequired: 'Deposit required to confirm',

    depositDescription:
      'Your appointment will be confirmed after successful payment.',

    payDeposit: 'Pay deposit',

    bookingConfirmed: 'BOOKING CONFIRMED',
    successHeading: 'Your appointment is confirmed',

    successDescription:
      'Thank you for booking with Lunessa Pet Boutique.',

    paymentCancelled: 'PAYMENT CANCELLED',
    cancelHeading: 'Your payment was cancelled',

    cancelDescription:
      'Your appointment has not been confirmed.',

    returnBooking: 'Return to booking',

    footerTagline: 'GROOMING • CARE • LOVE',

    firstPet: 'First pet',
    secondPet: 'Second pet',

    petName: 'Pet name',
    petNamePlaceholder: 'Pet name',

    petType: 'Pet type',
    dog: 'Dog',
    cat: 'Cat',

    service: 'Service',

    caution: 'Special care notes',
    cautionPlaceholder:
      'e.g. afraid of water, afraid of dryer, dislikes paw handling',

    cautionHelp:
      'A little information helps our groomer care for your pet more comfortably.',

    cautionPolicy:
      'For the safety and comfort of both pets and our groomers, we reserve the right to decline pets that display aggressive behaviour such as biting or scratching, or pets experiencing severe fear or stress that makes grooming unsafe. If you are unsure, please contact us via LINE so our groomer can assess your pet before booking.',

    remove: 'Remove',

    totalTime: 'Total time',
    hours: 'hours',
    hour: 'hour',

    owner: 'Owner',
    phone: 'Phone',
    duration: 'Duration',
    bookingDate: 'Date',
    bookingTime: 'Time',

    checking: 'Checking...',
    noSlots:
      'No available times for the selected service today.',

    loadError:
      'Unable to load available times. Please try again.',

    selectDateTime:
      'Please select a date and time.',

    ownerRequired:
      'Please enter the owner name.',

    phoneRequired:
      'Please enter your phone number.',

    petNameRequired:
      'Please enter all pet names.',

    serviceError:
      'Unable to calculate the selected service.',

    preparingPayment:
      'Preparing payment...',

    paymentError:
      'Something went wrong. Please try again.',

    bookingId: 'Booking ID',

    verifyingPayment:
      'Payment is being verified',

    verifyingDescription:
      'Your payment was received and your booking is being confirmed.'

  },


  zh: {

    backHome: '← 返回首页',

    progressPets: '宠物',
    progressDetails: '资料',
    progressDate: '日期',
    progressPayment: '确认',

    step01: 'STEP 01',
    step02: 'STEP 02',
    step03: 'STEP 03',
    step04: 'STEP 04',

    petHeading: '告诉我们关于宠物的信息',
    petDescription: '每次预约最多可预约 2 只宠物。',

    addPet: '添加另一只宠物',

    estimatedTime: '预计时间',
    deposit: '订金',

    continue: '继续',
    back: '返回',

    detailsHeading: '您的资料',
    detailsDescription:
      '这些资料将用于确认预约及与您联系。',

    ownerName: '主人姓名',
    ownerPlaceholder: '您的姓名',
    phoneNumber: '电话号码',

    appointmentSummary: '预约摘要',

    chooseDate: '选择日期和时间',

    dateHeading: '选择预约日期和时间',
    dateDescription:
      '系统只会显示可预约的时间。',

    date: '日期',
    availableTimes: '可预约时间',

    continueConfirm: '查看预约',

    confirmHeading: '确认预约',
    confirmDescription:
      '付款前请确认您的预约资料。',

    lateTitle: '到店时间',

    latePolicy:
      '我们会为每位宠物保留专属预约时间。最多可迟到 15 分钟；如超过 15 分钟，订金可能会自动扣除。',

    emergencyPolicy:
      '如遇突发情况或意外延误，请尽快通过 LINE 联系美容师，以便我们协助安排您的预约。',

    depositRequired: '支付订金以确认预约',

    depositDescription:
      '成功支付订金后，您的预约才会正式确认。',

    payDeposit: '支付订金',

    bookingConfirmed: 'BOOKING CONFIRMED',
    successHeading: '预约已确认',

    successDescription:
      '感谢您选择 Lunessa Pet Boutique。',

    paymentCancelled: 'PAYMENT CANCELLED',
    cancelHeading: '付款已取消',

    cancelDescription:
      '您的预约尚未确认。',

    returnBooking: '返回预约',

    footerTagline: 'GROOMING • CARE • LOVE',

    firstPet: '第一只宠物',
    secondPet: '第二只宠物',

    petName: '宠物名字',
    petNamePlaceholder: '宠物名字',

    petType: '宠物类型',
    dog: '狗狗',
    cat: '猫咪',

    service: '服务',

    caution: '特别注意事项',
    cautionPlaceholder:
      '例如：怕水、怕吹风机、不喜欢碰脚',

    cautionHelp:
      '提供这些小信息，可以帮助美容师更温柔地照顾您的宠物。',

    cautionPolicy:
      '为了宠物及美容师的安全与舒适，我们保留拒绝具有攻击行为，例如咬人、抓人，或因严重害怕及压力而无法安全进行美容的宠物的权利。如果您不确定宠物是否适合美容，欢迎先通过 LINE 联系我们，让美容师在预约前协助评估。',

    remove: '删除',

    totalTime: '总时间',
    hours: '小时',
    hour: '小时',

    owner: '主人',
    phone: '电话号码',
    duration: '服务时间',
    bookingDate: '日期',
    bookingTime: '时间',

    checking: '检查中...',
    noSlots:
      '今天没有符合所选服务的可预约时间。',

    loadError:
      '无法加载可预约时间，请稍后再试。',

    selectDateTime:
      '请选择日期和时间。',

    ownerRequired:
      '请输入主人姓名。',

    phoneRequired:
      '请输入电话号码。',

    petNameRequired:
      '请填写所有宠物名字。',

    serviceError:
      '无法计算所选服务。',

    preparingPayment:
      '正在准备付款...',

    paymentError:
      '发生错误，请再试一次。',

    bookingId: '预约编号',

    verifyingPayment:
      '正在确认付款',

    verifyingDescription:
      '我们已收到您的付款信息，正在确认预约。'

  }

};


/*************************************************
 * SERVICES
 *
 * UNCHANGED
 *************************************************/

const SERVICES = {

  bath: {
    label: 'อาบน้ำ',
    hours: 2,
    deposit: 200
  },

  clip: {
    label: 'อาบน้ำ + ตัดไถ',
    hours: 3,
    deposit: 400
  },

  scissor: {
    label: 'อาบน้ำ + ตัดกรรไกร',
    hours: 3,
    deposit: 400
  },

  haircut_only: {
    label: 'ตัดขนอย่างเดียว',
    hours: 2,
    deposit: 400
  },

  addon: {
    label: 'บริการเสริมอย่างเดียว',
    hours: 1,
    deposit: 200
  }

};


/*************************************************
 * SERVICE TRANSLATIONS
 *************************************************/

const SERVICE_TRANSLATIONS = {

  bath: {
    th: 'อาบน้ำ',
    en: 'Bath',
    zh: '洗澡'
  },

  clip: {
    th: 'อาบน้ำ + ตัดไถ',
    en: 'Bath + Clipper Grooming',
    zh: '洗澡 + 电剪修剪'
  },

  scissor: {
    th: 'อาบน้ำ + ตัดกรรไกร',
    en: 'Bath + Scissor Grooming',
    zh: '洗澡 + 剪刀修剪'
  },

  haircut_only: {
    th: 'ตัดขนอย่างเดียว',
    en: 'Haircut Only',
    zh: '只剪毛'
  },

  addon: {
    th: 'บริการเสริมอย่างเดียว',
    en: 'Add-on Service',
    zh: '附加服务'
  }

};


/*************************************************
 * STATE
 *
 * BOOKING STRUCTURE PRESERVED
 *************************************************/

const state = {

  pets: [],

  owner: '',

  phone: '',

  date: '',

  time: '',

  hours: 0,

  deposit: 0

};


/*************************************************
 * DOM
 *************************************************/

const petsContainer =
  document.getElementById('pets-container');

const addPetButton =
  document.getElementById('add-pet');

const ownerInput =
  document.getElementById('owner');

const phoneInput =
  document.getElementById('phone');

const dateInput =
  document.getElementById('booking-date');

const timeSlots =
  document.getElementById('time-slots');

const loadingTimes =
  document.getElementById('loading-times');

const slotMessage =
  document.getElementById('slot-message');

const nextPayment =
  document.getElementById('next-payment');

const payDeposit =
  document.getElementById('pay-deposit');


/*************************************************
 * INIT
 *************************************************/

document.addEventListener(
  'DOMContentLoaded',
  init
);


function init() {

  applyLanguage();

  handlePaymentReturn();

  setMinimumDate();

  addPet();

  addEventListeners();

}


/*************************************************
 * LANGUAGE FUNCTIONS
 *************************************************/

function t(key) {

  return (
    I18N[currentLang]?.[key] ||
    I18N.th[key] ||
    key
  );

}


function applyLanguage() {

  document.documentElement.lang =
    currentLang;


  document
    .querySelectorAll('[data-i18n]')
    .forEach(function(element) {

      const key =
        element.dataset.i18n;

      if (
        I18N[currentLang] &&
        I18N[currentLang][key]
      ) {

        element.textContent =
          I18N[currentLang][key];

      }

    });


  document
    .querySelectorAll('[data-placeholder]')
    .forEach(function(element) {

      const key =
        element.dataset.placeholder;

      element.placeholder =
        t(key);

    });


  document
    .querySelectorAll('.lang-button')
    .forEach(function(button) {

      button.classList.toggle(
        'active',
        button.dataset.lang === currentLang
      );

    });


  updateSummary();

  if (
    state.pets.length
  ) {

    renderPets();

  }


  if (
    state.date &&
    state.time
  ) {

    renderFinalSummary();

  }

}


/*************************************************
 * LANGUAGE BUTTONS
 *************************************************/

function changeLanguage(lang) {

  if (
    !I18N[lang]
  ) {

    return;

  }


  currentLang =
    lang;


  localStorage.setItem(
    'lunessaBookingLang',
    lang
  );


  applyLanguage();

}


document
  .querySelectorAll('.lang-button')
  .forEach(function(button) {

    button.addEventListener(
      'click',
      function() {

        changeLanguage(
          button.dataset.lang
        );

      }
    );

  });


/*************************************************
 * EVENT LISTENERS
 *************************************************/

function addEventListeners() {

  addPetButton.addEventListener(
    'click',
    function() {

      if (
        state.pets.length >= 2
      ) {

        return;

      }

      addPet();

    }
  );


  document
    .getElementById('next-details')
    .addEventListener(
      'click',
      goToDetails
    );


  document
    .getElementById('next-date')
    .addEventListener(
      'click',
      goToDate
    );


  nextPayment.addEventListener(
    'click',
    goToPayment
  );


  payDeposit.addEventListener(
    'click',
    createCheckout
  );


  dateInput.addEventListener(
    'change',
    function() {

      state.date =
        dateInput.value;

      state.time = '';

      nextPayment.disabled =
        true;

      loadAvailableTimes();

    }
  );


  document
    .querySelectorAll('[data-back]')
    .forEach(function(button) {

      button.addEventListener(
        'click',
        function() {

          showStep(
            Number(
              button.dataset.back
            )
          );

        }
      );

    });


  document
    .getElementById('return-booking')
    .addEventListener(
      'click',
      function() {

        window.location.href =
          window.location.pathname;

      }
    );

}


/*************************************************
 * PET MANAGEMENT
 *************************************************/

function addPet() {

  if (
    state.pets.length >= 2
  ) {

    return;

  }


  state.pets.push({

    name: '',

    type: 'dog',

    service: 'bath',

    caution: ''

  });


  renderPets();

  updateSummary();

}


function removePet(index) {

  if (
    state.pets.length <= 1
  ) {

    return;

  }


  state.pets.splice(
    index,
    1
  );


  renderPets();

  updateSummary();

}


function renderPets() {

  petsContainer.innerHTML = '';


  state.pets.forEach(
    function(pet, index) {

      const card =
        document.createElement('div');


      card.className =
        'pet-card';


      card.innerHTML = `

        <div class="pet-card-header">

          <div>

            <span class="pet-number">
              PET ${index + 1}
            </span>

            <h3>
              ${
                index === 0
                  ? t('firstPet')
                  : t('secondPet')
              }
            </h3>

          </div>

          ${
            state.pets.length > 1
              ? `
                <button
                  type="button"
                  class="remove-pet"
                  data-remove="${index}"
                >
                  ${t('remove')}
                </button>
              `
              : ''
          }

        </div>


        <label>

          ${t('petName')}

          <input
            type="text"
            class="pet-name"
            data-index="${index}"
            value="${escapeHtml(pet.name)}"
            placeholder="${t('petNamePlaceholder')}"
          >

        </label>


        <label>

          ${t('petType')}

          <select
            class="pet-type"
            data-index="${index}"
          >

            <option
              value="dog"
              ${
                pet.type === 'dog'
                  ? 'selected'
                  : ''
              }
            >
              ${t('dog')}
            </option>

            <option
              value="cat"
              ${
                pet.type === 'cat'
                  ? 'selected'
                  : ''
              }
            >
              ${t('cat')}
            </option>

          </select>

        </label>


        <label>

          ${t('service')}

          <select
            class="pet-service"
            data-index="${index}"
          >

            ${renderServiceOptions(
              pet.service
            )}

          </select>

        </label>


        <label>

          ${t('caution')}

          <textarea
            class="pet-caution"
            data-index="${index}"
            placeholder="${t('cautionPlaceholder')}"
          >${escapeHtml(pet.caution)}</textarea>

          <p class="field-help">
            ${t('cautionHelp')}
          </p>

        </label>


        <div class="caution-note">

          <p>
            <strong>* ${t('caution')}</strong><br>
            ${t('cautionPolicy')}
          </p>

        </div>

      `;


      petsContainer.appendChild(card);

    }
  );


  document
    .querySelectorAll('.pet-name')
    .forEach(function(input) {

      input.addEventListener(
        'input',
        function() {

          state.pets[
            Number(
              input.dataset.index
            )
          ].name =
            input.value;

          updateSummary();

        }
      );

    });


  document
    .querySelectorAll('.pet-type')
    .forEach(function(select) {

      select.addEventListener(
        'change',
        function() {

          state.pets[
            Number(
              select.dataset.index
            )
          ].type =
            select.value;

        }
      );

    });


  document
    .querySelectorAll('.pet-service')
    .forEach(function(select) {

      select.addEventListener(
        'change',
        function() {

          state.pets[
            Number(
              select.dataset.index
            )
          ].service =
            select.value;

          updateSummary();

        }
      );

    });


  document
    .querySelectorAll('.pet-caution')
    .forEach(function(input) {

      input.addEventListener(
        'input',
        function() {

          state.pets[
            Number(
              input.dataset.index
            )
          ].caution =
            input.value;

        }
      );

    });


  document
    .querySelectorAll('.remove-pet')
    .forEach(function(button) {

      button.addEventListener(
        'click',
        function() {

          removePet(
            Number(
              button.dataset.remove
            )
          );

        }
      );

    });


  addPetButton.style.display =
    state.pets.length >= 2
      ? 'none'
      : 'block';

}


/*************************************************
 * SERVICE OPTIONS
 *************************************************/

function renderServiceOptions(
  selected
) {

  return Object.keys(SERVICES)
    .map(function(key) {

      return `
        <option
          value="${key}"
          ${
            selected === key
              ? 'selected'
              : ''
          }
        >
          ${
            SERVICE_TRANSLATIONS[key]?.[currentLang] ||
            SERVICES[key].label
          }
        </option>
      `;

    })
    .join('');

}


/*************************************************
 * DURATION ENGINE
 *
 * UNCHANGED
 *************************************************/

function calculateHours() {

  if (
    state.pets.length === 0
  ) {

    return 0;

  }


  if (
    state.pets.length === 1
  ) {

    return SERVICES[
      state.pets[0].service
    ].hours;

  }


  const services =
    state.pets
      .map(function(pet) {

        return pet.service;

      })
      .sort();


  const key =
    services.join('+');


  const combinations = {

    'addon+addon': 1,

    'addon+bath': 2,

    'addon+haircut_only': 3,

    'addon+clip': 4,

    'addon+scissor': 4,

    'bath+bath': 3,

    'bath+haircut_only': 3,

    'bath+clip': 4,

    'bath+scissor': 4,

    'haircut_only+haircut_only': 3,

    'haircut_only+clip': 4,

    'haircut_only+scissor': 4,

    'clip+clip': 4,

    'clip+scissor': 4,

    'scissor+scissor': 4

  };


  return combinations[key] || 0;

}


/*************************************************
 * DEPOSIT
 *
 * UNCHANGED
 *************************************************/

function calculateDeposit() {

  return state.pets.reduce(
    function(total, pet) {

      return (
        total +
        SERVICES[
          pet.service
        ].deposit
      );

    },
    0
  );

}


/*************************************************
 * SUMMARY
 *************************************************/

function updateSummary() {

  state.hours =
    calculateHours();

  state.deposit =
    calculateDeposit();


  document
    .getElementById('summary-hours')
    .textContent =
    state.hours +
    ' ' +
    (
      state.hours === 1
        ? t('hour')
        : t('hours')
    );


  document
    .getElementById('summary-deposit')
    .textContent =
    formatMoney(
      state.deposit
    );

}


/*************************************************
 * STEP 1
 *************************************************/

function goToDetails() {

  const valid =
    validatePets();


  if (!valid) {
    return;
  }


  showStep(2);

  renderDetailsSummary();

}


/*************************************************
 * VALIDATE PETS
 *************************************************/

function validatePets() {

  for (
    let i = 0;
    i < state.pets.length;
    i++
  ) {

    const pet =
      state.pets[i];


    if (
      !pet.name.trim()
    ) {

      alert(
        t('petNameRequired')
      );

      return false;

    }

  }


  state.hours =
    calculateHours();

  state.deposit =
    calculateDeposit();


  if (
    !state.hours ||
    !state.deposit
  ) {

    alert(
      t('serviceError')
    );

    return false;

  }


  return true;

}


/*************************************************
 * STEP 2
 *************************************************/

function goToDate() {

  const owner =
    ownerInput.value.trim();

  const phone =
    phoneInput.value.trim();


  if (!owner) {

    alert(
      t('ownerRequired')
    );

    ownerInput.focus();

    return;

  }


  if (!phone) {

    alert(
      t('phoneRequired')
    );

    phoneInput.focus();

    return;

  }


  state.owner =
    owner;

  state.phone =
    phone;


  showStep(3);

}


/*************************************************
 * DATE
 *************************************************/

function setMinimumDate() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, '0');

  const day =
    String(
      now.getDate()
    ).padStart(2, '0');


  dateInput.min =
    `${year}-${month}-${day}`;

}


/*************************************************
 * LOAD AVAILABLE TIMES
 *
 * UNCHANGED BOOKING API
 *************************************************/

async function loadAvailableTimes() {

  if (!state.date) {
    return;
  }


  timeSlots.innerHTML = '';

  slotMessage.textContent = '';

  loadingTimes.textContent =
    t('checking');


  nextPayment.disabled =
    true;


  try {

    const url =
      API_URL +
      '?action=slots' +
      '&date=' +
      encodeURIComponent(
        state.date
      ) +
      '&hours=' +
      encodeURIComponent(
        state.hours
      );


    const response =
      await fetch(url);


    const data =
      await response.json();


    if (!data.ok) {

      throw new Error(
        data.message ||
        t('loadError')
      );

    }


    renderAvailableTimes(
      data.slots
    );


  } catch (error) {

    console.error(error);

    slotMessage.textContent =
      t('loadError');

  } finally {

    loadingTimes.textContent =
      '';

  }

}


/*************************************************
 * RENDER TIMES
 *************************************************/

function renderAvailableTimes(
  slots
) {

  timeSlots.innerHTML = '';


  const available =
    Object.keys(slots)
      .filter(function(time) {

        return slots[time] === true;

      });


  if (
    available.length === 0
  ) {

    slotMessage.textContent =
      t('noSlots');

    return;

  }


  available.forEach(
    function(time) {

      const button =
        document.createElement(
          'button'
        );


      button.type =
        'button';


      button.className =
        'time-button';


      button.textContent =
        time;


      button.addEventListener(
        'click',
        function() {

          selectTime(
            time,
            button
          );

        }
      );


      timeSlots.appendChild(
        button
      );

    }
  );

}


/*************************************************
 * SELECT TIME
 *************************************************/

function selectTime(
  time,
  button
) {

  document
    .querySelectorAll('.time-button')
    .forEach(function(item) {

      item.classList.remove(
        'selected'
      );

    });


  button.classList.add(
    'selected'
  );


  state.time =
    time;


  nextPayment.disabled =
    false;

}


/*************************************************
 * STEP 3 → 4
 *************************************************/

function goToPayment() {

  if (
    !state.date ||
    !state.time
  ) {

    alert(
      t('selectDateTime')
    );

    return;

  }


  renderFinalSummary();

  showStep(4);

}


/*************************************************
 * CREATE CHECKOUT
 *
 * PAYMENT FLOW PRESERVED
 *************************************************/

async function createCheckout() {

  payDeposit.disabled =
    true;


  payDeposit.textContent =
    t('preparingPayment');


  const errorBox =
    document.getElementById(
      'checkout-error'
    );


  errorBox.textContent =
    '';


  const payload = {

    action:
      'createCheckout',

    owner:
      state.owner,

    phone:
      state.phone,

    date:
      state.date,

    time:
      state.time,

    hours:
      state.hours,

    deposit:
      state.deposit,

    pets:
      state.pets

  };


  try {

    const response =
      await fetch(
        API_URL,
        {

          method: 'POST',

          headers: {
            'Content-Type':
              'text/plain;charset=utf-8'
          },

          body:
            JSON.stringify(
              payload
            )

        }
      );


    const data =
      await response.json();


    if (!data.ok) {

      throw new Error(
        data.message ||
        t('paymentError')
      );

    }


    if (!data.checkoutUrl) {

      throw new Error(
        'Stripe checkout URL ไม่ถูกต้อง'
      );

    }


    window.location.href =
      data.checkoutUrl;


  } catch (error) {

    console.error(error);

    errorBox.textContent =
      error.message ||
      t('paymentError');


    payDeposit.disabled =
      false;


    payDeposit.textContent =
      t('payDeposit');

  }

}


/*************************************************
 * PAYMENT RETURN
 *
 * UNCHANGED FLOW
 *************************************************/

async function handlePaymentReturn() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const paid =
    params.get('paid');

  const cancelled =
    params.get('cancelled');

  const sessionId =
    params.get('session_id');


  if (
    cancelled === '1'
  ) {

    hideAllMainSteps();

    document
      .getElementById('cancelled')
      .classList.add('active');

    return;

  }


  if (
    paid === '1' &&
    sessionId
  ) {

    hideAllMainSteps();


    const success =
      document.getElementById(
        'success'
      );


    success.classList.add(
      'active'
    );


    try {

      const response =
        await fetch(
          API_URL +
          '?action=confirmCheckout' +
          '&session_id=' +
          encodeURIComponent(
            sessionId
          )
        );


      const data =
        await response.json();


      if (
        data.ok &&
        data.paid
      ) {

        document
          .getElementById(
            'success-details'
          )
          .innerHTML = `

            <div>

              <span>
                ${t('bookingId')}
              </span>

              <strong>
                ${escapeHtml(
                  data.bookingId || ''
                )}
              </strong>

            </div>

          `;

      } else {

        success.querySelector(
          'h2'
        ).textContent =
          t('verifyingPayment');

        success.querySelector(
          'p'
        ).textContent =
          t('verifyingDescription');

      }


    } catch (error) {

      console.error(error);

    }

  }

}


/*************************************************
 * RENDER SUMMARIES
 *************************************************/

function renderDetailsSummary() {

  const container =
    document.getElementById(
      'details-summary'
    );


  container.innerHTML =
    state.pets
      .map(function(pet) {

        return `
          <div class="summary-row">

            <span>
              ${escapeHtml(
                pet.name
              )}
            </span>

            <strong>
              ${
                SERVICE_TRANSLATIONS[
                  pet.service
                ]?.[currentLang] ||
                SERVICES[
                  pet.service
                ].label
              }
            </strong>

          </div>
        `;

      })
      .join('') +

      `
        <div class="summary-total">

          <span>
            ${t('totalTime')}
          </span>

          <strong>
            ${state.hours}
            ${
              state.hours === 1
                ? t('hour')
                : t('hours')
            }
          </strong>

        </div>

        <div class="summary-total">

          <span>
            ${t('deposit')}
          </span>

          <strong>
            ${formatMoney(
              state.deposit
            )}
          </strong>

        </div>
      `;

}


function renderFinalSummary() {

  const container =
    document.getElementById(
      'final-summary'
    );


  container.innerHTML = `

    <div class="final-row">

      <span>
        ${t('owner')}
      </span>

      <strong>
        ${escapeHtml(
          state.owner
        )}
      </strong>

    </div>


    <div class="final-row">

      <span>
        ${t('phone')}
      </span>

      <strong>
        ${escapeHtml(
          state.phone
        )}
      </strong>

    </div>


    <div class="final-row">

      <span>
        ${t('bookingDate')}
      </span>

      <strong>
        ${formatDate(
          state.date
        )}
      </strong>

    </div>


    <div class="final-row">

      <span>
        ${t('bookingTime')}
      </span>

      <strong>
        ${state.time}
      </strong>

    </div>


    <div class="final-row">

      <span>
        ${t('duration')}
      </span>

      <strong>
        ${state.hours}
        ${
          state.hours === 1
            ? t('hour')
            : t('hours')
        }
      </strong>

    </div>


    <div class="final-pets">

      ${
        state.pets
          .map(function(pet) {

            return `
              <div>

                <strong>
                  ${escapeHtml(
                    pet.name
                  )}
                </strong>

                <span>
                  ${
                    SERVICE_TRANSLATIONS[
                      pet.service
                    ]?.[currentLang] ||
                    SERVICES[
                      pet.service
                    ].label
                  }
                </span>

              </div>
            `;

          })
          .join('')
      }

    </div>


    <div class="final-deposit">

      <span>
        ${t('deposit')}
      </span>

      <strong>
        ${formatMoney(
          state.deposit
        )}
      </strong>

    </div>

  `;

}


/*************************************************
 * STEPS
 *************************************************/

function showStep(step) {

  document
    .querySelectorAll('.step')
    .forEach(function(section) {

      section.classList.remove(
        'active'
      );

    });


  const target =
    document.getElementById(
      'step' + step
    );


  if (target) {

    target.classList.add(
      'active'
    );

  }


  document
    .querySelectorAll('.progress-step')
    .forEach(function(item) {

      const number =
        Number(
          item.dataset.step
        );


      item.classList.toggle(
        'active',
        number <= step
      );

    });


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}


function hideAllMainSteps() {

  document
    .querySelectorAll('.step')
    .forEach(function(section) {

      section.classList.remove(
        'active'
      );

    });

}


/*************************************************
 * HELPERS
 *************************************************/

function formatMoney(value) {

  return (
    '฿' +
    Number(value || 0)
      .toLocaleString('en-US')
  );

}


function formatDate(value) {

  if (!value) {
    return '';
  }


  const parts =
    value.split('-');


  if (
    parts.length !== 3
  ) {

    return value;

  }


  return (
    parts[2] +
    '/' +
    parts[1] +
    '/' +
    parts[0]
  );

}


function escapeHtml(value) {

  return String(
    value || ''
  )
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}
