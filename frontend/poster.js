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
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const totalDuration = 6000;
  const interval = 250;
  const count = Math.floor(totalDuration / interval);
  let posters = [];

  let i = 0;
  const appearInterval = setInterval(() => {
    if (i >= count) {
      clearInterval(appearInterval);
      fadeOutPosters();
      return;
    }
    const img = document.createElement("img");
    img.src = posterImages[Math.floor(Math.random() * posterImages.length)];
    img.classList.add("poster");

    const x = Math.random() * (screenWidth - 100);
    const y = Math.random() * (screenHeight - 150);

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    posterWall.appendChild(img);
    posters.push(img);

    requestAnimationFrame(() => {
      img.classList.add("show");
    });

    i++;
  }, interval);

  function fadeOutPosters() {
    posters.forEach((poster, idx) => {
      setTimeout(() => {
        poster.classList.remove("show");
        poster.classList.add("fade-out");
      }, idx * 50);
    });
    setTimeout(() => {
      posterWall.remove();
      document.body.classList.add("reveal");
    }, posters.length * 50 + 1500);
  }
});
