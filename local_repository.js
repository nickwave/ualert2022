let isPanelToggled = false;
let isSettingsToggled = false;
let isActiveDarkMode = false;
let isAlertsActive = true;
let isDangersActive = false;
let isExplosionsActive = false;
let IsDayLongAlertsActive = false;

function toggleIsPanelToggled() {
  isPanelToggled = !isPanelToggled;
  localStorage.setItem("isPanelToggled", isPanelToggled);
}

function toggleIsSettingsToggled() {
  isSettingsToggled = !isSettingsToggled;
  localStorage.setItem("isSettingsToggled", isSettingsToggled);
}

function toggleIsActiveDarkMode() {
  isActiveDarkMode = !isActiveDarkMode;
  localStorage.setItem("isActiveDarkMode", isActiveDarkMode);
}

function toggleIsAlertsActive(value) {
  isAlertsActive = value;
  localStorage.setItem("isAlertsActive", isAlertsActive);
}

function toggleIsDangersActive(value) {
  isDangersActive = value;
  localStorage.setItem("isDangersActive", isDangersActive);
}

function toggleIsExplosionsActive(value) {
  isExplosionsActive = value;
  localStorage.setItem("isExplosionsActive", isExplosionsActive);
}

function toggleIsDayLongAlertsActive(value) {
  isDayLongAlertsActive = value;
  localStorage.setItem("isDayLongAlertsActive", isDayLongAlertsActive);
}

function isActiveDarkModeUndefined() {
  return localStorage.getItem("isActiveDarkMode") == null;
}

function initLocalRepository() {
  isPanelToggled = localStorage.getItem("isPanelToggled") == "true";
  isSettingsToggled = localStorage.getItem("isSettingsToggled") == "true";
  isAlertsActive = localStorage.getItem("isAlertsActive") == undefined
    ? true
    : localStorage.getItem("isAlertsActive") == "true";
  isDangersActive = localStorage.getItem("isDangersActive") == undefined
    ? false
    : localStorage.getItem("isDangersActive") == "true";
  isExplosionsActive = localStorage.getItem("isExplosionsActive") == undefined
    ? false
    : localStorage.getItem("isExplosionsActive") == "true";
  isDayLongAlertsActive = localStorage.getItem("isDayLongAlertsActive") == undefined
    ? false
    : localStorage.getItem("isDayLongAlertsActive") == "true";

  isActiveDarkMode = localStorage.getItem("isActiveDarkMode");
  if (isActiveDarkMode == "true" || isActiveDarkMode == "false") {
    isActiveDarkMode = isActiveDarkMode == "true";
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isActiveDarkMode = true;
  } else {
    isActiveDarkMode = false;
  }
}

initLocalRepository();
