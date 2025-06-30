const API_URL = "url";
const isDesktop = () => window.innerWidth > 768;

const dataJSON = {
  regions: [
    {
      name: "Центральный",
      areas: [
        {
          name: "Московская область",
          cities: [
            "Москва",
            "Химки",
            "Подольск",
            "Мытищи",
            "Королёв",
            "Москва",
            "Химки",
            "Подольск",
            "Мытищи",
            "Королёв",
            "Москва",
            "Химки",
            "Подольск",
            "Мытищи",
            "Королёв",
            "Москва",
            "Химки",
            "Подольск",
            "Мытищи",
            "Королёв",
            "Москва",
            "Химки",
            "Подольск",
            "Мытищи",
            "Королёв",
            "Москва",
            "Химки",
            "Подольск",
            "Мытищи",
            "Королёв",
          ],
        },
        {
          name: "Тверская область",
          cities: ["Тверь", "Ржев", "Вышний Волочёк"],
        },
      ],
    },
    {
      name: "Северо-Западный",
      areas: [
        {
          name: "Ленинградская область",
          cities: ["Санкт-Петербург", "Гатчина", "Выборг"],
        },
        {
          name: "Калининградская область",
          cities: ["Калининград", "Советск", "Черняховск"],
        },
      ],
    },
    {
      name: "Южный",
      areas: [
        {
          name: "Ростовская область",
          cities: ["Ростов-на-Дону", "Таганрог", "Шахты"],
        },
        {
          name: "Краснодарский край",
          cities: ["Краснодар", "Сочи", "Анапа"],
        },
      ],
    },
    {
      name: "Северо-Кавказский",
      areas: [
        {
          name: "Чеченская Республика",
          cities: ["Грозный", "Аргун", "Гудермес"],
        },
        {
          name: "Ставропольский край",
          cities: ["Ставрополь", "Пятигорск", "Кисловодск"],
        },
      ],
    },
    {
      name: "Приволжский",
      areas: [
        {
          name: "Республика Татарстан",
          cities: ["Казань", "Набережные Челны", "Альметьевск"],
        },
        {
          name: "Самарская область",
          cities: ["Самара", "Тольятти", "Сызрань"],
        },
      ],
    },
    {
      name: "Уральский",
      areas: [
        {
          name: "Свердловская область",
          cities: ["Екатеринбург", "Нижний Тагил", "Каменск-Уральский"],
        },
        {
          name: "Челябинская область",
          cities: ["Челябинск", "Магнитогорск", "Златоуст"],
        },
      ],
    },
    {
      name: "Сибирский",
      areas: [
        {
          name: "Новосибирская область",
          cities: ["Новосибирск", "Бердск", "Искитим"],
        },
        {
          name: "Красноярский край",
          cities: ["Красноярск", "Ачинск", "Канск"],
        },
      ],
    },
    {
      name: "Дальневосточный",
      areas: [
        {
          name: "Приморский край",
          cities: ["Владивосток", "Находка", "Уссурийск"],
        },
        {
          name: "Хабаровский край",
          cities: ["Хабаровск", "Комсомольск-на-Амуре", "Амурск"],
        },
      ],
    },
  ],
};
let cities;

const dropdown = document.querySelector(".modal__dropdown");
const searchContainer = document.querySelector(".modal_city-search");
const searchInput = searchContainer.querySelector(".catalog__search__input");
const errorName = searchContainer.querySelector(".city-search__wrong-name");
const closeSearch = searchContainer.querySelector(".modal__close-search");

const choosedCity = document.querySelector(".modal__choosed-city");
const btnsListContainer = document.querySelector(".modal__buttons-list");

const regionsContainer = document.querySelector(".table__list.regions");
const areasContainer = document.querySelector(".table__list.areas");
const citiesContainer = document.querySelector(".table__list.cities");
const mobileContainer = document.querySelector(".modal__table__mobile");

