const mode = document.getElementById("mode");

if (mode) {
  mode.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      mode.innerHTML = "☀️";
    } else {
      mode.innerHTML = "🌙";
    }
  };
}

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.hash !== "") {
      e.preventDefault();
      document.querySelector(this.hash).scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}