/* =====================================================
   LUNESSA PET BOUTIQUE
   BOOKING SYSTEM
   FRONTEND / BOOKING ENGINE v1.0
===================================================== */


/* =====================================================
   CONFIG
=====================================================

   IMPORTANT:
   Put the deployed Google Apps Script Web App URL here.

   Example:

   https://script.google.com/macros/s/XXXXXXXXXXXX/exec

===================================================== */

const API_URL =
  'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';


/* =====================================================
   GLOBAL STATE
===================================================== */

const state = {

  step: 1,

  pets: [],

  hours: 0,

  deposit: 0,

  date: '',

  time: '',

  owner: '',

  phone: '',

  availableSlots: {}

};


/* =====================================================
   DOM
===================================================== */

const $ = (selector) =>
  document.querySelector(selector);


const $$ = (selector) =>
  document.querySelectorAll(selector);


/* =====================================================
   SERVICE RULES
===================================================== */

const SERVICE_HOURS = {

  bath: 1,

  clip: 2,

  scissor: 2,

  haircut_only: 2,

  addon: 1

};


const SERVICE_DEPOSIT = {

  bath: 200,

  clip: 400,

  scissor: 400,

  haircut_only: 200,

  addon: 200

};


const SERVICE_LABELS = {

  bath:
    'Bath',

  clip:
    'Bath + Clipping',

  scissor:
    'Bath + Scissor',

  haircut_only:
    'Haircut only',

  addon:
    'Additional service only'

};


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
  'DOMContentLoaded',
  initialize
);


function initialize() {

  setupDateMinimum();

  bindEvents();

  handleReturnFromStripe();

  updateBookingSummary();

}


/* =====================================================
   EVENTS
===================================================== */

function bindEvents() {

  $('#addPetButton')
    .addEventListener(
      'click',
      addSecondPet
    );


  $('#removePet2')
    .addEventListener(
      'click',
      removeSecondPet
    );


  $('#continueToDate')
    .addEventListener(
      'click',
      goToDateStep
    );


  $('#backToPets')
    .addEventListener(
      'click',
      () => showStep(1)
    );


  $('#continueToDetails')
    .addEventListener(
      'click',
      goToDetailsStep
    );


  $('#backToDate')
    .addEventListener(
      'click',
      () => showStep(2)
    );


  $('#bookingDate')
    .addEventListener(
      'change',
      handleDateChange
    );


  $('#bookingForm')
    .addEventListener(
      'submit',
      handleSubmit
    );


  $('#returnToBooking')
    .addEventListener(
      'click',
      resetBooking
    );


  $$('.service-option input')
    .forEach(
      input => {

        input.addEventListener(
          'change',
          updateBookingSummary
        );

      }
    );

}


/* =====================================================
   DATE
===================================================== */

function setupDateMinimum() {

  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, '0');


  const day =
    String(
      today.getDate()
    ).padStart(2, '0');


  const dateString =
    `${year}-${month}-${day}`;


  $('#bookingDate')
    .min = dateString;

}


/* =====================================================
   PET MANAGEMENT
===================================================== */

function addSecondPet() {

  $('#pet2Card')
    .classList
    .remove('hidden');


  $('#addPetButton')
    .classList
    .add('hidden');


  updateBookingSummary();

}


function removeSecondPet() {

  $('#pet2Card')
    .classList
    .add('hidden');


  $('#addPetButton')
    .classList
    .remove('hidden');


  clearPet2();

  updateBookingSummary();

}


function clearPet2() {

  $('#pet2Name').value = '';

  $('#pet2Type').value = '';

  $$('input[name="pet2Service"]')
    .forEach(
      input => {
        input.checked = false;
      }
    );

}


/* =====================================================
   READ PET DATA
===================================================== */

function readPetData() {

  const pets = [];


  const pet1 =
    readPet(1);


  if (pet1) {

    pets.push(pet1);

  }


  const pet2Visible =
    !$('#pet2Card')
      .classList
      .contains('hidden');


  if (pet2Visible) {

    const pet2 =
      readPet(2);


    if (pet2) {

      pets.push(pet2);

    }

  }


  return pets;

}


function readPet(number) {

  const name =
    $(`#pet${number}Name`)
      .value
      .trim();


  const type =
    $(`#pet${number}Type`)
      .value;


  const serviceInput =
    document.querySelector(
      `input[name="pet${number}Service"]:checked`
    );


  const service =
    serviceInput
      ? serviceInput.value
      : '';


  if (
    !name &&
    !type &&
    !service
  ) {

    return null;

  }


  return {

    name,

    type,

    service

  };

}


/* =====================================================
   VALIDATE PETS
===================================================== */

