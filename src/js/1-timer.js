import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let timeInterval;

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
        dateTimeInput.disabled = true;
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  },
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const calendar = flatpickr('#datetime-picker', options);
const dateTimeInput = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button');
const showTimeElements = document.querySelectorAll('.value');

startButton.disabled = true;

startButton.addEventListener('click', event => {
  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const timeRemaining = userSelectedDate - new Date();

    if (timeRemaining < 1) {
      startButton.disabled = true;
      dateTimeInput.disabled = false;
      clearInterval(countdownInterval);
      return;
    }

    const timeObject = convertMs(timeRemaining);

    showTimeElements[0].innerText = timeObject.days.toString().padStart(2, '0');
    showTimeElements[1].innerText = timeObject.hours.toString().padStart(2, '0');
    showTimeElements[2].innerText = timeObject.minutes.toString().padStart(2, '0');
    showTimeElements[3].innerText = timeObject.seconds.toString().padStart(2, '0');
  }, 1000);

  event.preventDefault();
});