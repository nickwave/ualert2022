(async () => { 
  initAppState();
  setSettingsValuesFromAppState();
  await initMapLayers();
  await loadGeojson();
  await initEventSource();
})();
