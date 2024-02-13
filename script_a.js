const filter1 = new ol.filter.Colorize('invert');
const filter2 = new ol.filter.Colorize('customColorize');

function syncPanels() {
  document.getElementById("panel").style.width =
    appState.isPanelToggled ? "400px" : "0px";

  document.getElementById("settings").style.width =
    appState.isSettingsToggled ? "400px" : "0px";
}

function syncEventsSettings() {
  redPolygonLayer.setVisible(appState.isAlertsActive);
  orangePolygonLayer.setVisible(appState.isAlertsActive);
  yellowPolygonLayer.setVisible(appState.isAlertsActive);
  greyPolygonLayer.setVisible(appState.isAlertsActive);
  dayLongPolygonLayer.setVisible(appState.isDayLongAlertsActive);
  explosionPolygonLayer.setVisible(appState.isExplosionsActive);
  dangerPolygonLayer.setVisible(appState.isDangersActive);
  redMarkerLayer.setVisible(appState.isAlertsActive);
  orangeMarkerLayer.setVisible(appState.isAlertsActive);
  yellowMarkerLayer.setVisible(appState.isAlertsActive);
  greyMarkerLayer.setVisible(appState.isAlertsActive);
  dayLongMarkerLayer.setVisible(appState.isDayLongAlertsActive);
  dangerMarkerLayer.setVisible(appState.isDangersActive);
  explosionMarkerLayer.setVisible(appState.isExplosionsActive);
}

function syncColorScheme() {
  const isDarkModeActive = appState.colorScheme == "dark";

  filter1.setActive(isDarkModeActive);
  filter2.setActive(isDarkModeActive);

  document.getElementById("panel").style.backgroundColor =
    isDarkModeActive ? "rgb(26, 24, 44)" : "white";
  document.getElementById("settings").style.backgroundColor =
    isDarkModeActive ? "rgb(26, 24, 44)" : "white";

  const panelBlockItems = document.getElementsByClassName("panel_block");
  for (var i = 0; i < panelBlockItems.length; i++) {
    panelBlockItems[i].style.color = isDarkModeActive ? "whitesmoke" : "black";
  }

  const alertItems = document.getElementsByClassName("event_item");
  for (let i = 0; i < alertItems.length; i++) {
    const alertItem = alertItems[i];
    const alertItemClassList =
      Array.from(alertItem.classList).filter((x) => x != "dark_event_item");
    if (isDarkModeActive) alertItemClassList.push("dark_event_item");
    alertItem.setAttribute("class", alertItemClassList.join(" "));
  }
}

function syncMapProvider() {
  const layers = map.getAllLayers();
  switch (appState.mapProvider) {
    case "maptiler": {
      const isDarkModeActive = appState.colorScheme == "dark";
      layers[0].setVisible(false);
      layers[1].setVisible(false);
      layers[17].setVisible(!isDarkModeActive);
      layers[18].setVisible(!isDarkModeActive);
      layers[19].setVisible(isDarkModeActive);
      layers[20].setVisible(isDarkModeActive);
      break;
    }
    case "osm": {
      layers[0].setVisible(true);
      layers[1].setVisible(true);
      layers[17].setVisible(false);
      layers[18].setVisible(false);
      layers[19].setVisible(false);
      layers[20].setVisible(false);
      break;
    }
  }
}

function togglePanel() {
  appState.setIsPanelToggled(!appState.isPanelToggled);
  if (appState.isSettingsToggled) {
    appState.setIsSettingsToggled(!appState.isSettingsToggled);
  }
  syncPanels();
}

function toggleSettings() {
  appState.setIsSettingsToggled(!appState.isSettingsToggled);
  if (appState.isPanelToggled) {
    appState.setIsPanelToggled(!appState.isPanelToggled);
  }
  syncPanels();
}

function toggleDarkMode() {
  appState.setColorScheme(appState.colorScheme == "bright" ? "dark" : "bright");
  syncColorScheme();
}

function resetMapView() {
  view.animate({
    center: ol.proj.fromLonLat(defaultLonLat),
    duration: 500,
    zoom: defaultZoom,
  });
}

function toggleAlertsSwitch() {
  appState.setIsAlertsActive(document.getElementById("alerts_switch").checked);
  redPolygonLayer.setVisible(appState.isAlertsActive);
  orangePolygonLayer.setVisible(appState.isAlertsActive);
  yellowPolygonLayer.setVisible(appState.isAlertsActive);
  greyPolygonLayer.setVisible(appState.isAlertsActive);
  redMarkerLayer.setVisible(appState.isAlertsActive);
  orangeMarkerLayer.setVisible(appState.isAlertsActive);
  yellowMarkerLayer.setVisible(appState.isAlertsActive);
  greyMarkerLayer.setVisible(appState.isAlertsActive);
  const elements = document.getElementsByClassName("alert_event");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const classList = Array.from(element.classList).filter((x) => x != "hidden");
    if (!appState.isAlertsActive) classList.push("hidden");
    element.setAttribute("class", classList.join(" "));
  }
}

