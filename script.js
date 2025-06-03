const track = document.querySelector('.slider__track');
const slides = document.querySelectorAll('.slider__banner');
const steps = document.querySelectorAll('.slider__step');
const slider = document.querySelector('.slider');

let currentIndex = 0;
const totalSlides = slides.length;
let intervalId;

function showSlide(index) {
  steps.forEach((step, i) => step.classList.toggle('activeSlide', i === index));
  slides.forEach((slide, i) => slide.classList.toggle('sawSlide', i === index)) 
}

function startSlider() {
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }, 5000);
}

function stopSlider() {
  clearInterval(intervalId);
}

slider.addEventListener('mouseenter', stopSlider);
slider.addEventListener('mouseleave', startSlider);

showSlide(currentIndex);
startSlider();

steps.forEach((step, i) => {
  step.addEventListener('click', () => {
    currentIndex = i;
    showSlide(currentIndex);
  });
});
