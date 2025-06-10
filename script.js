const track = document.querySelector('.slider__track');
const slides = document.querySelectorAll('.slider__banner');
const steps = document.querySelectorAll('.slider__step');
const slider = document.querySelector('.slider');
const burger = document.querySelector(
  ".header__navigation-personal-burger-menu"
);
const menu = document.querySelector(".header__navigation-menu");
const blocks = document.querySelectorAll('.block');
const blocksArray = Array.from(blocks);
const blockArrowLeft = document.getElementById("eco-system-arrow-left");
const blockArrowRight = document.getElementById("eco-system-arrow-right");

let currentIndex = 0;
const totalSlides = slides.length;
let intervalId;
let blocksMaxOrder = 6;
let blocksMinOrder = 0;

function showSlide(index) {
  steps.forEach((step, i) => step.classList.toggle("activeSlide", i === index));
  slides.forEach((slide, i) => slide.classList.toggle("sawSlide", i === index));
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

slider.addEventListener("mouseenter", stopSlider);
slider.addEventListener("mouseleave", startSlider);

showSlide(currentIndex);
startSlider();

steps.forEach((step, i) => {
  step.addEventListener("click", () => {
    currentIndex = i;
    showSlide(currentIndex);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  if (burger) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("active");
      menu.classList.toggle("active");
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
  blockArrowLeft.addEventListener("click", () => subBlockOrder())

  blockArrowRight.addEventListener("click", () => addBlockOrder())

  const addBlockOrder = () => {
      [blocksMinOrder, blocksMaxOrder] = 
        blocksMaxOrder === 17 ? [0, 6] :
        blocksMaxOrder === 12 ? [12, 17] :
        [6, 12];
    createBlocks();
  }

  const subBlockOrder = () => {
      [blocksMinOrder, blocksMaxOrder] = 
        blocksMinOrder === 12 ? [6, 12] :
        blocksMinOrder === 6 ? [0, 6] :
        [12, 17];
   createBlocks();
  }

  const createBlocks = () => {
    blocksArray.forEach((block,index) => {
      index >= blocksMinOrder && index < blocksMaxOrder 
      ? 
        block.style.display = "flex" 
      : 
        block.style.display = "none"
    })
  }
})