function toggleDangersSwitch() {
  appState.setIsDangersActive(document.getElementById("dangers_switch").checked);
  dangerPolygonLayer.setVisible(appState.isDangersActive);
  dangerMarkerLayer.setVisible(appState.isDangersActive);
  const elements = document.getElementsByClassName("danger_event");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const classList = Array.from(element.classList).filter((x) => x != "hidden");
    if (!appState.isDangersActive) classList.push("hidden");
    element.setAttribute("class", classList.join(" "));
  }
}

function toggleExplosionsSwitch() {
  appState.setIsExplosionsActive(document.getElementById("explosions_switch").checked);
  explosionPolygonLayer.setVisible(appState.isExplosionsActive);
  explosionMarkerLayer.setVisible(appState.isExplosionsActive);
  const elements = document.getElementsByClassName("explosion_event");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const classList = Array.from(element.classList).filter((x) => x != "hidden");
    if (!appState.isExplosionsActive) classList.push("hidden");
    element.setAttribute("class", classList.join(" "));
  }
}

function toggleDayLongAlertsSwitch() {
  appState.setIsDayLongAlertsActive(document.getElementById("day_long_alerts_switch").checked);
  dayLongPolygonLayer.setVisible(appState.isDayLongAlertsActive);
  dayLongMarkerLayer.setVisible(appState.isDayLongAlertsActive);
  const elements = document.getElementsByClassName("grey_event");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const classList = Array.from(element.classList).filter((x) => x != "hidden");
    if (!appState.isDayLongAlertsActive) classList.push("hidden");
    element.setAttribute("class", classList.join(" "));
  }
}

function buildPolygonLayer(color) {
  const polygonStyles = [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgba(168, 139, 167)",
        width: 1.5,
      }),
      fill: new ol.style.Fill({color: color}),
    }),
  ];
  return new ol.layer.Vector({
    zIndex: 1,
    source: new ol.source.Vector(),
    style: polygonStyles,
  });
}

function buildPolygonImageLayer(assetName, color) {
  const image = new Image();
  image.src = assetName;
  const fill = new ol.style.Fill({color: color});
  const stroke = new ol.style.Stroke({
    color: "rgba(168, 139, 167, 0.5)",
    width: 1.2,
   });
  return new ol.layer.Vector({
    zIndex: 1,
    source: new ol.source.Vector(),
    style: [
      new ol.style.Style({
        renderer: (pixelCoordinates, state) => {
          const context = state.context;
          const geometry = state.geometry.clone();
          geometry.setCoordinates(pixelCoordinates);

          context.save();
          const renderContext = ol.render.toContext(context, {pixelRatio: 1});
          renderContext.setFillStrokeStyle(fill, stroke);
          renderContext.drawGeometry(geometry);
          context.clip();

          const extent = geometry.getExtent();
          const bottomLeft = ol.extent.getBottomLeft(extent);
          context.drawImage(
            image,
            bottomLeft[0],
            bottomLeft[1],
            ol.extent.getWidth(extent),
            ol.extent.getHeight(extent),
          );
          context.restore();
        },
      }),
    ],
  });
}

function buildMarkerLayer(assetName) {
  return new ol.layer.Vector({
    zIndex: 1,
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      image: new ol.style.Icon({anchor: [0.5, 1.0], src: assetName}),
    })
  });
}


function onChangeColorScheme() {
  appState.setColorScheme(document.getElementById("color_scheme").value);
  syncColorScheme();
  syncMapProvider();
}

function onChangeMapProvider() {
  const bottomInfo =
    document.getElementsByClassName("ol-attribution")[0].childNodes[1];
  let statusText = null;
  if (bottomInfo.childNodes.length > 1) {
    statusText = bottomInfo.childNodes[1].innerText;
  }

  appState.setMapProvider(document.getElementById("map_provider").value);
  syncColorScheme();
  syncMapProvider();


  if (statusText != null) {
    setTimeout(function() {
      const placeSpan = document.createElement("li");
      placeSpan.innerText = statusText;
      bottomInfo.appendChild(placeSpan);
      bottomInfo.childNodes[0].style = "display: list-item";

      const newAttribution =
        document.getElementsByClassName("ol-attribution")[0];
      if (newAttribution.classList.contains("ol-collapsed")) {
        newAttribution.childNodes[0].click();
      }
    }, 100);
  }
}

function debounce(f, t) {
  let timeout;
  return (x) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => f(x), t);
  }
}

const onZoomChange = debounce(function (zoomValue) {
  appState.setZoom(zoomValue);
  rebuildFeatures(zoomValue);
}, 500);

const onLonLatChange = debounce(function (lonLatValue) {
  appState.setLonLat(lonLatValue);
}, 500);

