//Intersection Observer API

// This for "anim"
// settings
let options = {
    root: null,
    rootMargin: '-20px 0px',
    threshold: 0.5
}

//callback function
let callback = function(entries, observer) {
    entries.forEach(entry => {
        //если элемент является наблюдаемым
        if (entry.isIntersecting) {
            //давим класс active к нему
            entry.target.classList.add('active');
            //можно отписаться от наблюдения:
            //observer.unobserve(entry.target);
        } else { // удаляем класс active, если элемент не виден
            entry.target.classList.remove('active');
        }
    });
}

//наблюдатель
let observer = new IntersectionObserver(callback, options);

//опрееляем элементы, за которыми наблюдаем
let targets = document.querySelectorAll('.anim')
targets.forEach(target => {
    observer.observe(target);
});



//For Main Arrow
//количество пикселей на прокрутку страницы   
const hideAfter = 300;

// функция для скрытия/появления элемента
function checkScroll() {
    const element = document.querySelector('.main__arrow');
    if (window.scrollY > hideAfter) {
        element.classList.remove('visible');
    } else {
        element.classList.add('visible');  
    }
}

//вызываем функцию при скролле
window.addEventListener('scroll', checkScroll)

document.getElementById('non-alcoholic').addEventListener('change', function() {
    let checkboxes = document.querySelectorAll('input[name="drinking[]"]:not(#non-alcoholic)');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = this.checked;
    });
});

const countdown = document.querySelector('.countdown');
const targetDate = new Date('2027-07-07T12:00:00');
 
function updateCountdown() {
  const now = new Date();
  const remainingTime = targetDate - now;
 
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
 
  document.getElementById('days').innerText = days.toString().padStart(2, '0');
  document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
  document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}
 
// Обновляем счетчик каждую секунду
setInterval(updateCountdown, 1000);


// audio play
const playStopIcon = document.getElementById('playStopIcon');
const audio = document.getElementById('audio');
const play = document.querySelector('.audio-btn__play'),
      stop = document.querySelector('.audio-btn__stop');

window.addEventListener('load', () => {
    if (audio.paused) {
        play.classList.add('btn-hidden'),
        stop.classList.remove('btn-hidden');
    } else {
        play.classList.remove('btn-hidden'),
        stop.classList.add('btn-hidden');
    }
});

playStopIcon.addEventListener('click', function () {
    if (audio.paused) {
        audio.play(),
        play.classList.remove('btn-hidden'),
        stop.classList.add('btn-hidden');
    } else {
        audio.pause(),
        play.classList.add('btn-hidden'),
        stop.classList.remove('btn-hidden');
    }
}
);


// JavaScript отвечает за каждое касание (стилизация кнопки при касании на сенсорном утсройстве (UX))
document.addEventListener('touchstart', function(event) {
    if (event.target && event.target.matches('.button')) {
        event.target.classList.add('button__touch');
    }
});

document.addEventListener('touchend', function(event) {
    if (event.target && event.target.matches('.button')) {
        event.target.classList.remove('button__touch');
    }
});

// Для проверки добавления класса на десктопе
document.addEventListener('click', function(event) {
    if (event.target && event.target.matches('.button')) {
        event.target.classList.add('button__touch');
        setTimeout(function() {
            event.target.classList.remove('button__touch');
        }, 200); // Убираем класс через 200ms
    }
});






  // Ниже - отправка формы с обраоткой на стороне серврера через send.php
document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
  
    fetch("send.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const toast = document.getElementById("form-toast");
      toast.textContent = data.message;
      toast.className = "toast show " + (data.success ? "success" : "error");
  
      if (data.success) {
        form.reset();
      }
  
      setTimeout(() => {
        toast.className = "toast"; // скрыть сообщение
      }, 8000);
    })
    .catch(() => {
      const toast = document.getElementById("form-toast");
    //   toast.textContent = "Сервер недоступен. Попробуйте позже.";
      toast.textContent = "Спасибо! Ваш ответ получен!";  // Вместо сообщения об ошибке - показ сообщения об успехе (исключительно для публикации как примера работ, без хостинга (форма не отсылает к файлу send.php)). При продакшн запустить вместо этой строку выше
      toast.className = "toast show error";
  
      setTimeout(() => {
        toast.className = "toast";
      }, 4000);
    });
  });

