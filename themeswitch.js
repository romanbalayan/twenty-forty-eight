document.addEventListener("DOMContentLoaded", function () {
  var prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  var darkMode = localStorage.getItem("dark-mode");

  if (darkMode == null) {
    if (prefersDark) {
      document.querySelector("#checkbox").checked = true;
      document.querySelector("body").classList.add("dark");
      localStorage.setItem("dark-mode", "enabled");
    } else {
      localStorage.setItem("dark-mode", "disabled");
    }
  } else {
    if (darkMode === "enabled") {
      document.querySelector("#checkbox").checked = true;
      document.querySelector("body").classList.add("dark");
    }
  }

  document.querySelector("#checkbox").addEventListener("change", () => {
    darkMode = localStorage.getItem("dark-mode");
    if (darkMode === "disabled") {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });
});

// --------------------------------------------------------------------
// Dark Mode Toggle
// --------------------------------------------------------------------
var enableDarkMode = () => {
  document.querySelector("body").classList.toggle("dark");
  localStorage.setItem("dark-mode", "enabled");
};

var disableDarkMode = () => {
  document.querySelector("body").classList.toggle("dark");
  localStorage.setItem("dark-mode", "disabled");
};
