document.addEventListener("DOMContentLoaded", () => {
  const posterWall = document.querySelector(".poster-wall");

  const posterImages = [
    "posters/poster1.jpg",
    "posters/poster2.jpg",
    "posters/poster3.jpg",
    "posters/poster4.jpg",
    "posters/poster5.jpg",
    "posters/poster6.jpg",
  ];
  const wallWidth = posterWall.offsetWidth;
  const wallHeight = posterWall.offsetHeight;
  const interval = 300;
  let i = 0;

  const appearPosters = setInterval(() => {
    if (i >= posterImages.length) {
      clearInterval(appearPosters);
      setTimeout(showPopup, 1000);
      return;
    }
    const img = document.createElement("img");
    img.src = posterImages[i];
    img.classList.add("poster");

    const x = Math.random() * (wallWidth - 120);
    const y = Math.random() * (wallHeight - 160);

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    posterWall.appendChild(img);

    requestAnimationFrame(() => {
      img.classList.add("show");
    });

    i++;
  }, interval);
  function showPopup() {
    const popup = document.createElement("div");
    popup.classList.add("popup-box");
    popup.innerText = "Make a group and turn on your TV?";
    document.body.appendChild(popup);
  }
});
