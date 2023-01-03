const left = document.querySelector(".left");
const right = document.querySelector(".right");
const images = document.querySelectorAll("img");
const imageDescription = document.querySelector("h2");
const imageContainer = document.querySelector(".swiper-wrapper");
const start = document.querySelector(".bottom button");

const main = document.querySelector(".main");
const landingContainer = document.querySelector(".container");
const landingBottom = document.querySelector(".bottom");
const body = document.querySelector("body");
const mainPage = document.querySelector(".main-page");

const textForm = document.getElementById("text-form");
const textInput = document.querySelector("#text-form input");
const imgContainer = document.querySelector(".image-container");
const searchButton = textForm.querySelector("button");
const imgContainerAnimation = imgContainer.querySelector("lottie-player");

const swiper = new Swiper(".swiper", {
  direction: "horizontal",
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: right,
    prevEl: left,
  },
});

start.addEventListener("click", () => {
  start.style.pointerEvents = "none";
  gsap.to(left, 1, { x: "-10vw", opacity: 0, ease: "power" });
  gsap.to(right, 1, { x: "10vw", opacity: 0, ease: "power" });
  gsap.to(start, 0.5, { y: "5vw", opacity: 0, ease: "power", delay: 0.5 });
  gsap.to(document.querySelector(".swiper"), 1.5, {
    scale: 0,
    rotation: 360,
    delay: 0.75,
  });
  gsap.to(main, 1, { opacity: 0, ease: "power", delay: 2.25 });

  setTimeout(function () {
    main.remove();
    mainPage.style.display = "flex";
  }, 3300);

  gsap.to(mainPage, 1, {
    opacity: 1,
    ease: "power",
  });

  gsap.to(body, 1.5, {
    background:
      "linear-gradient(135deg, rgba(252, 92, 125, .5), rgba(106, 130, 251, .5))",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: "'Alegreya Sans', sans-serif",
    delay: 3.35,
  });

  gsap.fromTo(
    imgContainer,
    1.5,
    { x: "30vw" },
    {
      x: 0,
      ease: "elastic",
      delay: 4,
    }
  );

  gsap.fromTo(imgContainer, 0.3, { opacity: 0 }, { opacity: 1, delay: 4 });

  gsap.fromTo(
    imgContainerAnimation,
    0.75,
    { opacity: 0 },
    { opacity: 1, delay: 4.75 }
  );

  gsap.fromTo(
    textInput,
    1,
    { y: "7rem", opacity: 0 },
    { y: 0, opacity: 1, ease: "back", delay: 4.7 }
  );

  gsap.fromTo(
    searchButton,
    1.2,
    { scale: 0 },
    { scale: 1, ease: "elastic", delay: 5.7 }
  );
});

textForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const text = textInput.value.trim();
  if (!text) {
    alert("Please enter image description");
    return;
  }
  imgContainerAnimation.remove();
  generateImageRequest(text);
}

async function generateImageRequest(prompt) {
  try {
    const loading = `<lottie-player src="assets/Loading.json" background="transparent" speed="1"
  style="width: 10rem; height: 10rem;" loop autoplay></lottie-player>`;
    imgContainer.innerHTML = loading;

    const response = await fetch("/openai/generateimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      imgContainer.innerHTML = "";
      throw new Error("Image could not be generated");
    }

    const json = await response.json();
    console.log(json);
    const imageUrl = json.data;
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imgContainer.innerHTML = "";
    imgContainer.appendChild(imageElement);
  } catch (error) {
    console.log(error);
  }
}
