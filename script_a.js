const defaultLonLat = [32.0, 49.0];
const defaultZoom = 6.0;
const filter1 = new ol.filter.Colorize('invert');
const filter2 = new ol.filter.Colorize('customColorize');

function syncPanel() {
  document.getElementById("panel").style.width =
    isPanelToggled ? "400px" : "0px";
}

function syncSettingsPanel() {
  document.getElementById("settings").style.width =
    isSettingsToggled ? "400px" : "0px";
}

function syncSettingsValues() {
  redPolygonLayer.setVisible(isAlertsActive);
  orangePolygonLayer.setVisible(isAlertsActive);
  yellowPolygonLayer.setVisible(isAlertsActive);
  greyPolygonLayer.setVisible(isAlertsActive);
  dayLongPolygonLayer.setVisible(isAlertsActive);
  explosionPolygonLayer.setVisible(isExplosionsActive);
  dangerPolygonLayer.setVisible(isDangersActive);
  redMarkerLayer.setVisible(isAlertsActive);
  orangeMarkerLayer.setVisible(isAlertsActive);
  yellowMarkerLayer.setVisible(isAlertsActive);
  greyMarkerLayer.setVisible(isAlertsActive);
  dayLongMarkerLayer.setVisible(isAlertsActive);
  dangerMarkerLayer.setVisible(isDangersActive);
  explosionMarkerLayer.setVisible(isExplosionsActive);
}

function syncDarkMode() {
  filter1.setActive(isActiveDarkMode);
  filter2.setActive(isActiveDarkMode);

  document.getElementById("panel").style.backgroundColor =
    isActiveDarkMode ? "rgb(26, 24, 44)" : "white";
  document.getElementById("settings").style.backgroundColor =
    isActiveDarkMode ? "rgb(26, 24, 44)" : "white";
  document.getElementsByClassName("panel_block")[0].style.color =
    isActiveDarkMode ? "whitesmoke" : "black";
  document.getElementsByClassName("panel_block")[1].style.color =
    isActiveDarkMode ? "whitesmoke" : "black";

  const alertItems = document.getElementsByClassName("event_item");
  for (let i = 0; i < alertItems.length; i++) {
    const alertItem = alertItems[i];
    const alertItemClassList =
      Array.from(alertItem.classList).filter((x) => x != "dark_event_item");
    if (isActiveDarkMode) alertItemClassList.push("dark_event_item");
    alertItem.setAttribute("class", alertItemClassList.join(" "));
  }
}

function togglePanel() {
  toggleIsPanelToggled();
  if (isSettingsToggled) {
    toggleIsSettingsToggled();
  }
  syncPanel();
  syncSettingsPanel();
}

function toggleSettings() {
  toggleIsSettingsToggled();
  if (isPanelToggled) {
    toggleIsPanelToggled();
  }
  syncPanel();
  syncSettingsPanel();
}

function toggleDarkMode() {
  toggleIsActiveDarkMode();
  syncDarkMode();
}

function resetMapView() {
  view.animate({
    center: ol.proj.fromLonLat(defaultLonLat),
    duration: 500,
    zoom: defaultZoom,
  });
}

function toggleAlertsSwitch() {
  toggleIsAlertsActive(alerts_switch.checked);
  redPolygonLayer.setVisible(isAlertsActive);
  orangePolygonLayer.setVisible(isAlertsActive);
  yellowPolygonLayer.setVisible(isAlertsActive);
  greyPolygonLayer.setVisible(isAlertsActive);
  dayLongPolygonLayer.setVisible(isAlertsActive);
  redMarkerLayer.setVisible(isAlertsActive);
  orangeMarkerLayer.setVisible(isAlertsActive);
  yellowMarkerLayer.setVisible(isAlertsActive);
  greyMarkerLayer.setVisible(isAlertsActive);
  const elements = document.getElementsByClassName("alert_event");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const classList = Array.from(element.classList).filter((x) => x != "hidden");
    if (!isAlertsActive) classList.push("hidden");
    element.setAttribute("class", classList.join(" "));
  }
}

