import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let timeInterval;

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

document.querySelector('.form').addEventListener('submit', event => {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const delay = formData.get('delay');
  const state = formData.get('state');

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(value => {
      iziToast.success({  
        color: 'green',
        position: "topRight",
        message: `✅ Fulfilled promise in ${value}ms`
      });
    })
    .catch(error => {
      iziToast.error({ 
        color: 'red',
        position: "topRight",          
        message: `❌ Rejected promise in ${error}ms`
      });
    });
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    try {
      userSelectedDate = selectedDates[0];
      const timeInterval = userSelectedDate - options.defaultDate;

      if (timeInterval < 1) {
        iziToast.error({
          color: 'red',
          position: 'topRight',
          message: `Please choose a date in the future`,
        });
      } else {
        startButton.disabled = false;
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  },
};

const calendar = flatpickr('#datetime-picker', options);
const startButton = document.querySelector('button');
const showTimeElements = document.querySelectorAll('.value');

startButton.disabled = true;

startButton.addEventListener('click', () => {
  clearInterval(countdownInterval);

  dateTimeInput.disabled = true;

  countdownInterval = setInterval(() => {
    const timeRemaining = userSelectedDate - new Date();

    if (timeRemaining < 1) {
      startButton.disabled = true;
      dateTimeInput.disabled = false;
      clearInterval(countdownInterval);
      return;
    }

    const timeObject = convertMs(timeRemaining);

    showTimeElements[0].innerText = addLeadingZero(timeObject.days);
    showTimeElements[1].innerText = addLeadingZero(timeObject.hours);
    showTimeElements[2].innerText = addLeadingZero(timeObject.minutes);
    showTimeElements[3].innerText = addLeadingZero(timeObject.seconds);
  }, 1000);
});