modal = document.querySelector(".modal-backdrop");
closeSearch.addEventListener("click", () => {
  if (searchContainer.parentElement.classList.contains("opened-from-filter")) {
    modal.style.zIndex = "0";
    // setTimeout(() => {
    modal.classList.remove("opened");
    modal
      .querySelector(".city")
      .classList.remove("opened", "opened-from-filter");
    modal.style.zIndex = "";
    // }, 0);
    // modal.classList.remove("opened");
    // modal
    //   .querySelector(".city")
    //   .classList.remove("opened", "opened-from-filter");
  }
  searchContainer.classList.remove("mobile-search");
  searchInput.value = "";
  errorName.classList.add("hidden");
  dropdown.classList.add("hidden");
});

function handleCityChoose(city) {
  const url = new URL(window.location);
  if (city === "Все города") {
    url.searchParams.delete("city");
  } else {
    url.searchParams.set("city", city);
  }
  window.history.pushState({}, "", url);

  choosedCity.innerHTML = city;
  console.log("Выбран город", city);
}
function clearActiveClass(container, className) {
  const activeItems = container.querySelectorAll("." + className);
  activeItems.forEach((item) => item.classList.remove(className));
}

function mockFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(
      resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(dataJSON),
      }),
      500
    );
  });
}

function filterCities(query) {
  return cities.filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );
}

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}
function renderDropdown(filteredCities, query) {
  dropdown.innerHTML = "";
  if (filteredCities.length === 0) {
    errorName.classList.remove("hidden");
    // dropdown.classList.add("hidden");
    return;
  }
  errorName.classList.add("hidden");
  dropdown.classList.remove("hidden");
  filteredCities.forEach((city, index) => {
    const div = document.createElement("div");
    div.className = "modal__dropdown-item";
    const cityNameSpan = document.createElement("span");
    cityNameSpan.className = "modal__dropdown-item__city";
    cityNameSpan.innerHTML = highlightText(city.name, query) + ", ";

    const areaNameSpan = document.createElement("span");
    areaNameSpan.className = "modal__dropdown-item__area";
    areaNameSpan.textContent = city.areaName;

    div.appendChild(cityNameSpan);
    div.appendChild(areaNameSpan);

    div.onclick = () => {
      handleCitySelect(city);
      closeSearch.dispatchEvent(new Event("click"));
      document.querySelector(
        ".mobile-filter-wrapper.city .mobile-filter-header__selected-option"
      ).innerHTML = city.name;
      document
        .querySelector(".mobile-filter-wrapper.city .select_wrapper.open")
        .classList.remove("open");
      document.querySelector(
        ".mobile-filter-wrapper.city .new-catalogForm__filter__input"
      ).placeholder = city.name;
      document.querySelector(
        ".new-catalogResults__header__mobile-filters .new-catalogForm__filter__input"
      ).value = city.name;
    };
    if (index === 0) div.classList.add("active");
    dropdown.appendChild(div);
  });
}

function handleCitySelect(city) {
  searchInput.value = city.name;
  dropdown.classList.add("hidden");
  handleCityChoose(city.name);
}

searchInput.addEventListener("focus", (event) => {
  event.stopPropagation();

  if (!isDesktop()) {
    searchContainer.classList.add("mobile-search");
  }
  const query = searchInput.value.trim();
  // if (query) {
  dropdown.classList.remove("hidden");

  // return;
  // } else {
  // dropdown.classList.add("hidden");
  // }
});
// document.addEventListener("click", (event) => {
//   if (!event.target.closest(".modal_city-search")) {
//     // searchContainer.classList.remove("mobile-search");
//     // dropdown.classList.add("hidden");
//   }
// });
document.addEventListener("click", (event) => {
  const isClickInsideDropdown = event.target.closest(".modal__dropdown");
  const isClickInsideInput = event.target.closest(".modal__input");

  if (!isClickInsideDropdown && !isClickInsideInput) {
    dropdown.classList.add("hidden");
  }
});

async function fetchData() {
  try {
    // TODO replace mickFetch and API_URL
    const response = await mockFetch(API_URL);
    const data = await response.json();
    return data.regions;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return [];
  }
}

