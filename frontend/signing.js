document.addEventListener("DOMContentLoaded", () => {
  const isSignedIn = true;
  const popup = document.getElementById("popup-button");
  const signInBtn = document.getElementById("signInBtn");
  const stayLoggedOutBtn = document.getElementById("stayLoggedOutBtn");
  const loginBtn = document.getElementById("existing-account-button");
  if (!isSignedIn) {
    popup.style.display = "flex";
  }
  signInBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
  stayLoggedOutBtn.addEventListener("click", () => {
    popup.style.display = "main.html";
  });
  loginBtn.addEventListener("click", () => {
    window.location.href = "main.html";
  });
});
