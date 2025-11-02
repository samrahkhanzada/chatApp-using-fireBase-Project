const themeToggle = document.getElementById("themeToggle");
const themeSelector = document.getElementById("themeSelector");

// Toggle theme
themeToggle.addEventListener("click", function () {
  themeSelector.classList.toggle("show");
});

// Close theme
document.addEventListener("click", function (event) {
  if (
    !themeToggle.contains(event.target) &&
    !themeSelector.contains(event.target)
  ) {
    themeSelector.classList.remove("show");
  }
});

// message-conatiner color and theme
document.getElementById("light").addEventListener("click", () => {
  let msgCont = document.getElementById("messagesContainer");
  msgCont.style.background =
    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
  msgCont.style.color = "black";
  msgCont.style.border = "1px solid #cbd5e1";
});
document.getElementById("dark").addEventListener("click", () => {
  let msgCont = document.getElementById("messagesContainer");
  msgCont.style.background =
    "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
  msgCont.style.color = "white";
  msgCont.style.border = "1px solid #334155";
});
document.getElementById("theme-1").addEventListener("click", () => {
  let msgCont = document.getElementById("messagesContainer");
  msgCont.style.background = "url('./theme01.jpg') center/cover";
});
document.getElementById("theme-2").addEventListener("click", () => {
  let msgCont = document.getElementById("messagesContainer");
  msgCont.style.background = "url('./theme2.jpg') center/cover";
});
document.getElementById("theme-3").addEventListener("click", () => {
  let msgCont = document.getElementById("messagesContainer");
  msgCont.style.background = "url('./theme3.jpg') center/cover";
});
document.getElementById("theme-4").addEventListener("click", () => {
  let msgCont = document.getElementById("messagesContainer");
  msgCont.style.background = "url('./theme4.png') center/cover";
});