function validatePets() {

  const error =
    $('#step1Error');


  error.textContent = '';


  const pets =
    readPetData();


  if (
    pets.length < 1
  ) {

    error.textContent =
      'Please enter at least one pet.';

    return false;

  }


  if (
    pets.length > 2
  ) {

    error.textContent =
      'Maximum 2 pets per booking.';

    return false;

  }


  for (
    let i = 0;
    i < pets.length;
    i++
  ) {

    const pet =
      pets[i];


    if (!pet.name) {

      error.textContent =
        `Please enter Pet ${i + 1}'s name.`;

      return false;

    }


    if (!pet.type) {

      error.textContent =
        `Please select Pet ${i + 1}'s type.`;

      return false;

    }


    if (!pet.service) {

      error.textContent =
        `Please select a service for Pet ${i + 1}.`;

      return false;

    }

  }


  return true;

}


/* =====================================================
   BOOKING ENGINE
=====================================================

   These calculations mirror the locked backend rules.

   Backend remains the final authority.

===================================================== */

function calculateHours(pets) {

  if (
    pets.length === 1
  ) {

    return SERVICE_HOURS[
      pets[0].service
    ];

  }


  const services =
    pets.map(
      pet => pet.service
    );


  const baths =
    services.filter(
      service =>
        service === 'bath'
    ).length;


  const grooming =
    services.filter(
      service =>
        service === 'clip' ||
        service === 'scissor'
    ).length;


  const haircutOnly =
    services.filter(
      service =>
        service === 'haircut_only'
    ).length;


  const addons =
    services.filter(
      service =>
        service === 'addon'
    ).length;


  /*
   * 2 PET RULES
   *
   * Bath + Bath = 3
   *
   * Bath + Bath+Grooming = 4
   *
   * Bath+Grooming + Bath+Grooming = 4
   *
   * Haircut only + Bath = 3
   *
   * Addon + Bath = 2
   *
   * Addon + Addon = 1
   *
   * Haircut only + Haircut only = 3
   */


  if (
    services.includes('bath') &&
    (
      services.includes('clip') ||
      services.includes('scissor')
    )
  ) {

    return 3;

  }


  if (
    baths === 1 &&
    haircutOnly === 1
  ) {

    return 3;

  }


  if (
    baths === 1 &&
    addons === 1
  ) {

    return 2;

  }


  if (
    addons === 2
  ) {

    return 1;

  }


  if (
    haircutOnly === 2
  ) {

    return 3;

  }


  if (
    grooming === 2
  ) {

    return 4;

  }


  if (
    baths === 2
  ) {

    return 3;

  }


  /*
   * Fallback.
   *
   * Backend will still validate.
   */

  return services.reduce(
    (
      total,
      service
    ) => {

      return (
        total +
        (
          SERVICE_HOURS[service] || 1
        )
      );

    },
    0
  );

}


/* =====================================================
   DEPOSIT
===================================================== */

function calculateDeposit(pets) {

  return pets.reduce(
    (
      total,
      pet
    ) => {

      return (
        total +
        (
          SERVICE_DEPOSIT[
            pet.service
          ] || 200
        )
      );

    },
    0
  );

}


/* =====================================================
   SUMMARY
===================================================== */

function updateBookingSummary() {

  const pets =
    readPetData();


  if (
    pets.length === 0
  ) {

    $('#bookingSummary')
      .classList
      .add('hidden');

    return;

  }


  const hours =
    calculateHours(pets);


  const deposit =
    calculateDeposit(pets);


  state.pets =
    pets;

  state.hours =
    hours;

  state.deposit =
    deposit;


  $('#summaryHours')
    .textContent =
    `${hours} hour${hours > 1 ? 's' : ''}`;


  $('#summaryDeposit')
    .textContent =
    formatTHB(deposit);


  $('#bookingSummary')
    .classList
    .remove('hidden');

}


/* =====================================================
   STEP 1 → STEP 2
===================================================== */

function goToDateStep() {

  if (!validatePets()) {

    return;

  }


  updateBookingSummary();


  state.date = '';

  state.time = '';


  $('#bookingDate').value = '';

  $('#slotGrid').innerHTML = '';

  $('#noSlotsMessage')
    .classList
    .add('hidden');


  $('#durationLabel')
    .textContent =
    `${state.hours} hour${state.hours > 1 ? 's' : ''}`;


  showStep(2);

}


/* =====================================================
   DATE CHANGE
===================================================== */

async function handleDateChange() {

  const date =
    $('#bookingDate')
      .value;


  state.date =
    date;


  state.time =
    '';


  $('#step2Error')
    .textContent = '';


  $('#slotGrid')
    .innerHTML = '';


  $('#noSlotsMessage')
    .classList
    .add('hidden');


  if (!date) {

    return;

  }


  await loadAvailableSlots(
    date,
    state.hours
  );

}


