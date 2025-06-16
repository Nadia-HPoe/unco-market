const track = document.querySelector(".slider__track");
const slides = document.querySelectorAll(".slider__banner");
const steps = document.querySelectorAll(".slider__step");
const slider = document.querySelector(".slider");
const burger = document.querySelector(
  ".header__navigation-personal-burger-menu"
);
const menu = document.querySelector(".header__navigation-menu");
const blocks = document.querySelectorAll(".block");
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
  blockArrowLeft.addEventListener("click", () => subBlockOrder());

  blockArrowRight.addEventListener("click", () => addBlockOrder());

  const addBlockOrder = () => {
    [blocksMinOrder, blocksMaxOrder] =
      blocksMaxOrder === 17
        ? [0, 6]
        : blocksMaxOrder === 12
        ? [12, 17]
        : [6, 12];
    createBlocks();
  };

  const subBlockOrder = () => {
    [blocksMinOrder, blocksMaxOrder] =
      blocksMinOrder === 12
        ? [6, 12]
        : blocksMinOrder === 6
        ? [0, 6]
        : [12, 17];
    createBlocks();
  };

  const createBlocks = () => {
    blocksArray.forEach((block, index) => {
      index >= blocksMinOrder && index < blocksMaxOrder
        ? (block.style.display = "flex")
        : (block.style.display = "none");
    });
  };
});

//Setting up a feedback form
const validateForm = () => {
  let isValid = true;

  ["name-error", "email-error", "message-error"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });

  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const messageEl = document.getElementById("message");

  const fields = {
    name: nameEl ? nameEl.value.trim() : "",
    email: emailEl ? emailEl.value.trim() : "",
    message: messageEl ? messageEl.value.trim() : "",
  };

  if (!fields.name) {
    const el = document.getElementById("name-error");
    if (el) el.textContent = "Name is required";
    isValid = false;
  } else if (fields.name.length < 2) {
    const el = document.getElementById("name-error");
    if (el) el.textContent = "Name must be at least 2 characters";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fields.email) {
    const el = document.getElementById("email-error");
    if (el) el.textContent = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(fields.email)) {
    const el = document.getElementById("email-error");
    if (el) el.textContent = "Invalid email format";
    isValid = false;
  }

  if (!fields.message) {
    const el = document.getElementById("message-error");
    if (el) el.textContent = "Message is required";
    isValid = false;
  } else if (fields.message.length < 10) {
    const el = document.getElementById("message-error");
    if (el) el.textContent = "Message must be at least 10 characters";
    isValid = false;
  }

  return isValid;
};

const executeRecaptcha = () => {
  return new Promise((resolve, reject) => {
    if (typeof grecaptcha === "undefined") {
      reject(new Error("reCAPTCHA not loaded"));
      return;
    }
    grecaptcha.ready(() => {
      grecaptcha
        .execute("6Lfc3V8rAAAAAFP_8QAxezqmQ28L7D3owmwqkhZY", {
          action: "submit",
        })
        .then((token) => {
          const recaptchaResponseEl = document.getElementById(
            "g-recaptcha-response"
          );
          if (recaptchaResponseEl) {
            recaptchaResponseEl.value = token;
            resolve(token);
          } else {
            reject(new Error("reCAPTCHA response element not found"));
          }
        })
        .catch((error) => reject(error));
    });
  });
};

document
  .getElementById("contact_form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const successEl = document.getElementById("success-message");
    if (successEl) successEl.textContent = "";

    if (!validateForm()) return;

    try {
      const token = await executeRecaptcha();

      if (!token) {
        alert("reCAPTCHA verification failed. Please try again.");
        return;
      }

      const formData = new FormData(document.getElementById("contact_form"));

      const response = await fetch("https://feedback.foodfutures.net", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      let result;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (!response.ok) {
        throw new Error(result || "Server error");
      }

      if (successEl) successEl.textContent = "Message sent successfully!";
      document.getElementById("contact_form").reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Submission failed: ${error.message}`);
    }
  });
