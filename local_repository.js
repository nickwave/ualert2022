const defaultLonLat = [32.0, 49.0];
const defaultZoom = 6.0;

const appState = {
  lonLat: defaultLonLat,
  zoom: defaultZoom,

  colorScheme: "bright",
  mapProvider: "maptiler",

  isPanelToggled: false,
  isSettingsToggled: false,

  isAlertsActive: true,
  isDangersActive: false,
  isExplosionsActive: false,
  isDayLongAlertsActive: false,

  setLonLat: function (value) {
    this.lonLat = typeof(value[0]) != "NaN" ? value : defaultLonLat;
    localStorage.setItem("lonLat", this.lonLat);
  },

  setZoom: function (value) {
    this.zoom = value;
    localStorage.setItem("zoom", this.zoom);
  },

  setColorScheme: function (value) {
    this.colorScheme = value;
    localStorage.setItem("colorScheme", this.colorScheme);
  },

  setMapProvider: function (value) {
    this.mapProvider = value;
    localStorage.setItem("mapProvider", this.mapProvider);
  },

  setIsPanelToggled: function (value) {
    this.isPanelToggled = value;
    localStorage.setItem("isPanelToggled", this.isPanelToggled);
  },

  setIsSettingsToggled: function (value) {
    this.isSettingsToggled = value;
    localStorage.setItem("isSettingsToggled", this.isSettingsToggled);
  },

  setIsAlertsActive: function (value) {
    this.isAlertsActive = value;
    localStorage.setItem("isAlertsActive", this.isAlertsActive);
  },

  setIsDangersActive: function (value) {
    this.isDangersActive = value;
    localStorage.setItem("isDangersActive", this.isDangersActive);
  },

  setIsExplosionsActive: function (value) {
    this.isExplosionsActive = value;
    localStorage.setItem("isExplosionsActive", this.isExplosionsActive);
  },

  setIsDayLongAlertsActive: function (value) {
    this.isDayLongAlertsActive = value;
    localStorage.setItem("isDayLongAlertsActive", this.isDayLongAlertsActive);
  },
};

function serializeToUrlParams() {
  const version = "1";
  let settings_1 = 0x00000000;
  if (appState.colorScheme == "bright"  ) settings_1 += 0x10000000;
  if (appState.mapProvider == "maptiler") settings_1 += 0x01000000;
  if (appState.isPanelToggled           ) settings_1 += 0x00100000;
  if (appState.isSettingsToggled        ) settings_1 += 0x00010000;
  if (appState.isAlertsActive           ) settings_1 += 0x00001000;
  if (appState.isDangersActive          ) settings_1 += 0x00000100;
  if (appState.isExplosionsActive       ) settings_1 += 0x00000010;
  if (appState.isDayLongAlertsActive    ) settings_1 += 0x00000001;

  const serialized = [
    version,
    parseInt(appState.lonLat[0] * 10000).toString(32),
    parseInt(appState.lonLat[1] * 10000).toString(32),
    parseInt(appState.zoom      * 10000).toString(32),
    settings_1.toString(32),
  ].join(";");

  const url = window.location.pathname + '?s=' + serialized;
  history.pushState(null, '', url);
  // window.location.reload();
}

function deserializeFromUrlParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const serialized = searchParams.get("s").split(";");
  const version = serialized[0];
  if (version == "1") {
    appState.setLonLat([
      parseInt(serialized[1], 32) / 10000,
      parseInt(serialized[2], 32) / 10000,
    ]);
    appState.setZoom(parseInt(serialized[3], 32) / 10000);
    const settings_1 = parseInt(serialized[4], 32);
    appState.setColorScheme((settings_1           & 0x10000000) != 0 ? "bright" : "dark");
    appState.setMapProvider((settings_1           & 0x01000000) != 0 ? "maptiler" : "osm");
    appState.setIsPanelToggled((settings_1        & 0x00100000) != 0);
    appState.setIsSettingsToggled((settings_1     & 0x00010000) != 0);
    appState.setIsAlertsActive((settings_1        & 0x00001000) != 0);
    appState.setIsDangersActive((settings_1       & 0x00000100) != 0);
    appState.setIsExplosionsActive((settings_1    & 0x00000010) != 0);
    appState.setIsDayLongAlertsActive((settings_1 & 0x00000001) != 0);
  }
}

function initAppState() {
  if (window.location.search != "") {
    deserializeFromUrlParams();
    return;
  }

  const lonLat = localStorage.getItem("lonLat");
  if (lonLat != undefined && !lonLat.includes("NaN")) {
    appState.setLonLat(lonLat.split(","));
  } else {
    appState.setLonLat(defaultLonLat);
  }

  const zoom = localStorage.getItem("zoom");
  if (zoom != undefined) {
    appState.setZoom(zoom);
  } else {
    appState.setZoom(defaultZoom);
  }

  const colorScheme = localStorage.getItem("colorScheme");
  if (colorScheme != undefined) {
    appState.setColorScheme(colorScheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    appState.setColorScheme("dark");
  } else {
    appState.setColorScheme("bright");
  }

  const mapProvider = localStorage.getItem("mapProvider");
  if (mapProvider != undefined) {
    appState.setMapProvider(mapProvider);
  } else {
    appState.setMapProvider("maptiler");
  }

  const isPanelToggled = localStorage.getItem("isPanelToggled");
  if (isPanelToggled != undefined) {
    appState.setIsPanelToggled(isPanelToggled == "true");
  } else {
    appState.setIsPanelToggled(false);
  }

  const isSettingsToggled = localStorage.getItem("isSettingsToggled");
  if (isSettingsToggled != undefined) {
    appState.setIsSettingsToggled(isSettingsToggled == "true");
  } else {
    appState.setIsSettingsToggled(false);
  }

  const isAlertsActive = localStorage.getItem("isAlertsActive");
  if (isAlertsActive != undefined) {
    appState.setIsAlertsActive(isAlertsActive == "true");
  } else {
    appState.setIsAlertsActive(true);
  }

  const isDangersActive = localStorage.getItem("isDangersActive");
  if (isDangersActive != undefined) {
    appState.setIsDangersActive(isDangersActive == "true");
  } else {
    appState.setIsDangersActive(false);
  }

  const isExplosionsActive = localStorage.getItem("isExplosionsActive");
  if (isExplosionsActive != undefined) {
    appState.setIsExplosionsActive(isExplosionsActive == "true");
  } else {
    appState.setIsExplosionsActive(false);
  }

  const isDayLongAlertsActive = localStorage.getItem("isDayLongAlertsActive");
  if (isDayLongAlertsActive != undefined) {
    appState.setIsDayLongAlertsActive(isDayLongAlertsActive == "true");
  } else {
    appState.setIsDayLongAlertsActive(false);
  }
}
