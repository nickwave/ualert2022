function buildAlertComponent(event) {
  const alertComponent = document.createElement("div");
  const alertComponentClassList = [
    "event_item",
    event.color + "_event",
    event.event + "_event",
  ];
  if (isActiveDarkMode) alertComponentClassList.push("dark_event_item");
  switch(event.event) {
    case "alert": {
      if(!isAlertsActive) alertComponentClassList.push("hidden"); break;
    }
    case "danger": {
      if(!isDangersActive) alertComponentClassList.push("hidden"); break;
    }
    case "explosion": {
      if(!isExplosionsActive) alertComponentClassList.push("hidden"); break;
    }
  }
  alertComponent.setAttribute("class", alertComponentClassList.join(" "));
  alertComponent.onclick = () => {
    view.animate({
      center: ol.proj.fromLonLat([event.lon, event.lat]),
      duration: 500,
      zoom: event.place.includes("область") || event.place == "Автономна Республіка Крим"
        ? 8
        : event.place.includes("район") || event.place == "Київ"
          ? 9.5
          : Math.max(11, view.getZoom()),
    });
  };

  const timeSpan = document.createElement("span");
  const time = new Date(event.date);
  let hours = time.getHours();
  let minutes = time.getMinutes();
  hours = (hours < 10 ? "0" : "") + hours;
  minutes = (minutes < 10 ? "0" : "") + minutes;
  timeSpan.innerText = hours + ":" + minutes;
  alertComponent.appendChild(timeSpan);

  const placeSpan = document.createElement("span");
  placeSpan.innerText = event.place;
  alertComponent.appendChild(placeSpan);

  if (event.event != "alert") {
    const eventIcon = document.createElement("img");
    eventIcon.setAttribute("src", event.event + ".png");
    alertComponent.appendChild(eventIcon);
  }

  return alertComponent;
}

function polygonsContains(polygonNameQuery) {
  for (const regionName in regions)
    for (const regionIndex in regions[regionName])
      if (regions[regionName][regionIndex] == polygonNameQuery) return true;
  return false;
}

function processHolePolygons(polygonName, polygon, events) {
  for (const regionName in regions) {
    if (regionName == polygonName) {
      for (let i in events) {
        const event = events[i];
        if (event.event == "alert" &&
            regions[regionName].includes(event.place) &&
            regionName != event.place) {
          const childPolygon = polygons[event.place];
          for (var j = 0; j < childPolygon.length; j++) {
            polygon.push(childPolygon[j]);
          }
        }
      }
      break;
    }
  }
}

function processEventLatLon(event, events) {
  for (let i = 0; i < events.length; i++) {
    const event_i = events[i];
    if (event_i.place == event.place && event_i != event) {
      event_i.lon += 0.015;
      break;
    }
  }
}