const view = new ol.View({
  center: ol.proj.fromLonLat(appState.lonLat),
  zoom: appState.zoom,
});
view.on("change:resolution", function (event) {
  const zoom = view.getZoom();
  onZoomChange(zoom);
});
view.on("change:center", function (event) {
  const lonLat = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326'); 
  onLonLatChange(lonLat);
});

const mainLayer = new ol.layer.Tile({zIndex: 1, source: new ol.source.OSM()});
mainLayer.addFilter(filter1);
mainLayer.addFilter(filter2);

const backgroundLayer = new ol.layer.Tile({
  zIndex: 1,
  source: new ol.source.DataTile({
    loader: (z, x, y) => new Uint8Array(data.buffer),
  }),
});

backgroundLayer.addFilter(filter2);
backgroundLayer.addFilter(filter1);

const polygonUaLayer = new ol.layer.Vector({
  zIndex: 1,
  source: new ol.source.Vector(),
  style: [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgb(168, 139, 167)",
        width: 3.0,
      }),
    }),
  ],
});

const redPolygonLayer = buildPolygonLayer("rgba(241, 70, 80, 0.28)");
const orangePolygonLayer = buildPolygonLayer("rgba(255, 150, 48, 0.28)");
const yellowPolygonLayer = buildPolygonLayer("rgba(255, 222, 48, 0.28)");
const greyPolygonLayer = buildPolygonLayer("rgba(168, 168, 168, 0.28)");
const dayLongPolygonLayer = buildPolygonLayer("rgba(168, 168, 168, 0.28)");
const dangerPolygonLayer = buildPolygonImageLayer("danger_background.png", "rgba(255, 212, 42, 0.05)");
const explosionPolygonLayer = buildPolygonImageLayer("explosion_background.png", "rgba(255, 42, 50, 0.05)");
const redMarkerLayer = buildMarkerLayer("marker_red.png");
const orangeMarkerLayer = buildMarkerLayer("marker_orange.png");
const yellowMarkerLayer = buildMarkerLayer("marker_yellow.png");
const greyMarkerLayer = buildMarkerLayer("marker_grey.png");
const dayLongMarkerLayer = buildMarkerLayer("marker_grey.png");
const dangerMarkerLayer = buildMarkerLayer("danger.png");
const explosionMarkerLayer = buildMarkerLayer("explosion.png");

const map = new ol.Map({
  target: "map",
  layers: [
    backgroundLayer,
    mainLayer,
    polygonUaLayer,
    redPolygonLayer,
    orangePolygonLayer,
    yellowPolygonLayer,
    greyPolygonLayer,
    dayLongPolygonLayer,
    dangerPolygonLayer,
    explosionPolygonLayer,
    redMarkerLayer,
    orangeMarkerLayer,
    yellowMarkerLayer,
    greyMarkerLayer,
    dayLongMarkerLayer,
    dangerMarkerLayer,
    explosionMarkerLayer,
  ],
  view: view,
});


function setSettingsValuesFromAppState() {
  document.getElementById("color_scheme").value = appState.colorScheme;
  document.getElementById("map_provider").value = appState.mapProvider;

  document.getElementById("alerts_switch").checked = appState.isAlertsActive;
  document.getElementById("dangers_switch").checked = appState.isDangersActive;
  document.getElementById("explosions_switch").checked = appState.isExplosionsActive;
  document.getElementById("day_long_alerts_switch").checked = appState.isDayLongAlertsActive;

  syncPanels();
  syncEventsSettings();
  syncColorScheme();
  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function(event) {
      appState.setColorScheme(event.matches ? "dark" : "bright");
      document.getElementById("color_scheme").value = appState.colorScheme;
      syncColorScheme();
      syncMapProvider();
    });

  view.animate({
    center: ol.proj.fromLonLat(appState.lonLat),
    duration: 500,
    zoom: appState.zoom,
  });
}

async function initMapLayers() {
  await olms.apply(map, atob("aHR0cHM6Ly9hcGkubWFwdGlsZXIuY29tL21hcHMvMjU3MmQzNTEtYTJkMy00NDEzLTgxNzItMzQ0M2ExMzhhNDYzL3N0eWxlLmpzb24/a2V5PXNMZWtRZXltTkNUZURkbTFta1A0")).then(async function (_map) {
    await olms.apply(map, atob("aHR0cHM6Ly9hcGkubWFwdGlsZXIuY29tL21hcHMvMjNmYzc1OWItZmYwYy00ZTc4LWIyNGEtYzYwYWFkNWRmMTg3L3N0eWxlLmpzb24/a2V5PXNMZWtRZXltTkNUZURkbTFta1A0")).then(function (__map) {
      const layers = map.getAllLayers();
      for (var i = layers.length - 1; i >= layers.length - 4; i--) {
        layers[i].setVisible(false);
      }
      syncMapProvider();

      setTimeout(function() {
        const bottomInfo = document.getElementsByClassName("ol-attribution")[0];
        if (bottomInfo.classList.contains("ol-collapsed")) {
          bottomInfo.childNodes[0].click();
        }
      }, 100);
    });
  });
}
