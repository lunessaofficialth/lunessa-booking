/*************************************************
 * LUNESSA PET BOUTIQUE
 * FRONTEND BOOKING ENGINE v1.0
 *************************************************/


/*************************************************
 * API
 *************************************************/

const API_URL =
  'https://script.google.com/macros/s/AKfycbxDEYq9veZKBkjdiQT_mX3YPuFAbWx0lgXCN6RTCBfwWJuBUztLJxfBfkJtbzYP6H7Oig/exec';


/*************************************************
 * SERVICE DEFINITIONS
 *
 * MUST MATCH Code.gs
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
 * STATE
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
  document.getElementById(
    'pets-container'
  );

const addPetButton =
  document.getElementById(
    'add-pet'
  );

const ownerInput =
  document.getElementById(
    'owner'
  );

const phoneInput =
  document.getElementById(
    'phone'
  );

const dateInput =
  document.getElementById(
    'booking-date'
  );

const timeSlots =
  document.getElementById(
    'time-slots'
  );

const loadingTimes =
  document.getElementById(
    'loading-times'
  );

const slotMessage =
  document.getElementById(
    'slot-message'
  );

const nextPayment =
  document.getElementById(
    'next-payment'
  );

const payDeposit =
  document.getElementById(
    'pay-deposit'
  );


/*************************************************
 * INIT
 *************************************************/

document.addEventListener(
  'DOMContentLoaded',
  init
);


function init() {

  handlePaymentReturn();

  setMinimumDate();

  addPet();

  addEventListeners();

}


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
    .getElementById(
      'next-details'
    )
    .addEventListener(
      'click',
      goToDetails
    );


  document
    .getElementById(
      'next-date'
    )
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

      nextPayment.disabled = true;

      loadAvailableTimes();

    }
  );


  document
    .querySelectorAll(
      '[data-back]'
    )
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
    .getElementById(
      'return-booking'
    )
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

    service: 'bath'

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
        document.createElement(
          'div'
        );


      card.className =
        'pet-card';


      card.innerHTML = `

        <div class="pet-card-header">

          <div>

            <span class="pet-number">
              PET ${index + 1}
            </span>

            <h3>
              ${index === 0
                ? 'First pet'
                : 'Second pet'}
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
                  Remove
                </button>
              `
              : ''
          }

        </div>


        <label>

          Pet name

          <input
            type="text"
            class="pet-name"
            data-index="${index}"
            value="${escapeHtml(
              pet.name
            )}"
            placeholder="Pet name"
          >

        </label>


        <label>

          Pet type

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
              Dog
            </option>

            <option
              value="cat"
              ${
                pet.type === 'cat'
                  ? 'selected'
                  : ''
              }
            >
              Cat
            </option>

          </select>

        </label>


        <label>

          Service

          <select
            class="pet-service"
            data-index="${index}"
          >

            ${renderServiceOptions(
              pet.service
            )}

          </select>

        </label>

      `;


      petsContainer.appendChild(
        card
      );

    }
  );


  document
    .querySelectorAll(
      '.pet-name'
    )
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
    .querySelectorAll(
      '.pet-type'
    )
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
    .querySelectorAll(
      '.pet-service'
    )
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
    .querySelectorAll(
      '.remove-pet'
    )
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

  return Object.keys(
    SERVICES
  )
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
          ${SERVICES[key].label}
        </option>
      `;

    })
    .join('');

}


/*************************************************
 * DURATION ENGINE
 *
 * MUST MATCH BACKEND.
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
    .getElementById(
      'summary-hours'
    )
    .textContent =
    state.hours +
    (
      state.hours === 1
        ? ' hour'
        : ' hours'
    );


  document
    .getElementById(
      'summary-deposit'
    )
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
        'กรุณากรอกชื่อน้องให้ครบ'
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
      'ไม่สามารถคำนวณบริการได้'
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
      'กรุณากรอกชื่อเจ้าของ'
    );

    ownerInput.focus();

    return;

  }


  if (!phone) {

    alert(
      'กรุณากรอกเบอร์โทรศัพท์'
    );

    phoneInput.focus();

    return;

  }


  state.owner = owner;

  state.phone = phone;


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
 *************************************************/

