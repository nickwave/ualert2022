const polygons = {};
const regions = {
  "Чернігівська область": ['Корюківський район', 'Прилуцький район', 'Новгород-Сіверський район', 'Чернігівська область', 'Ніжинський район', 'Чернігівський район'],
  "Львівська область": ['Львівська область', 'Яворівський район', 'Золочівський район', 'Львівський район', 'Дрогобицький район', 'Самбірський район', 'Стрийський район', 'Червоноградський район'],
  "Хмельницька область": ['Шепетівський район', 'Хмельницький район', 'Кам’янець-Подільський район', 'Хмельницька область'],
  "Херсонська область": ['Херсонський район', 'Херсонська область', 'Генічеський район', 'Бериславський район', 'Каховський район', 'Скадовський район'],
  "Одеська область": ['Роздільнянський район', 'Подільський район', 'Березівський район', 'Одеський район', 'Ізмаїльський район', 'Одеська область', 'Болградський район', 'Білгород-Дністровський район'],
  "Київ": ['Київ'],
  "Київська область": ['Обухівський район', 'Білоцерківський район', 'Бориспільський район', 'Броварський район', 'Вишгородський район', 'Київська область', 'Фастівський район', 'Бучанський район'],
  "Донецька область": ['Волноваський район', 'Донецька область', 'Бахмутський район', 'Краматорський район', 'Маріупольський район', 'Покровський район'],
  "Чернівецька область": ['Вижницький район', 'Чернівецька область', 'Чернівецький район', 'Дністровський район'],
  "Волинська область": ['Володимирський район', 'Волинська область', 'Камінь-Каширський район', 'Луцький район', 'Ковельський район'],
  "Луганська область": ['Щастинський район', 'Сєвєродонецький район', 'Сватівський район', 'Старобільський район', 'Луганська область'],
  "Тернопільська область": ['Тернопільська область', 'Кременецький район', 'Чортківський район', 'Тернопільський район'],
  "Севастополь": ['Севастополь'],
  "Миколаївська область": ['Миколаївська область', 'Миколаївський район', 'Первомайський район', 'Вознесенський район', 'Баштанський район'],
  "Закарпатська область": ['Хустський район', 'Ужгородський район', 'Рахівський район', 'Мукачівський район', 'Берегівський район', 'Тячівський район', 'Закарпатська область'],
  "Харківська область": ['Богодухівський район', 'Красноградський район', 'Чугуївський район', 'Куп’янський район', 'Ізюмський район', 'Харківська область', 'Лозівський район', 'Харківський район'],
  "Рівненська область": ['Рівненська область', 'Дубенський район', 'Сарненський район', 'Рівненський район', 'Вараський район'],
  "Житомирська область": ['Бердичівський район', 'Коростенський район', 'Житомирський район', 'Житомирська область', 'Новоград-Волинський район'],
  "Запорізька область": ['Запорізький район', 'Бердянський район', 'Запорізька область', 'Мелітопольський район', 'Василівський район', 'Пологівський район'],
  "Дніпропетровська область": ['Криворізький район', 'Дніпровський район', 'Павлоградський район', 'Синельниківський район', 'Новомосковський район', 'Нікопольський район', 'Дніпропетровська область', "Кам'янський район"],
  "Івано-Франківська область": ['Калуський район', 'Косівський район', 'Надвірнянський район', 'Івано-Франківський район', 'Івано-Франківська область', 'Верховинський район', 'Коломийський район'],
  "Сумська область": ['Шосткинський район', 'Охтирський район', 'Сумський район', 'Конотопський район', 'Роменський район', 'Сумська область'],
  "Автономна Республіка Крим": ['Автономна Республіка Крим'],
  "Полтавська область": ['Миргородський район', 'Лубенський район', 'Полтавська область', 'Полтавський район', 'Кременчуцький район'],
  "Вінницька область": ['Хмільницький район', 'Вінницька область', 'Жмеринський район', 'Могилів-Подільський район', 'Тульчинський район', 'Гайсинський район', 'Вінницький район'],
  "Черкаська область": ['Черкаський район', 'Уманський район', 'Звенигородський район', 'Черкаська область', 'Золотоніський район'],
  "Кіровоградська область": ['Кропивницький район', 'Олександрійський район', 'Кіровоградська область', 'Голованівський район', 'Новоукраїнський район'],
};

function setPolygon(polygonName, coordinates) {
  if (!(polygonName in polygons)) {
    polygons[polygonName] = [];
  }
  const polygon = [];
  for (let j = 0; j < coordinates.length; j += 2) {
    polygon.push([coordinates[j], coordinates[j+1]]);
  }
  polygons[polygonName].push(polygon);
}

async function loadGeojson() {
  const response = await fetch("geojson.hdf5");
  const file = new hdf5.File(await response.arrayBuffer(), "geojson.hdf5");
  setPolygon("Україна", file.get("geojson/Україна/0").value);
  for (const regionName in regions) {
    for (const regionIndex in regions[regionName]) {
      const polygonName = regions[regionName][regionIndex];
      try {
        for (let i = 0; i < 20; i++) {
          const datasetName = "geojson/" + regionName + "/" + polygonName + "/" + i;
          setPolygon(polygonName, file.get(datasetName).value);
        }
      } catch (exception) {
        // console.log(exception);
      } finally {
        if (polygonName == "Київська область") {
          polygons["Київська область"].push(polygons["Київ"][0]);
        }
      }
    }
  }

  const polygonUaFeature = new ol.Feature({
    geometry: new ol.geom.Polygon(polygons["Україна"]),
  });
  polygonUaFeature.getGeometry().transform("EPSG:4326", "EPSG:3857");
  polygonUaLayer.getSource().clear();
  polygonUaLayer.getSource().addFeatures([polygonUaFeature]);
}