function toggleDangersSwitch() {
  toggleIsDangersActive(dangers_switch.checked);
  dangerPolygonLayer.setVisible(isDangersActive);
  dangerMarkerLayer.setVisible(isDangersActive);
  const elements = document.getElementsByClassName("danger_event");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const classList = Array.from(element.classList).filter((x) => x != "hidden");
    if (!isDangersActive) classList.push("hidden");
    element.setAttribute("class", classList.join(" "));
  }
}

function toggleExplosionsSwitch() {
  toggleIsExplosionsActive(explosions_switch.checked);
  explosionPolygonLayer.setVisible(isExplosionsActive);
  explosionMarkerLayer.setVisible(isExplosionsActive);
  const elements = document.getElementsByClassName("explosion_event");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const classList = Array.from(element.classList).filter((x) => x != "hidden");
    if (!isExplosionsActive) classList.push("hidden");
    element.setAttribute("class", classList.join(" "));
  }
}

function toggleDayLongAlertsSwitch() {
  toggleIsDayLongAlertsActive(day_long_alerts_switch.checked);
  dayLongPolygonLayer.setVisible(isDayLongAlertsActive);
  dayLongMarkerLayer.setVisible(isDayLongAlertsActive);
  const elements = document.getElementsByClassName("grey_event");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const classList = Array.from(element.classList).filter((x) => x != "hidden");
    if (!isDayLongAlertsActive) classList.push("hidden");
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
  const polygonLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: polygonStyles,
  });
  return polygonLayer;
}

function buildPolygonImageLayer(assetName) {
  const fill = new ol.style.Fill();
  const stroke = new ol.style.Stroke();
  const image = new Image();
  image.src = assetName;
  const polygonLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    opacity: 0.28,
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
  return polygonLayer;
}

function buildMarkerLayer(assetName) {
  return new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      image: new ol.style.Icon({anchor: [0.5, 1.0], src: assetName}),
    })
  });
}

syncPanel();
syncSettingsPanel();
syncDarkMode();
window.matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", event => {
    if (isActiveDarkModeUndefined()) {
      isActiveDarkMode = event.matches;
      syncDarkMode();
    }
  });

const view = new ol.View({
  center: ol.proj.fromLonLat(defaultLonLat),
  zoom: defaultZoom,
});

const mainLayer = new ol.layer.Tile({source: new ol.source.OSM()});
mainLayer.addFilter(filter1);
mainLayer.addFilter(filter2);

const backgroundLayer = new ol.layer.Tile({
  source: new ol.source.DataTile({
    loader: (z, x, y) => new Uint8Array(data.buffer),
  }),
});
// const backgroundLayer = new ol.layer.Vector({
//   source: new ol.source.Vector({
//     features: [new ol.Feature({
//       geometry: new ol.geom.Polygon(
//         [[[-180, 90], [180, 90], [180, -90], [-180, -90]]],
//       ),
//     })],
//   }),
// });
backgroundLayer.addFilter(filter2);
backgroundLayer.addFilter(filter1);

const polygonUaLayer = new ol.layer.Vector({
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
const dangerPolygonLayer = buildPolygonImageLayer("danger_background.png");
const explosionPolygonLayer = buildPolygonImageLayer("explosion_background.png");
const redMarkerLayer = buildMarkerLayer("marker_red.png");
const orangeMarkerLayer = buildMarkerLayer("marker_orange.png");
const yellowMarkerLayer = buildMarkerLayer("marker_yellow.png");
const greyMarkerLayer = buildMarkerLayer("marker_grey.png");
const dayLongMarkerLayer = buildMarkerLayer("marker_grey.png");
const dangerMarkerLayer = buildMarkerLayer("danger.png");
const explosionMarkerLayer = buildMarkerLayer("explosion.png");

syncSettingsValues();

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