async function loadAvailableTimes() {

  if (!state.date) {
    return;
  }


  timeSlots.innerHTML = '';

  slotMessage.textContent = '';

  loadingTimes.textContent =
    'Checking...';


  nextPayment.disabled = true;


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


    if (
      !data.ok
    ) {

      throw new Error(
        data.message ||
        'Unable to load times'
      );

    }


    renderAvailableTimes(
      data.slots
    );


  } catch (error) {

    console.error(error);

    slotMessage.textContent =
      'ไม่สามารถโหลดเวลาว่างได้ กรุณาลองใหม่อีกครั้ง';

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
      'ไม่มีเวลาว่างสำหรับบริการที่เลือกในวันนี้';

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
    .querySelectorAll(
      '.time-button'
    )
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
      'กรุณาเลือกวันและเวลา'
    );

    return;

  }


  renderFinalSummary();

  showStep(4);

}


/*************************************************
 * CREATE CHECKOUT
 *************************************************/

async function createCheckout() {

  payDeposit.disabled =
    true;


  payDeposit.textContent =
    'Preparing payment...';


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


    if (
      !data.ok
    ) {

      throw new Error(
        data.message ||
        'ไม่สามารถสร้างการชำระเงินได้'
      );

    }


    if (
      !data.checkoutUrl
    ) {

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
      'เกิดข้อผิดพลาด กรุณาลองใหม่';


    payDeposit.disabled =
      false;


    payDeposit.textContent =
      'Pay deposit';

  }

}


/*************************************************
 * PAYMENT RETURN
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
      .getElementById(
        'cancelled'
      )
      .classList.add(
        'active'
      );

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
              <span>Booking ID</span>
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
          'Payment is being verified';

        success.querySelector(
          'p'
        ).textContent =
          'Your payment was received and your booking is being confirmed.';

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
              ${escapeHtml(
                SERVICES[
                  pet.service
                ].label
              )}
            </strong>

          </div>
        `;

      })
      .join('') +

      `
        <div class="summary-total">

          <span>
            Total time
          </span>

          <strong>
            ${state.hours}
            ${
              state.hours === 1
                ? 'hour'
                : 'hours'
            }
          </strong>

        </div>

        <div class="summary-total">

          <span>
            Deposit
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

      <span>Owner</span>

      <strong>
        ${escapeHtml(
          state.owner
        )}
      </strong>

    </div>


    <div class="final-row">

      <span>Phone</span>

      <strong>
        ${escapeHtml(
          state.phone
        )}
      </strong>

    </div>


    <div class="final-row">

      <span>Date</span>

      <strong>
        ${formatDate(
          state.date
        )}
      </strong>

    </div>


    <div class="final-row">

      <span>Time</span>

      <strong>
        ${state.time}
      </strong>

    </div>


    <div class="final-row">

      <span>Duration</span>

      <strong>
        ${state.hours}
        ${
          state.hours === 1
            ? 'hour'
            : 'hours'
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
                  ${escapeHtml(
                    SERVICES[
                      pet.service
                    ].label
                  )}
                </span>

              </div>
            `;

          })
          .join('')
      }

    </div>


    <div class="final-deposit">

      <span>
        Deposit
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
    .querySelectorAll(
      '.step'
    )
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
    .querySelectorAll(
      '.progress-step'
    )
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
    .querySelectorAll(
      '.step'
    )
    .forEach(function(section) {

      section.classList.remove(
        'active'
      );

    });

}


/*************************************************
 * HELPERS
 *************************************************/

function formatMoney(
  value
) {

  return (
    '฿' +
    Number(value || 0)
      .toLocaleString(
        'en-US'
      )
  );

}


function formatDate(
  value
) {

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


function escapeHtml(
  value
) {

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
