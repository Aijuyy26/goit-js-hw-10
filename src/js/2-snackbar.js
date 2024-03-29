import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


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