function alertsHandler(event) {
  const events = JSON.parse(event.data);
  const alertsComponents = [];
  const redMarkerList = [];
  const orangeMarkerList = [];
  const yellowMarkerList = [];
  const greyMarkerList = [];
  const dayLongMarkerList = [];
  const dangerMarkerList = [];
  const explosionMarkerList = [];
  const redFeatureList = [];
  const orangeFeatureList = [];
  const yellowFeatureList = [];
  const greyFeatureList = [];
  const dayLongFeatureList = [];
  const dangerFeatureList = [];
  const explosionFeatureList = [];

  for (let i in events) {
    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in one day
    const isDayLongEvent = ((new Date - new Date(event.date)) / oneDay) > 1;

    const event = events[i];
    alertsComponents.push(buildAlertComponent(event));
    if (polygonsContains(event.place)) {
      const polygon = Array.from(polygons[event.place]);
      processHolePolygons(event.place, polygon, events);
      const feature = new ol.Feature({
        geometry: new ol.geom.Polygon(polygon)
      });
      feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
      if (event.event == "alert") {
        switch (event.color) {
          case "red": redFeatureList.push(feature); break;
          case "orange": orangeFeatureList.push(feature); break;
          case "yellow": yellowFeatureList.push(feature); break;
          case "grey": {
            if (isDayLongEvent) dayLongFeatureList.push(feature); 
            else greyFeatureList.push(feature);
            break;
          }
        }
      } else if (event.event == "danger") {
        dangerFeatureList.push(feature);
      } else if (event.event == "explosion") {
        explosionFeatureList.push(feature);
      }
    } else {
      processEventLatLon(event, events);
      const marker = new ol.Feature(
        new ol.geom.Point(ol.proj.fromLonLat([event.lon, event.lat])),
      );
      if (event.event == "alert") {
        switch (event.color) {
          case "red": redMarkerList.push(marker); break;
          case "orange": orangeMarkerList.push(marker); break;
          case "yellow": yellowMarkerList.push(marker); break;
          case "grey": {
            if (isDayLongEvent) dayLongMarkerList.push(marker); 
            else greyMarkerList.push(marker);
            break;
          }
        }
      } else if (event.event == "danger") {
        dangerMarkerList.push(marker);
      } else if (event.event == "explosion") {
        explosionMarkerList.push(marker);
      }
    }
  }

  const alertsListDiv = document.getElementById("events_list");
  alertsListDiv.innerHTML = "";
  for (let i = alertsComponents.length - 1; i >= 0; i--) {
    alertsListDiv.appendChild(alertsComponents[i]);
  }

  redMarkerLayer.getSource().clear();
  orangeMarkerLayer.getSource().clear();
  yellowMarkerLayer.getSource().clear();
  greyMarkerLayer.getSource().clear();
  dangerMarkerLayer.getSource().clear();
  explosionMarkerLayer.getSource().clear();
  redPolygonLayer.getSource().clear();
  orangePolygonLayer.getSource().clear();
  yellowPolygonLayer.getSource().clear();
  greyPolygonLayer.getSource().clear();
  dayLongPolygonLayer.getSource().clear();
  dangerPolygonLayer.getSource().clear();
  explosionPolygonLayer.getSource().clear();

  redMarkerLayer.getSource().addFeatures(redMarkerList);
  orangeMarkerLayer.getSource().addFeatures(orangeMarkerList);
  yellowMarkerLayer.getSource().addFeatures(yellowMarkerList);
  greyMarkerLayer.getSource().addFeatures(greyMarkerList);
  dayLongMarkerLayer.getSource().addFeatures(dayLongMarkerList);
  dangerMarkerLayer.getSource().addFeatures(dangerMarkerList);
  explosionMarkerLayer.getSource().addFeatures(explosionMarkerList);
  redPolygonLayer.getSource().addFeatures(redFeatureList);
  orangePolygonLayer.getSource().addFeatures(orangeFeatureList);
  yellowPolygonLayer.getSource().addFeatures(yellowFeatureList);
  greyPolygonLayer.getSource().addFeatures(greyFeatureList);
  dayLongPolygonLayer.getSource().addFeatures(dayLongFeatureList);
  dangerPolygonLayer.getSource().addFeatures(dangerFeatureList);
  explosionPolygonLayer.getSource().addFeatures(explosionFeatureList);
}

function changeStatusText(text) {
  const bottomInfo =
    document.getElementsByClassName("ol-attribution")[0].childNodes[1];
  if (bottomInfo.childNodes.length == 1) {
    bottomInfo.childNodes[0].style = "display: list-item";
    const placeSpan = document.createElement("li");
    placeSpan.innerText = text;
    bottomInfo.appendChild(placeSpan);
  } else if (bottomInfo.childNodes.length > 1) {
    bottomInfo.childNodes[1].innerText = text;
  }
}

function statusHandler(event) {
  const date = new Date(event.data);
  const datetime = date.getFullYear()
    + ((date.getMonth() + 1) < 10 ? "-0" : "-") + (date.getMonth() + 1)
    + (date.getDate() < 10 ? "-0" : "-") + date.getDate()
    + " " + date.toTimeString().substring(0, 8);
  changeStatusText("Connection is active | " + datetime);
}

function errorHandler(event) {
  changeStatusText("Connection is not available");
  eventSource.close();
  window.setTimeout(initEventSource, 1000*5);
}

function initEventSource() {
  eventSource = new EventSource("https://3bc16b24-5d97-4553-8289-2adeda3ae2e1.pub.instances.scw.cloud/data", {withCredentials: true});
  eventSource.addEventListener("alerts", alertsHandler);
  eventSource.addEventListener("status", statusHandler);
  eventSource.addEventListener("error", errorHandler);
}

let eventSource = null;

loadGeojson().then(initEventSource);

window.addEventListener("beforeunload", () => {
  if (eventSource != null) eventSource.close();
});