/* =====================================================
   LOAD AVAILABLE SLOTS
===================================================== */

async function loadAvailableSlots(
  date,
  hours
) {

  const loading =
    $('#loadingSlots');


  loading.classList
    .remove('hidden');


  try {

    if (
      !API_URL ||
      API_URL.includes(
        'PASTE_YOUR'
      )
    ) {

      throw new Error(
        'Booking API is not configured.'
      );

    }


    const url =
      `${API_URL}?action=slots` +
      `&date=${encodeURIComponent(date)}` +
      `&hours=${encodeURIComponent(hours)}`;


    const response =
      await fetch(
        url,
        {
          method: 'GET',
          cache: 'no-store'
        }
      );


    if (!response.ok) {

      throw new Error(
        'Unable to check availability.'
      );

    }


    const data =
      await response.json();


    if (!data.ok) {

      throw new Error(
        data.message ||
        'Unable to check availability.'
      );

    }


    state.availableSlots =
      data.slots || {};


    renderSlots(
      state.availableSlots
    );

  } catch (error) {

    console.error(error);


    $('#step2Error')
      .textContent =
      error.message ||
      'Unable to load available times.';


  } finally {

    loading.classList
      .add('hidden');

  }

}


/* =====================================================
   RENDER SLOTS
===================================================== */

function renderSlots(slots) {

  const grid =
    $('#slotGrid');


  grid.innerHTML = '';


  const available =
    Object.keys(slots)
      .filter(
        time =>
          slots[time] === true
      );


  if (
    available.length === 0
  ) {

    $('#noSlotsMessage')
      .classList
      .remove('hidden');

    return;

  }


  $('#noSlotsMessage')
    .classList
    .add('hidden');


  available.forEach(
    time => {

      const button =
        document.createElement(
          'button'
        );


      button.type =
        'button';


      button.className =
        'slot-button';


      button.textContent =
        time;


      button.addEventListener(
        'click',
        () => selectSlot(
          time,
          button
        )
      );


      grid.appendChild(
        button
      );

    }
  );

}


/* =====================================================
   SELECT SLOT
===================================================== */

function selectSlot(
  time,
  button
) {

  $$('.slot-button')
    .forEach(
      item => {

        item.classList
          .remove('selected');

      }
    );


  button.classList
    .add('selected');


  state.time =
    time;


  $('#step2Error')
    .textContent = '';

}


/* =====================================================
   STEP 2 → STEP 3
===================================================== */

function goToDetailsStep() {

  const error =
    $('#step2Error');


  error.textContent = '';


  if (!state.date) {

    error.textContent =
      'Please select a date.';

    return;

  }


  if (!state.time) {

    error.textContent =
      'Please select an available time.';

    return;

  }


  updateFinalReview();


  showStep(3);

}


/* =====================================================
   FINAL REVIEW
===================================================== */

function updateFinalReview() {

  const container =
    $('#finalPetSummary');


  container.innerHTML = '';


  state.pets.forEach(
    pet => {

      const row =
        document.createElement(
          'div'
        );


      row.className =
        'review-pet';


      const name =
        document.createElement(
          'strong'
        );


      name.textContent =
        pet.name;


      const service =
        document.createElement(
          'small'
        );


      service.textContent =
        SERVICE_LABELS[
          pet.service
        ];


      row.appendChild(
        name
      );


      row.appendChild(
        service
      );


      container.appendChild(
        row
      );

    }
  );


  $('#finalDate')
    .textContent =
    formatDate(
      state.date
    );


  $('#finalTime')
    .textContent =
    state.time;


  $('#finalHours')
    .textContent =
    `${state.hours} hour${state.hours > 1 ? 's' : ''}`;


  $('#finalDeposit')
    .textContent =
    formatTHB(
      state.deposit
    );

}


/* =====================================================
   CUSTOMER VALIDATION
===================================================== */

function validateCustomer() {

  const error =
    $('#step3Error');


  error.textContent = '';


  const owner =
    $('#ownerName')
      .value
      .trim();


  const phone =
    $('#ownerPhone')
      .value
      .trim();


  if (!owner) {

    error.textContent =
      'Please enter your name.';

    return false;

  }


  if (!phone) {

    error.textContent =
      'Please enter your phone number.';

    return false;

  }


  if (
    phone.replace(
      /\D/g,
      ''
    ).length < 8
  ) {

    error.textContent =
      'Please enter a valid phone number.';

    return false;

  }


  state.owner =
    owner;


  state.phone =
    phone;


  return true;

}


