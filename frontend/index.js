document.addEventListener("DOMContentLoaded", () => {
  const loadingbox = document.querySelector(".loading-box");
  const loadingText = document.getElementById("text");
  const zoomWrapper = document.querySelector(".zoom-wrapper");

  const images = [
    "assets/image1.png",
    "assets/image2.png",
    "assets/image3.png",
  ];

  const text = ["pop popcorns", "and..", "TUDUM!"];

  let index = 0;
  const interval = 3000;

  console.log("showing:" + images[index] + " and " + text[index]);
  loadingbox.style.background = `url(${images[index]}) center center / cover no-repeat`;
  loadingbox.style.imageRendering = "pixelated";
  loadingText.textContent = text[index];

  index++;

  const Change = setInterval(() => {
    if (index < images.length && index < text.length) {
      setTimeout(() => {
        loadingbox.style.background = `url(${images[index]}) center center / cover no-repeat`;
        loadingbox.style.imageRendering = "pixelated";
        loadingText.textContent = text[index];
        index++;
      }, 500);
    } else {
      clearInterval(Change);

      setTimeout(() => {
        zoomWrapper.classList.add("zoom-full");

        const isSignedIn = false;

        setTimeout(() => {
          if (isSignedIn) {
            loadingbox.classList.add("zoom-corner");
            setTimeout(() => {
              document.body.classList.add("fade-out");
              setTimeout(() => {
                window.location.href = "homepage.html";
              }, 1500);
            }, 1500);
          } else {
            loadingbox.classList.add("zoom-full");
            setTimeout(() => {
              document.body.classList.add("fade-out");
              setTimeout(() => {
                window.location.href = "homepage.html";
              }, 800);
            }, 1500);
          }
        }, 1000);
      }, 1000);
    }
  }, interval);
});