function renderRegions(regions) {
  regionsContainer.innerHTML = "";
  regions.forEach((region) => {
    const div = document.createElement("div");
    div.className = "regin-item table__item";
    div.textContent = region.name;
    div.onclick = () => {
      clearActiveClass(regionsContainer, "active-table-item");
      div.classList.add("active-table-item");
      renderAreas(region.areas);
    };
    regionsContainer.appendChild(div);
  });
  regionsContainer.firstElementChild.classList.add("active-table-item");
  renderAreas(regions[0].areas);
}

function renderAreas(areas) {
  areasContainer.innerHTML = "";
  citiesContainer.innerHTML = "";
  areas.forEach((area) => {
    const div = document.createElement("div");
    div.className = "areas-item table__item";
    div.textContent = area.name;
    div.onclick = () => {
      clearActiveClass(areasContainer, "active-table-item");
      div.classList.add("active-table-item");
      renderCities(area.cities);
    };
    areasContainer.appendChild(div);
  });
  areasContainer.firstElementChild.classList.add("active-table-item");
  renderCities(areas[0].cities);
}

function renderCities(cities) {
  citiesContainer.innerHTML = "";
  cities.forEach((city) => {
    const div = document.createElement("div");
    div.className = "cities-item table__item";
    div.dataset.value = city;
    div.textContent = city;
    div.onclick = () => {
      clearActiveClass(citiesContainer, "active-table-item");
      div.classList.add("active-table-item");
      handleCityChoose(city);
    };
    citiesContainer.appendChild(div);
  });
  citiesContainer.firstElementChild.classList.add("active-table-item");
}

function renderButtonsList(cities) {
  cities.unshift("Все города");
  btnsListContainer.innerHTML = "";
  cities.forEach((city) => {
    const li = document.createElement("li");
    li.className = "buttons-list__el";
    li.textContent = city;
    li.onclick = () => {
      clearActiveClass(btnsListContainer, "active-btn");
      li.classList.add("active-btn");
      handleCityChoose(city);
    };
    btnsListContainer.appendChild(li);
  });
  btnsListContainer.firstElementChild.classList.add("active-btn");
}

function renderGroupedCities(cities) {
  mobileContainer.innerHTML = "";

  const groupedCities = cities.reduce((acc, city) => {
    const firstLetter = city.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(city.name);
    return acc;
  }, {});
  const sortedLetters = Object.keys(groupedCities).sort();

  sortedLetters.forEach((letter) => {
    const letterHeader = document.createElement("div");
    letterHeader.className = "letter-header";
    letterHeader.textContent = letter;
    mobileContainer.appendChild(letterHeader);

    groupedCities[letter].forEach((city) => {
      const li = document.createElement("li");
      li.className = "mobile-buttons-list__el";
      li.textContent = city;
      li.onclick = () => {
        clearActiveClass(mobileContainer, "active-btn");
        li.classList.add("active-btn");
        handleCityChoose(city);
      };
      mobileContainer.appendChild(li);
    });
  });
}

async function init() {
  const regions = await fetchData();

  cities = dataJSON.regions.flatMap((region) =>
    region.areas.flatMap((area) =>
      area.cities.map((name) => ({
        name,
        areaName: area.name,
      }))
    )
  );
  renderDropdown(cities, "");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query === "") {
      renderDropdown(cities, "");
      // dropdown.classList.add("hidden");
      return;
    }

    const filteredCities = filterCities(query);
    renderDropdown(filteredCities, query);
  });
  const citiesBtns = [
    "Москва",
    "Санкт-Петербург",
    "Казань",
    "Уфа",
    "Екатеринбург",
    "Тюмень",
    "Москва",
    "Санкт-Петербург",
    "Казань",
    "Уфа",
    "Екатеринбург",
    "Тюмень",
  ];
  renderButtonsList(citiesBtns);
  renderGroupedCities(cities);
  renderRegions(regions);
}

init();