/* =====================================================
   SUBMIT
===================================================== */

async function handleSubmit(event) {

  event.preventDefault();


  if (
    !validateCustomer()
  ) {

    return;

  }


  const button =
    $('#payDeposit');


  button.disabled =
    true;


  button.textContent =
    'Preparing payment...';


  try {

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
            JSON.stringify(payload)

        }
      );


    if (!response.ok) {

      throw new Error(
        'Unable to create payment.'
      );

    }


    const data =
      await response.json();


    if (!data.ok) {

      throw new Error(
        data.message ||
        'Unable to create payment.'
      );

    }


    if (
      !data.checkoutUrl
    ) {

      throw new Error(
        'Stripe checkout URL was not returned.'
      );

    }


    state.bookingId =
      data.bookingId;


    /*
     * Stripe redirect
     */

    window.location.href =
      data.checkoutUrl;


  } catch (error) {

    console.error(error);


    $('#step3Error')
      .textContent =
      error.message ||
      'Something went wrong. Please try again.';


    button.disabled =
      false;


    button.textContent =
      'Continue to payment';

  }

}


/* =====================================================
   STRIPE RETURN
===================================================== */

async function handleReturnFromStripe() {

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


  const bookingId =
    params.get('booking_id');


  if (
    paid === '1' &&
    sessionId
  ) {

    await confirmPayment(
      sessionId,
      bookingId
    );

    return;

  }


  if (
    cancelled === '1'
  ) {

    showCancelled();

  }

}


/* =====================================================
   CONFIRM PAYMENT
===================================================== */

async function confirmPayment(
  sessionId,
  bookingId
) {

  showStep(4);


  $('#paymentLoading')
    .textContent =
    'Confirming your payment...';


  try {

    const url =
      `${API_URL}` +
      `?action=confirmCheckout` +
      `&session_id=${encodeURIComponent(sessionId)}`;


    const response =
      await fetch(
        url,
        {
          method: 'GET',
          cache: 'no-store'
        }
      );


    if (!response.ok) {

      throw new Error(
        'Unable to confirm payment.'
      );

    }


    const data =
      await response.json();


    if (
      !data.ok ||
      !data.paid
    ) {

      throw new Error(
        data.message ||
        'Payment has not been confirmed.'
      );

    }


    showSuccess(
      data.bookingId ||
      bookingId
    );


  } catch (error) {

    console.error(error);


    $('#paymentLoading')
      .textContent =
      'Payment was received, but confirmation is still being processed. Please contact Lunessa if needed.';

  }

}


/* =====================================================
   SUCCESS
===================================================== */

function showSuccess(
  bookingId
) {

  $('#bookingForm')
    .classList
    .add('hidden');


  $('.progress')
    .classList
    .add('hidden');


  $('.booking-intro')
    .classList
    .add('hidden');


  $('#successState')
    .classList
    .remove('hidden');


  $('#confirmationBookingId')
    .textContent =
    bookingId || '—';


  clearBookingQuery();

}


/* =====================================================
   CANCELLED
===================================================== */

function showCancelled() {

  $('#bookingForm')
    .classList
    .add('hidden');


  $('.progress')
    .classList
    .add('hidden');


  $('.booking-intro')
    .classList
    .add('hidden');


  $('#cancelledState')
    .classList
    .remove('hidden');

}


/* =====================================================
   RESET
===================================================== */

function resetBooking() {

  window.location.href =
    window.location.pathname;

}


/* =====================================================
   STEP NAVIGATION
===================================================== */

function showStep(
  step
) {

  state.step =
    step;


  $$('.booking-step')
    .forEach(
      section => {

        section.classList
          .remove('active');

      }
    );


  const target =
    $(`#step${step}`);


  if (target) {

    target.classList
      .add('active');

  }


  $$('.progress-step')
    .forEach(
      item => {

        const number =
          Number(
            item.dataset.step
          );


        item.classList.toggle(
          'active',
          number <= step
        );

      }
    );


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}


/* =====================================================
   FORMAT
===================================================== */

function formatTHB(
  amount
) {

  return (
    '฿' +
    Number(amount || 0)
      .toLocaleString(
        'en-US'
      )
  );

}


function formatDate(
  dateString
) {

  if (!dateString) {

    return '—';

  }


  const parts =
    dateString.split('-');


  if (
    parts.length !== 3
  ) {

    return dateString;

  }


  const [
    year,
    month,
    day
  ] = parts;


  return `${day}/${month}/${year}`;

}


/* =====================================================
   CLEAR URL
===================================================== */

function clearBookingQuery() {

  try {

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

  } catch (error) {

    console.log(error);

  }

}
