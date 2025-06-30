import { getFilterData } from "./temp.js";

const generetingFilterContainer = document.querySelector(
  ".new-catalogForm__generated-filters"
);

const filterData = getFilterData();
const isDesktop = () => window.innerWidth > 768;

// Генерация фильтров
filterData.data.filters.forEach((filter) => {
  const filterDiv = document.createElement("div");
  filterDiv.classList.add("new-catalogForm__filter");
  generetingFilterContainer.append(filterDiv);

  const mobileHeader = document.createElement("div");
  mobileHeader.classList.add("new-catalogForm__filter__mobile-header");
  mobileHeader.innerHTML = `<div class="new-catalogForm__filter__mobile-header__close">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18"
                                 fill="none">
                                 <path
                                    d="M8.57073 0.277911C8.95198 -0.0926369 9.57012 -0.0926369 9.95138 0.277911C10.3326 0.648458 10.3326 1.24923 9.95138 1.61978L3.33414 8.05112H19.0237C19.5629 8.05112 20 8.47593 20 8.99996C20 9.52399 19.5629 9.9488 19.0237 9.9488H3.33319L9.9505 16.3802C10.3318 16.7508 10.3318 17.3515 9.9505 17.7221C9.56925 18.0926 8.95111 18.0926 8.56985 17.7221L0.285943 9.67089C-0.0953145 9.30035 -0.0953145 8.69957 0.285943 8.32903C0.294632 8.32059 0.303443 8.31233 0.31237 8.30427L8.57073 0.277911Z"
                                    fill="#212529" />
                              </svg>
                            </div>
                            <p class="new-catalogForm__filter__mobile-header__title">${filter.filter_name}</p>
                            <a href="" class="new-catalogForm__filter__mobile-header__reset">Сбросить</a>`;
  filterDiv.append(mobileHeader);

  const filterName = document.createElement("p");
  filterName.classList.add("new-catalogForm__filter__title");
  filterName.innerHTML = filter.filter_name;
  filterDiv.append(filterName);

  const uiDiv = document.createElement("div");
  uiDiv.classList.add("new-catalogForm__filter__ui");
  filterDiv.append(uiDiv);

  const inputEl = document.createElement("input");
  inputEl.classList.add("new-catalogForm__filter__input");
  inputEl.placeholder = filter.placeholder;
  inputEl.dataset.placeholder = filter.placeholder;
  inputEl.dataset.filter = JSON.stringify({ range: "", list: [] });
  inputEl.dataset.unit = filter.unit;
  inputEl.name = filter.filter_code;
  inputEl.autocomplete = "off";
  uiDiv.append(inputEl);

  const mobileClear = document.createElement("div");
  mobileClear.classList.add("mobile-clear");
  mobileClear.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="10" fill="#6C757D"/>
                            <path d="M6.48535 6.48535L13.9999 13.9999" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 6.48535L6.48541 13.9999" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>`;
  mobileClear.addEventListener("click", (event) => {
    mobileClear
      .closest(".new-catalogForm__filter__ui")
      .querySelector(".new-catalogForm__filter__input").value = "";
  });
  uiDiv.append(mobileClear);

  const wrapper = document.createElement("div");
  wrapper.classList.add("select_wrapper");
  uiDiv.append(wrapper);

  const applyBtn = document.createElement("div");
  applyBtn.classList.add("primary-btn", "mobile-apply");
  applyBtn.innerText = "Готово";
  uiDiv.append(applyBtn);

  if (filter.range[0] === "yes") {
    wrapper.classList.add("ranged");
    const range = document.createElement("div");
    range.innerHTML = `<div class="new-catalogForm__filter__range__text">
                                <p class="new-catalogForm__filter__range__title">
                                    Диапазон
                                </p>
                                <p class="new-catalogForm__filter__range__reset">
                                    Сбросить
                                </p>
                            </div>
                            <div class="new-catalogForm__filter__range__inputs">
                                <input class="new-catalogForm__filter__range__input" placeholder="От">
                                <input class="new-catalogForm__filter__range__input" placeholder="До">
                            </div>`;
    range.classList.add("new-catalogForm__filter__range");
    wrapper.append(range);
  }

  const select = document.createElement("div");
  select.classList.add("new-catalogForm__filter__select");
  wrapper.append(select);

  const commonSearch = document.createElement("div");
  commonSearch.classList.add("new-catalogForm__filter__select__status");
  commonSearch.innerHTML = ` <div class='status_placeholder'>Часто ищут</div>
                              <div class='status_active hidden'>
                                <div class='status_active__counter'>Выбрано:</div>
                                <div class='status_active__reset'>Сбросить</div>
                              </div>
                              <div class="mobile-status">
                                <div class='mobile-status__hint'>Введите значения для поиска по диапазону диаметров.</div>
                                <div class='mobile-status__reset'>Сбросьте диапазон, если хотите вернуться к множественному выбору.</div>
                                <div class="mobile-status__back"></div>
                              </div>`;
  select.append(commonSearch);

  const filterHelp = document.createElement("p");
  filterHelp.classList.add("new-catalogForm__filter__hint");
  filterHelp.innerHTML = filter.filter_help;

  filter.values.forEach((value, index) => {
    const option = document.createElement("span");
    option.dataset.value = value;
    option.classList.add("new-catalogForm__filter__select__option");
    option.innerHTML = value;

    //Убрать когда поменяют бек
    if (index === 0) {
      option.dataset.value = "temp";
      option.innerText = "temp";
    }

    select.append(option);
  });
  filterDiv.append(filterHelp);
});

// Логика звезд
document.addEventListener("DOMContentLoaded", () => {
  const rating = document.querySelector(".rating");
  const stars = rating.querySelectorAll(".star");
  const statBlock = document.querySelector(
    ".catalog-footer__rating__stat__text"
  );
  const globalValue = parseFloat(rating.dataset.value);
  let selectedValue = 0;
  let isRated = localStorage.getItem("userRated") === "true";

  function updateStars(value) {
    stars.forEach((star, index) => {
      star.classList.remove("filled", "half-filled");
      if (index + 1 <= Math.floor(value)) {
        star.classList.add("filled");
      } else if (index < value) {
        star.classList.add("half-filled");
      }
    });
  }

  function updateStatBlock(newRating, newVotes) {
    if (!statBlock) return;
    const spans = statBlock.querySelectorAll(".fw_600");
    if (spans.length >= 2) {
      spans[0].textContent = newRating.toFixed(1);
      spans[1].textContent = newVotes;
    }
  }

  updateStars(
    isRated
      ? parseFloat(localStorage.getItem("userRating")) || globalValue
      : globalValue
  );

  stars.forEach((star, index) => {
    star.addEventListener("mouseover", () => {
      if (isRated) return;
      updateStars(index + 1);
    });

    star.addEventListener("mouseout", () => {
      if (isRated) return;
      updateStars(selectedValue || globalValue);
    });

    star.addEventListener("click", () => {
      if (isRated) return;

      selectedValue = index + 1;
      updateStars(selectedValue);

      fetch("/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedValue }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to submit rating");
          return res.json();
        })
        .then((data) => {
          // Примерный ответ от сервера:
          // { newAverage: 4.7, newVotes: 9 }
          console.log("Rating submitted:", data);
          isRated = true;
          localStorage.setItem("userRated", "true");
          localStorage.setItem("userRating", selectedValue);
          updateStatBlock(data.newAverage, data.newVotes);
        })
        .catch((err) => {
          console.error(err);
          selectedValue = 0;
          updateStars(globalValue);
        });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const block = document.querySelector(".new-catalogForm__loader");
    if (block) {
      block.style.display = "none";
    }
  }, 600);
});

function moreBtnsLogic() {
  const posMoreBtns = document.querySelectorAll(".new-catalog__position-more");

  function handleOutsideClick(event) {
    let clickedInside = false;

    posMoreBtns.forEach((btn) => {
      if (btn.contains(event.target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      closeAllModals();
      document.removeEventListener("click", handleOutsideClick);
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".more-modal.opened").forEach((modal) => {
      modal.classList.remove("opened");
    });
  }

  posMoreBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      if (event.target === btn || btn.contains(event.target)) {
        if (event.target !== btn) event.stopPropagation();

        const moreModal = btn.querySelector(".more-modal");
        const isOpening = !moreModal.classList.contains("opened");

        closeAllModals();

        if (isOpening) {
          moreModal.classList.add("opened");
          document.addEventListener("click", handleOutsideClick);
        }
      }
    });
  });

  document.querySelectorAll(".more-modal").forEach((modal) => {
    modal.addEventListener("click", (event) => event.stopPropagation());
  });
}
moreBtnsLogic();

/**
 * Универсальная функция для управления модальными окнами
 * @param {Object} options - Настройки
 * @param {string} options.triggerSelector - Селектор элемента-триггера
 * @param {string} options.modalSelector - Селектор модального окна (ищется относительно триггера)
 * @param {string} [options.activeClass='opened'] - Класс активности
 * @param {boolean} [options.closeOnOutsideClick=true] - Закрывать при клике вне
 * @param {boolean} [options.closeOtherModals=true] - Закрывать другие модалки
 */
function toggleModals(options) {
  const {
    triggerSelector,
    modalSelector,
    activeClass = "opened",
    closeOnOutsideClick = true,
    closeOtherModals = true,
  } = options;

  const triggers = document.querySelectorAll(triggerSelector);

  function closeAllModals() {
    document
      .querySelectorAll(`${modalSelector}.${activeClass}`)
      .forEach((modal) => {
        modal.classList.remove(activeClass);
      });
  }

  function findModal(trigger) {
    const innerModal = trigger.querySelector(modalSelector);
    if (innerModal) return innerModal;

    const parentContainer = trigger.parentElement.closest("*");
    if (parentContainer) {
      return parentContainer.querySelector(modalSelector);
    }

    return document.querySelector(modalSelector);
  }

  function handleTriggerClick(event) {
    const trigger = event.target.closest(triggerSelector);
    if (!trigger) return;

    const modal = findModal(trigger);
    if (!modal) {
      console.warn(`Modal not found for trigger:`, trigger);
      return;
    }

    event.stopPropagation();
    const isOpening = !modal.classList.contains(activeClass);

    if (closeOtherModals) {
      closeAllModals();
    }

    modal.classList.toggle(activeClass, isOpening);
  }

  function handleOutsideClick(event) {
    const clickedOnTrigger = event.target.closest(triggerSelector);
    const clickedOnModal = event.target.closest(modalSelector);

    if (!clickedOnTrigger && !clickedOnModal) {
      closeAllModals();
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", handleTriggerClick);
  });

  document.querySelectorAll(modalSelector).forEach((modal) => {
    modal.addEventListener("click", (e) => e.stopPropagation());
  });

  if (closeOnOutsideClick) {
    document.addEventListener("click", handleOutsideClick);
  }

  return {
    closeAllModals,
  };
}
toggleModals({
  triggerSelector: ".tdmobile__numbers .tdmobile__amount .hint-icon",
  modalSelector: ".tdmobile__more__backdrop",
});
toggleModals({
  triggerSelector: ".tdmobile__numbers .tdmobile__price .hint-icon",
  modalSelector: ".tdmobile__more__backdrop",
});
toggleModals({
  triggerSelector: ".tdmobile__more",
  modalSelector: ".tdmobile__more__backdrop",
});

document
  .querySelectorAll(".tdmobile__more__modal__close")
  .forEach((closeIcon) => {
    closeIcon.addEventListener("click", () => {
      closeIcon.parentElement.parentElement.classList.remove("opened");
    });
  });

const modalBackdrops = document.querySelectorAll(".tdmobile__more__backdrop");
modalBackdrops.forEach((backdrop) => {
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      backdrop.classList.remove("opened");
    }
  });
});

document
  .querySelectorAll(".modal-backdrop .modal-close")
  .forEach((closeIcon) => {
    closeIcon.addEventListener("click", () => {
      closeIcon.parentElement.classList.remove("opened");
      closeIcon.parentElement.parentElement.classList.remove("opened");
    });
  });
// Блок модалок
const backdrop = document.querySelector(".modal-backdrop");

backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) {
    backdrop.classList.remove("opened");
    backdrop.querySelectorAll(".modal-body").forEach((modal) => {
      modal.classList.remove("opened");
    });
  }
});

function openModal(selector) {
  backdrop.classList.add("opened");
  backdrop.querySelector(`.modal-body.${selector}`).classList.add("opened");
}

// Модалка "преимущества подписки"
document
  .querySelector(".new-catalogForm__controls__submit__sub")
  .addEventListener("click", (event) => {
    event.preventDefault();
    openModal("subscribe-adv");
  });

// Модалка "Больше предложений металлопроката"
document.querySelectorAll(".metallbase__get-sub").forEach((blur) => {
  blur.addEventListener("click", (event) => {
    event.preventDefault();
    openModal("metallbase");
  });
});

const brilliantAnimationBtn = backdrop.querySelector(
  ".modal-body.metallbase .primary-btn"
);

brilliantAnimationBtn.addEventListener("click", (event) => {
  event.preventDefault();
  brilliantAnimationBtn.parentElement
    .querySelector(".metallbase__img div")
    .classList.add("active");
});

document.querySelectorAll(".tdmobile__cart.gradient-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    openModal("subscribe-adv");
  });
});

document.querySelector(".city-btn").addEventListener("click", (event) => {
  event.preventDefault();
  openModal("city");
});

function closeAllWrappers() {
  document.querySelectorAll(".select_wrapper.open").forEach((wrapper) => {
    const input = wrapper
      .closest(".new-catalogForm__filter__ui")
      .querySelector(".new-catalogForm__filter__input");

    // Проверяем, что у инпута есть атрибут data-filter
    if (input && input.hasAttribute("data-filter")) {
      input.dataset.filter !== '{"range":"","list":[]}'
        ? input.classList.add("active")
        : input.classList.remove("active");

      // Закрываем select_wrapper
      refreshPlaceholder(input);
    }

    wrapper.classList.remove("open");
  });
}

// Обновление url
function updateQueryParams() {
  const filterElements = document.querySelectorAll("[data-filter]");
  const url = new URL(window.location.href);
  const existingParams = new URLSearchParams(url.search);

  const paramsObj = {};
  for (const [key, value] of existingParams.entries()) {
    paramsObj[key] = value;
  }

  filterElements.forEach((element) => {
    try {
      const filterData = JSON.parse(element.getAttribute("data-filter"));
      const name = element.name;

      if (filterData.range && filterData.range !== "") {
        const [min, max] = filterData.range.split("-");
        if (min || max) {
          const rangeString = `${min || ""}-${max || ""}`;
          paramsObj[name] = rangeString;
        } else {
          delete paramsObj[name];
        }
      } else {
        delete paramsObj[name];
      }

      if (filterData.list && filterData.list.length > 0) {
        const rawValue = filterData.list.join("|");
        paramsObj[name] = rawValue;
      } else if (!filterData.range) {
        delete paramsObj[name];
      }

      if (
        !filterData.range &&
        (!filterData.list || filterData.list.length === 0) &&
        element.value
      ) {
        paramsObj[name] = element.value;
      }
    } catch (e) {
      console.error("Ошибка парсинга data-filter:", e);
    }
  });

  const queryString = Object.entries(paramsObj)
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(value)
          .replace(/%2C/g, ",")
          .replace(/%7C/g, "|")
          .replace(/%2D/g, "-")}`
    )
    .join("&");

  const newUrl = `${window.location.pathname}?${queryString}`;
  window.history.pushState({}, "", newUrl);
}
document.querySelectorAll(".new-catalogForm__filter__ui").forEach((filter) => {
  document.removeEventListener("click", handleDocumentClick);
  const filterInput = filter.querySelector(".new-catalogForm__filter__input");

  filterInput.addEventListener("click", (event) => {
    if (!isDesktop()) {
      if (
        !event.target.parentElement
          .querySelector(".select_wrapper")
          .classList.contains("open")
      ) {
        event.target.blur();
        if (event.target.name === "city") {
          event.target.placeholder = "Найти город";
        }
      } else {
        if (event.target.name === "city") {
          // console.log(1213);
          modal = document.querySelector(".modal-backdrop");
          modal.classList.add("opened");
          modal
            .querySelector(".city")
            .classList.add("opened", "opened-from-filter");
          const searchInput = modal.querySelector(".modal__input.catalog__search__input");
          searchInput.focus();
          searchInput.dispatchEvent(new Event('focus'));
        }
      }
    }
    closeAllWrappers();
    filter.querySelector(".select_wrapper").classList.add("open");

    if (!isDesktop()) {
      if (filterInput.closest(".new-catalogForm__main-filters")) {
        if (filterInput.closest(".mobile-filter-wrapper.city")) {
          filterInput.placeholder = "Найти город";
        } else {
          return;
        }
      } else if (filterInput.closest(".new-catalogForm__generated-filters")) {
        filterInput.placeholder = "Поиск";
      }
    }

    filter.querySelector(".new-catalogForm__filter__select").scrollTop = 0;
    document.addEventListener("click", handleDocumentClick);
  });

  function handleDocumentClick(e) {
    e.stopPropagation();

    const target = e.target;

    // Если клик по .mobile-apply — это внешнее нажатие
    if (target.closest(".mobile-apply")) {
      closeAllWrappers();
      document.removeEventListener("click", handleDocumentClick);
      return;
    }

    const isClickInside = Array.from(
      document.querySelectorAll(
        ".new-catalogForm__filter, .modal-backdrop, .new-catalogForm__filter__mobile-header"
      )
    ).some((wrapper) => wrapper.contains(target));

    if (!isClickInside) {
      const input = filter.querySelector(
        ".new-catalogForm__generated-filters .new-catalogForm__filter__input"
      );
      if (
        input &&
        input.value.trim() !== "" &&
        input.hasAttribute("data-filter")
      ) {
        const newData = safeJsonParse(input.dataset.filter);
        newData.list.push(input.value);
        input.dataset.filter = JSON.stringify(newData);
        refreshPlaceholder(input);
        input.value = "";
        console.log(1);
        filter.querySelector(".status_active").classList.remove("hidden");
        filter.querySelector(".status_placeholder").style.display = "none";

        filter.querySelector(".status_active__counter").innerHTML =
          "Выбрано: " + newData.list.length;
      }
      closeAllWrappers();
      document.removeEventListener("click", handleDocumentClick);
    }
  }
});

function refreshPlaceholder(mainInput) {
  // Проверяем, что у инпута есть атрибут data-filter
  if (!mainInput || !mainInput.hasAttribute("data-filter")) {
    return;
  }

  btnLoaderStart();

  try {
    const filterData = safeJsonParse(mainInput.dataset.filter);
    const unit = mainInput.dataset.unit || "";

    // Удаляем дубликаты
    const uniqueList = [...new Set(filterData.list)];
    filterData.list = uniqueList;
    mainInput.dataset.filter = JSON.stringify(filterData);

    const wrapper = mainInput.parentElement.querySelector(".select_wrapper");
    if (!isDesktop() && wrapper.classList.contains("open")) {
      updateQueryParams();
      return;
    }

    if (filterData.range) {
      mainInput.placeholder = filterData.range + (unit ? ` ${unit}` : "");
      return;
    }

    if (uniqueList.length === 0) {
      mainInput.placeholder = mainInput.dataset.placeholder;
      return;
    }

    // Получаем ширину поля и вычитаем padding
    const styles = window.getComputedStyle(mainInput);
    const inputWidth = mainInput.getBoundingClientRect().width;
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const usableWidth = inputWidth - paddingLeft - paddingRight;

    // Средняя ширина одного символа (настроить при необходимости)
    const avgCharWidth = 7;
    const maxChars = Math.floor(usableWidth / avgCharWidth);

    let result = "";
    let count = 0;

    for (let i = 0; i < uniqueList.length; i++) {
      const value = unit ? `${uniqueList[i]} ${unit}` : uniqueList[i];
      const nextPart = (count === 0 ? "" : ", ") + value;

      const suffix =
        i < uniqueList.length - 1 ? `... (${uniqueList.length})` : "";
      if ((result + nextPart + suffix).length > maxChars) {
        result += `... (${uniqueList.length})`;
        break;
      }

      result += nextPart;
      count++;
    }

    mainInput.placeholder = result;
    updateQueryParams();
  } catch (error) {
    console.error("Error in refreshPlaceholder:", error);
  } finally {
    // Гарантированно останавливаем лоадер через 500мс
    setTimeout(btnLoaderEnd, 500);
  }
}

// Выбор фильтров
const containerList = document.querySelectorAll(
  ".new-catalogForm__generated-filters .new-catalogForm__filter__ui"
);
containerList.forEach((container) => {
  const mainInput = container.querySelector(".new-catalogForm__filter__input");
  const detailContainer = container.querySelector(".select_wrapper");
  let optionList = detailContainer.querySelectorAll(
    ".new-catalogForm__filter__select__option"
  );
  const [rangeMin, rangeMax] = detailContainer.querySelectorAll(
    ".new-catalogForm__filter__range__input"
  );
  const resetRange = detailContainer.querySelector(
    ".new-catalogForm__filter__range__reset"
  );

  const statusBlock = detailContainer.querySelector(
    ".new-catalogForm__filter__select__status"
  );

  const statusCounter = statusBlock.querySelector(".status_active__counter");
  const searchStatus = statusBlock.querySelector(".status_placeholder");

  const resetOptions = statusBlock.querySelector(".status_active__reset");

  resetOptions.addEventListener("click", () => {
    btnLoaderStart();
    try {
      optionList.forEach((option) => {
        option.classList.remove("active");
        option.style.display = "flex";
      });
      mainInput.dataset.filter = JSON.stringify({ range: "", list: [] });
      refreshPlaceholder(mainInput);
      mainInput.value = "";
      statusCounter.innerHTML = "Выбрано: ";
      searchStatus.innerText = "Часто ищут";
      searchStatus.classList.remove("black");
      statusBlock.querySelector(".status_active").classList.add("hidden");
      searchStatus.style.display = "block";
      updateQueryParams();
    } catch (error) {
      console.error("Error in reset options:", error);
    } finally {
      setTimeout(btnLoaderEnd, 500);
    }
  });

  mainInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = mainInput.value.trim();
      if (!value) return;

      const filterData = safeJsonParse(mainInput.dataset.filter);

      if (!filterData.list.includes(value)) {
        filterData.list.push(value);
      }

      mainInput.dataset.filter = JSON.stringify(filterData);
      statusCounter.innerHTML = "Выбрано: " + filterData.list.length;
      refreshPlaceholder(mainInput);

      let existingOption = Array.from(optionList).find(
        (opt) => opt.dataset.value === value
      );

      if (!existingOption) {
        const newOption = document.createElement("div");
        newOption.className = "new-catalogForm__filter__select__option active";
        newOption.dataset.value = value;
        newOption.textContent = value;
        newOption.style.display = "flex";

        newOption.addEventListener("click", () => {
          const newData = safeJsonParse(mainInput.dataset.filter);
          if (newOption.classList.contains("active")) {
            newData.list = newData.list.filter((el) => el !== value);
            newOption.classList.remove("active");
          } else {
            newData.list.push(value);
            newOption.classList.add("active");
          }
          mainInput.dataset.filter = JSON.stringify(newData);
          refreshPlaceholder(mainInput);
          statusCounter.innerHTML = "Выбрано: " + newData.list.length;
        });

        detailContainer
          .querySelector(".new-catalogForm__filter__select")
          .appendChild(newOption);
        optionList = detailContainer.querySelectorAll(
          ".new-catalogForm__filter__select__option"
        );
      } else {
        existingOption.classList.add("active");
      }

      mainInput.value = "";
      optionList.forEach((option) => {
        option.style.display = "flex";
      });
      statusBlock.querySelector(".status_active").classList.remove("hidden");
      searchStatus.style.display = "none";
    }
  });

  // Выбор опции
  optionList.forEach((option) => {
    option.addEventListener("click", () => {
      btnLoaderStart();
      try {
        const newData = safeJsonParse(mainInput.dataset.filter);
        if (option.classList.contains("active")) {
          newData.list = newData.list.filter(
            (element) => element !== option.dataset.value
          );
          option.classList.remove("active");
        } else {
          newData.list.push(option.dataset.value);
          option.classList.add("active");
        }

        statusCounter.innerHTML = "Выбрано: " + newData.list.length;
        mainInput.dataset.filter = JSON.stringify(newData);
        refreshPlaceholder(mainInput);
        mainInput.value = "";
        optionList.forEach((option) => {
          option.style.display = "flex";
          option.classList.remove("semibold");
        });
        statusBlock.querySelector(".status_active").classList.remove("hidden");
        searchStatus.style.display = "none";
        if (!newData.list.length) {
          statusBlock.querySelector(".status_active").classList.add("hidden");
          searchStatus.style.display = "block";
        }
      } catch (error) {
        console.error("Error in option selection:", error);
      } finally {
        setTimeout(btnLoaderEnd, 500);
      }
    });
  });

  function applyRange() {
    if (rangeMin && rangeMax) {
      [rangeMin, rangeMax].forEach((rangeInput) => {
        rangeInput.addEventListener("keydown", (e) => {
          btnLoaderStart();
          if (e.key === "Enter") {
            e.preventDefault();

            const newData = safeJsonParse(mainInput.dataset.filter);
            newData.range =
              !rangeMin.value && !rangeMax.value
                ? ""
                : rangeMin.value + " - " + rangeMax.value;

            mainInput.dataset.filter = JSON.stringify(newData);
            refreshPlaceholder(mainInput, true);

            rangeMin.value && rangeMax.value && closeAllWrappers();
          }
          setTimeout(btnLoaderEnd, 500);
        });
      });

      function applyFilters() {
        optionList.forEach((option) => {
          option.style.display = "flex";
        });
      }

      rangeMin.addEventListener("input", () => {
        if (rangeMin.value || rangeMax.value) {
          optionList.forEach((option) => {
            option.style.display = "none";
          });
        } else {
          optionList.forEach((option) => {
            option.style.display = "flex";
          });
        }

        const newData = safeJsonParse(mainInput.dataset.filter);
        newData.range =
          !rangeMin.value && !rangeMax.value
            ? ""
            : rangeMin.value + " - " + rangeMax.value;
        mainInput.dataset.filter = JSON.stringify(newData);

        refreshPlaceholder(mainInput, true);
        newData.range
          ? resetRange.classList.add("visible")
          : resetRange.classList.remove("visible");
        updateQueryParams();
      });
      rangeMax.addEventListener("input", (event) => {
        applyFilters();

        if (rangeMin.value || rangeMax.value) {
          optionList.forEach((option) => {
            option.style.display = "none";
          });
        } else {
          optionList.forEach((option) => {
            option.style.display = "flex";
          });
        }

        const newData = JSON.parse(mainInput.dataset.filter);
        newData.range =
          !rangeMin.value && !rangeMax.value
            ? ""
            : rangeMin.value + " - " + rangeMax.value;

        mainInput.dataset.filter = JSON.stringify(newData);
        refreshPlaceholder(mainInput, true);

        newData.range
          ? resetRange.classList.add("visible")
          : resetRange.classList.remove("visible");
        updateQueryParams();
      });

      resetRange.addEventListener("click", () => {
        btnLoaderStart();
        try {
          const newData = JSON.parse(mainInput.dataset.filter);
          newData.range = "";
          mainInput.dataset.filter = JSON.stringify(newData);
          resetRange.classList.remove("visible");
          rangeMax.value = "";
          rangeMin.value = "";
          refreshPlaceholder(mainInput);
          applyFilters();
          applyInput();
          updateQueryParams();
        } catch (error) {
          console.error("Error in range reset:", error);
        } finally {
          setTimeout(btnLoaderEnd, 500);
        }
      });
    }
  }

  applyRange();

  function applyInput() {
    const formated = mainInput.value.toLowerCase().trim().replaceAll(".", ",");
    optionList.forEach((option) => {
      option.style.display = "none";
      option.classList.remove("semibold");
    });
    optionList.forEach((option) => {
      if (option.dataset.value.toLowerCase().includes(formated)) {
        option.style.display = "flex";
        formated && option.classList.add("semibold");
      }
    });
  }

  mainInput.addEventListener("input", (event) => {
    if (mainInput.value) {
      searchStatus.innerText = "Найдено";
      searchStatus.classList.add("black");
    } else {
      searchStatus.innerText = "Часто ищут";
      searchStatus.classList.remove("black");
    }
    optionList.forEach((option) => {
      option.style.display = "flex";
    });

    applyInput();
  });
});
// Отключение Enter для формы

document.querySelector(".new-catalogForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const submitter = e.submitter; // Элемент, вызвавший submit
  if (submitter && submitter.type === "submit") {
    console.log("Форма отправлена через кнопку submit!");
    // Код обработки формы
    const currentUrl = window.location.href;
    window.location.href = currentUrl;
  }
});

const handleDocumentClick = (e, modal, btn) => {
  if (!modal.contains(e.target) && e.target !== btn) {
    modal.style.display = "none";
    document.removeEventListener("click", handleDocumentClick);
    // Обновлять корзину
  }
};

const cartBtnList = document.querySelectorAll(
  ".btns .cart-btn, .tdmobile__cart"
);
cartBtnList.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const modal = btn.parentElement.querySelector(".amount-modal");
    modal.style.display = "flex";
    btn.classList.add("inactive");
    btn.innerText = "Изменить";

    document.addEventListener("click", (event) =>
      handleDocumentClick(event, modal, btn)
    );
  });
});

document
  .querySelectorAll(".btns .amount-modal, .tdmobile .amount-modal")
  .forEach((modal) => {
    const deleteCartBtn = modal.querySelector(".amount-modal__delete");

    deleteCartBtn.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "none";
      document.removeEventListener("click", handleDocumentClick);
      const cartBtn = modal.parentElement.querySelector(".primary-btn");
      cartBtn.classList.remove("inactive");
      cartBtn.innerText = "В корзину";
      // Удалить из корзины
      console.log("Из корзины удалено");
    });

    const cartModalAmount = modal.querySelector(".amount-modal__amount-value");
    const cartModalPlus = modal.querySelector(".amount-modal__plus");
    const cartModalMinus = modal.querySelector(".amount-modal__minus");
    cartModalPlus.addEventListener("click", () => {
      let value = getCartModalValue();
      updateCartModalValue(value + 1);
    });
    cartModalMinus.addEventListener("click", () => {
      let value = getCartModalValue();
      updateCartModalValue(Math.max(0, value - 1));
    });

    function getCartModalValue() {
      let rawValue = cartModalAmount.value.replace(",", ".");
      let parsedValue = parseFloat(rawValue);
      return isNaN(parsedValue) ? 0 : parsedValue;
    }

    function updateCartModalValue(value) {
      cartModalAmount.value = value.toFixed(2).replace(".", ",");
    }
  });

// 1-3
document
  .querySelectorAll(".new-catalogForm__filter__input")
  .forEach((input) => {
    console.log(input.name);
    if (input.name === "item_steel_mark") {
      input
        .closest(".new-catalogForm__filter__ui")
        .querySelectorAll(".new-catalogForm__filter__select__option")
        .forEach((option) => {
          if (option.dataset.value === "1-3") {
            option.innerHTML += `<svg class="hint-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                       <circle cx="9" cy="9" r="8.5" stroke="#212529"></circle>
                                       <path d="M8.76141 11.3807H8.76764C9.14714 11.3807 9.45669 11.075 9.45946 10.6938L9.46223 10.3811C9.51487 9.93823 9.82546 9.63145 10.3223 9.17266C10.5218 8.98879 10.7278 8.79835 10.9207 8.5809C11.6149 7.79766 11.7468 6.76408 11.2652 5.8832C10.6866 4.82538 9.36874 4.29665 8.06023 4.59547C7.08794 4.81811 6.37188 5.5366 6.09591 6.56741C5.99723 6.93687 6.21641 7.31671 6.58587 7.41574C6.95533 7.51442 7.33517 7.29524 7.4342 6.92579C7.51592 6.62108 7.74583 6.08819 8.36979 5.94553C8.96709 5.80876 9.73578 5.97185 10.0505 6.54802C10.3237 7.04698 10.064 7.46041 9.88502 7.66228C9.74006 7.82604 9.57013 7.98304 9.39054 8.14896L9.38363 8.15535C8.84589 8.65154 8.17727 9.26892 8.08136 10.2762C8.07928 10.2959 8.07824 10.316 8.07824 10.3357L8.07512 10.682C8.07166 11.0646 8.37914 11.3773 8.76141 11.3807Z" fill="#212529"></path>
                                       <path d="M8.27949 13.2561C8.4076 13.3842 8.58766 13.4569 8.76771 13.4569C8.95123 13.4569 9.12782 13.3842 9.2594 13.2561C9.38751 13.1245 9.46023 12.9479 9.46023 12.7644C9.46023 12.5843 9.38751 12.4043 9.25594 12.2762C8.9997 12.0199 8.53572 12.0199 8.27949 12.2762C8.14791 12.4043 8.0752 12.5843 8.0752 12.7644C8.0752 12.9479 8.14791 13.128 8.27949 13.2561Z" fill="#212529"></path>

                                    </svg>
                                    `;
            const svg = option.querySelector("svg");
            const hint = document.querySelector(
              ".hint-text.onhover-modal.steel-hint"
            );
            svg.addEventListener("mouseenter", () => {
              if (!isDesktop()) return;

              const svgRect = svg.getBoundingClientRect();
              const scrollTop = window.scrollY;
              const scrollLeft = window.scrollX;

              hint.style.left = `${svgRect.right + 8 + scrollLeft}px`;
              hint.style.top = `${svgRect.top + scrollTop}px`;

              hint.style.display = "block";
            });
            svg.addEventListener("click", (event) => {
              if (isDesktop()) return;
              event.preventDefault();
              event.stopPropagation();
              const backdrop = document.querySelector(".modal-backdrop");
              backdrop.classList.add("opened");
              backdrop.querySelector(".steel-hint").classList.add("opened");
            });

            svg.addEventListener("mouseleave", () => {
              if (!isDesktop()) return;
              hint.style.display = "none";
            });
          }
        });
    }
  });

const showFiltersMobile = document.querySelector(".open-filters");
showFiltersMobile.addEventListener("click", (event) => {
  event.preventDefault();
  const form = document.querySelector(".new-catalogForm");
  form.classList.add("mobile_visible");
  form.scrollTop = 0;
});

document
  .querySelector(".new-catalogForm__mobile-header__close")
  .addEventListener("click", (event) => {
    event.preventDefault();
    document
      .querySelector(".new-catalogForm")
      .classList.remove("mobile_visible");
  });

const saveBtn = document.querySelector(
  ".new-catalogForm__controls__search__save"
);

saveBtn.addEventListener("click", (event) => {
  event.preventDefault();
  saveBtn.classList.add("active");
  saveBtn.querySelector("span").innerText = "Поиск сохранен";
});

[
  document.querySelector(
    ".new-catalogForm__sub-filters .new-catalogForm__filter__ui"
  ),
].forEach((container) => {
  const mainInput = container.querySelector(".new-catalogForm__filter__input");
  const detailContainer = container.querySelector(".select_wrapper");
  let optionList = detailContainer.querySelectorAll(
    ".new-catalogForm__filter__select__option"
  );

  const statusBlock = detailContainer.querySelector(
    ".new-catalogForm__filter__select__status"
  );

  const statusCounter = statusBlock.querySelector(".status_active__counter");
  const searchStatus = statusBlock.querySelector(".status_placeholder");

  const resetOptions = statusBlock.querySelector(".status_active__reset");

  function handleResetOptions() {
    optionList.forEach((option) => {
      option.classList.remove("active");
      option.style.display = "flex";
    });
    mainInput.dataset.filter = JSON.stringify({ range: "", list: [] });
    refreshPlaceholder(mainInput);
    mainInput.value = "";
    statusCounter.innerHTML = "Выбрано: ";
    searchStatus.innerText = "Часто ищут";
    searchStatus.classList.remove("black");
    statusBlock.querySelector(".status_active").classList.add("hidden");
    searchStatus.style.display = "block";
  }

  resetOptions.addEventListener("click", handleResetOptions);

  mainInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = mainInput.value.trim();
      if (!value) return;

      const filterData = safeJsonParse(mainInput.dataset.filter);

      if (!filterData.list.includes(value)) {
        filterData.list.push(value);
      }

      mainInput.dataset.filter = JSON.stringify(filterData);
      statusCounter.innerHTML = "Выбрано: " + filterData.list.length;
      refreshPlaceholder(mainInput);

      let existingOption = Array.from(optionList).find(
        (opt) => opt.dataset.value === value
      );

      if (!existingOption) {
        const newOption = document.createElement("div");
        newOption.className = "new-catalogForm__filter__select__option active";
        newOption.dataset.value = value;
        newOption.textContent = value;
        newOption.style.display = "flex";

        newOption.addEventListener("click", () => {
          const newData = safeJsonParse(mainInput.dataset.filter);
          if (newOption.classList.contains("active")) {
            newData.list = newData.list.filter((el) => el !== value);
            newOption.classList.remove("active");
          } else {
            newData.list.push(value);
            newOption.classList.add("active");
          }
          mainInput.dataset.filter = JSON.stringify(newData);
          refreshPlaceholder(mainInput);
          statusCounter.innerHTML = "Выбрано: " + newData.list.length;
        });

        detailContainer
          .querySelector(".new-catalogForm__filter__select")
          .appendChild(newOption);
        optionList = detailContainer.querySelectorAll(
          ".new-catalogForm__filter__select__option"
        );
      } else {
        existingOption.classList.add("active");
      }

      mainInput.value = "";
      optionList.forEach((option) => {
        option.style.display = "flex";
      });
      statusBlock.querySelector(".status_active").classList.remove("hidden");
      searchStatus.style.display = "none";
    }
  });

  optionList.forEach((option) => {
    option.addEventListener("click", () => {
      const newData = safeJsonParse(mainInput.dataset.filter);
      if (option.dataset.value === "Любая") {
        handleResetOptions();
        return;
      }
      if (option.classList.contains("active")) {
        newData.list = newData.list.filter(
          (element) => element !== option.dataset.value
        );
        option.classList.remove("active");
      } else {
        newData.list.push(option.dataset.value);
        option.classList.add("active");
      }

      statusCounter.innerHTML = "Выбрано: " + newData.list.length;
      mainInput.dataset.filter = JSON.stringify(newData);
      refreshPlaceholder(mainInput);
      mainInput.value = "";
      optionList.forEach((option) => {
        option.style.display = "flex";
      });
      statusBlock.querySelector(".status_active").classList.remove("hidden");
      searchStatus.style.display = "none";
      if (!newData.list.length) {
        statusBlock.querySelector(".status_active").classList.add("hidden");
        searchStatus.style.display = "block";
      }
    });
  });

  function applyInput() {
    const formated = mainInput.value.toLowerCase().trim().replaceAll(".", ",");
    optionList.forEach((option) => {
      option.style.display = "none";
      option.classList.remove("semibold");
    });
    optionList.forEach((option) => {
      if (option.dataset.value.toLowerCase().includes(formated)) {
        option.style.display = "flex";
        option.classList.add("semibold");
      }
    });
  }

  mainInput.addEventListener("input", (event) => {
    if (mainInput.value) {
      searchStatus.innerText = "Найдено";
      searchStatus.classList.add("black");
    } else {
      searchStatus.innerText = "Часто ищут";
      searchStatus.classList.remove("black");
    }
    optionList.forEach((option) => {
      option.style.display = "flex";
    });

    applyInput();
  });
});

document.querySelectorAll(".mobile-clear").forEach((clearBtn) => {
  const input = clearBtn.parentElement.querySelector(
    ".new-catalogForm__filter__input"
  );
  function toggleVision() {
    input.value === ""
      ? clearBtn.classList.remove("visible")
      : clearBtn.classList.add("visible");
  }
  input.addEventListener("input", toggleVision);
  input.addEventListener("blur", toggleVision);
  clearBtn.addEventListener("click", () => {
    input.value = "";

    clearBtn.parentElement
      .querySelectorAll(".new-catalogForm__filter__select__option")
      .forEach((option) => {
        option.style.display = "flex";
        option.classList.remove("semibold");
      });
    clearBtn.classList.remove("visible");
  });
});

document
  .querySelector(
    ".new-catalogForm__mobile-header .new-catalogForm__mobile-header__reset"
  )
  .addEventListener("click", (event) => {
    event.preventDefault();
    resetFilters();
  });

document.querySelectorAll(".mobile-apply").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement
      .querySelector(".select_wrapper.open")
      .classList.remove("open");
    // Закрываем select_wrapper
    const input = btn.parentElement.querySelector(
      ".new-catalogForm__filter__input"
    );
    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(enterEvent);

    if (input.hasAttribute("data-filter")) {
      input.dataset.filter !== '{"range":"","list":[]}'
        ? input.classList.add("active")
        : input.classList.remove("active");

      refreshPlaceholder(input);
    }
  });
});

document
  .querySelectorAll(".new-catalogForm__filter__mobile-header__close")
  .forEach((btn) => {
    btn.addEventListener("click", (event) => {
      btn.parentElement.parentElement
        .querySelector(".select_wrapper.open")
        .classList.remove("open");

      // Закрываем select_wrapper
      const input = btn.parentElement.parentElement.querySelector(
        ".new-catalogForm__filter__input"
      );
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      });

      input.dispatchEvent(enterEvent);

      if (input.name === "city") {
        input.placeholder = input.dataset.placeholder;
      }

      if (input.hasAttribute("data-filter")) {
        input.dataset.filter !== '{"range":"","list":[]}'
          ? input.classList.add("active")
          : input.classList.remove("active");

        refreshPlaceholder(input);
      }
    });
  });

document
  .querySelectorAll(".new-catalogForm__filter__mobile-header__reset")
  .forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      btnLoaderStart();
      try {
        const detailContainer = btn
          .closest(".new-catalogForm__filter")
          .querySelector(".new-catalogForm__filter__ui");
        let optionList = detailContainer.querySelectorAll(
          ".new-catalogForm__filter__select .new-catalogForm__filter__select__option"
        );
        const mainInput = detailContainer.querySelector(
          ".new-catalogForm__filter__input"
        );

        const statusBlock = detailContainer.querySelector(
          ".new-catalogForm__filter__select__status"
        );

        const statusCounter = statusBlock.querySelector(
          ".status_active__counter"
        );
        const searchStatus = statusBlock.querySelector(".status_placeholder");

        const range = detailContainer.querySelector(
          ".new-catalogForm__filter__range__inputs"
        );
        if (range) {
          range
            .querySelectorAll(".new-catalogForm__filter__range__input")
            .forEach((input) => {
              input.value = "";
            });
        }

        optionList.forEach((option) => {
          option.classList.remove("active");
          option.style.display = "flex";
        });
        mainInput.dataset.filter = JSON.stringify({ range: "", list: [] });
        refreshPlaceholder(mainInput);
        mainInput.value = "";
        statusCounter.innerHTML = "Выбрано: ";
        searchStatus.innerText = "Часто ищут";
        searchStatus.classList.remove("black");
        statusBlock.querySelector(".status_active").classList.add("hidden");
        searchStatus.style.display = "block";
      } catch (error) {
        console.error("Error in mobile filter reset:", error);
      } finally {
        setTimeout(btnLoaderEnd, 500);
      }
    });
  });

document
  .querySelectorAll(
    ".new-catalogForm__main-filters .new-catalogForm__filter__ui"
  )
  .forEach((detailContainer) => {
    const input = detailContainer.querySelector(
      ".new-catalogForm__filter__input"
    );
    const optionList = detailContainer.querySelectorAll(
      ".new-catalogForm__filter__select__option"
    );

    input.addEventListener("input", () => {
      const formated = input.value.toLowerCase().trim();
      optionList.forEach((option) => {
        option.style.display = "none";
        option.classList.remove("semibold");
      });
      optionList.forEach((option) => {
        if (option.innerText.toLowerCase().includes(formated)) {
          option.style.display = "flex";
          formated && option.classList.add("semibold");
        }
      });
    });
  });

// Баннеры

function createBanner(
  { href, popupText, imgDesktop, imgMobile, imgSrc },
  className
) {
  const a = document.createElement("a");
  a.href = href;
  a.className = `${className} fade-in`;

  if (imgDesktop && imgMobile) {
    const img1 = document.createElement("img");
    img1.src = imgDesktop;
    img1.alt = "";
    img1.className = "banner-desktop";

    const img2 = document.createElement("img");
    img2.src = imgMobile;
    img2.alt = "";
    img2.className = "banner-mobile";

    a.appendChild(img1);
    a.appendChild(img2);
  } else if (imgSrc) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "";
    a.appendChild(img);
  }

  const info = document.createElement("div");
  info.className = className.includes("catalog")
    ? "banner-info"
    : "new-catalog__banner-info";
  info.textContent = "Реклама";

  const popup = document.createElement("div");
  popup.className = className.includes("catalog")
    ? "banner-popup onhover-modal"
    : "new-catalog__banner-popup onhover-modal";
  popup.textContent = popupText;

  info.appendChild(popup);
  a.appendChild(info);

  return a;
}

function setupBannerRotation(container, banners, maxVisible = 1, className) {
  let index = 0;
  let intervalId = null;

  function showBanners() {
    const currentBanners = container.querySelectorAll(`.${className}`);
    currentBanners.forEach((banner) => {
      banner.classList.add("fade-out");
      banner.classList.remove("fade-in");
      setTimeout(() => banner.remove(), 500);
    });

    const slice = [];
    for (let i = 0; i < maxVisible; i++) {
      const idx = (index + i) % banners.length;
      slice.push(banners[idx]);
    }

    setTimeout(() => {
      slice.forEach((data) => {
        const banner = createBanner(data, className);
        banner.addEventListener("mouseenter", stopRotation);
        banner.addEventListener("mouseleave", startRotation);
        container.appendChild(banner);
      });
    }, 500);

    index = (index + maxVisible) % banners.length;
  }

  function startRotation() {
    if (!intervalId && banners.length > maxVisible) {
      intervalId = setInterval(showBanners, 5000);
    }
  }

  function stopRotation() {
    clearInterval(intervalId);
    intervalId = null;
  }

  showBanners();
  startRotation();
}

const catalogBannersData = [
  {
    href: "#",
    imgSrc: "./img/banner-small.png",
    popupText:
      "Металл.Кредит, ИНН 9712771890, erid: nWR26TK8SawRQk2nZWW21drBvbYeoQiFF",
  },
  {
    href: "#",
    imgSrc: "./img/banner-small2.png",
    popupText:
      "Металл.Кредит, ИНН 9712771890, erid: nWR26TK8SawRQk2nZWW21drBvbYeoQiFF",
  },
  {
    href: "#",
    imgSrc: "./img/banner-small1.png",
    popupText:
      "Металл.Кредит, ИНН 9712771890, erid: nWR26TK8SawRQk2nZWW21drBvbYeoQiFF",
  },
  {
    href: "#",
    imgSrc: "./img/banner-small2.png",
    popupText:
      "Металл.Кредит, ИНН 9712771890, erid: nWR26TK8SawRQk2nZWW21drBvbYeoQiFF",
  },
];

const bannerContainer = document.querySelector(".new-catalog__banners");
if (bannerContainer) {
  setupBannerRotation(
    bannerContainer,
    catalogBannersData,
    3,
    "new-catalog__banner"
  );
}

const promoBannersData = [
  {
    href: "#1",
    imgDesktop: "./img/banner1.png",
    imgMobile: "./img/banner-small1.png",
    popupText:
      "Металл.Кредит, ИНН 9712771890, erid: nWR26TK8SawRQk2nZWW21drBvbYeoQiFF",
  },
  {
    href: "#2",
    imgDesktop: "./img/banner2.png",
    imgMobile: "./img/banner-small2.png",
    popupText:
      "Металл.Кредит, ИНН 9712771890, erid: nWR26TK8SawRQk2nZWW21drBvbYeoQiFF",
  },
  {
    href: "#3",
    imgDesktop: "./img/banner.png",
    imgMobile: "./img/banner-small.png",
    popupText:
      "Металл.Кредит, ИНН 9712771890, erid: nWR26TK8SawRQk2nZWW21drBvbYeoQiFF",
  },
];

const promoContainers = document.querySelectorAll(".promo");
promoContainers.forEach((container) => {
  setupBannerRotation(container, promoBannersData, 1, "catalog-banner");
});

document.addEventListener("DOMContentLoaded", function () {
  const options = document.querySelectorAll(
    ".catalog-footer__popular__btns .btn-group__option"
  );
  const lists = document.querySelectorAll(
    ".catalog-footer__popular__list-wrapper .catalog-footer__popular__list"
  );

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedType = option.dataset.type;

      lists.forEach((list) => {
        const listType = list.dataset.type;
        if (listType === selectedType) {
          list.style.display = "";
          showLimitedOptions(list);
        } else {
          list.style.display = "none";
        }
      });
    });
  });

  function showLimitedOptions(list) {
    const options = list.querySelectorAll(
      ".catalog-footer__popular__option:not(.show__more-popular)"
    );
    const showMoreBtn = list.querySelector(".show__more-popular");

    options.forEach((el, idx) => {
      el.style.display = idx < 11 ? "" : "none";
    });

    if (options.length > 11 && showMoreBtn) {
      showMoreBtn.style.display = "";
      showMoreBtn.onclick = (event) => {
        event.preventDefault();
        options.forEach((el) => (el.style.display = ""));
        showMoreBtn.style.display = "none";
      };
    } else if (showMoreBtn) {
      showMoreBtn.style.display = "none";
    }
  }

  document
    .querySelector(".catalog-footer__popular__btns .btn-group__option.active")
    ?.click();
});

document.addEventListener("DOMContentLoaded", function () {
  const textBlock = document.querySelector(
    ".catalog-footer__description__text"
  );
  const toggleLink = document.querySelector(
    ".catalog-footer__description__link"
  );

  toggleLink.addEventListener("click", function (e) {
    e.preventDefault();
    textBlock.classList.toggle("expanded");
    toggleLink.textContent = textBlock.classList.contains("expanded")
      ? "Скрыть"
      : "Подробнее";
  });
});

function resetFilters() {
  // Очищаем URL параметры
  const url = new URL(window.location);
  url.search = "";
  window.history.pushState({}, "", url);

  [
    ...document.querySelectorAll(
      ".new-catalogForm__generated-filters .new-catalogForm__filter__ui"
    ),
    document.querySelector(
      ".new-catalogForm__sub-filters .new-catalogForm__filter__ui"
    ),
    document.querySelector(
      ".mobile-filter-wrapper.city .new-catalogForm__filter__ui"
    ),
    document.querySelector(
      ".new-catalogResults__header .new-catalogForm__filter__ui"
    ),
  ].forEach((filterWrapper) => {
    const input = filterWrapper.querySelector(
      ".new-catalogForm__filter__input"
    );
    input.classList.remove("active");
    input.placeholder = input.dataset.placeholder;
    if (input && input.hasAttribute("data-filter")) {
      input.dataset.filter = JSON.stringify({ range: "", list: [] });
    }
    const options = filterWrapper.querySelectorAll(
      ".select_wrapper .new-catalogForm__filter__select__option"
    );
    options.forEach((option) => {
      option.classList.remove("active");
    });
  });
  const btnGroupList = document.querySelectorAll(
    ".new-catalogForm__sub-filters .btn-group"
  );
  btnGroupList.forEach((btnGroup) => {
    const options = btnGroup.querySelectorAll(".btn-group__option");
    options.forEach((option) => {
      option.classList.remove("active");
      option.classList.remove("left");
    });
    // Добавляем класс active к первой опции
    if (options.length > 0) {
      options[0].classList.add("active");
    }
  });
}

document
  .querySelector(".new-catalogForm__controls__search__reset")
  .addEventListener("click", (event) => {
    event.preventDefault();
    resetFilters();
  });

// лоадер на кнопку "Показать предложения"
const btn = document.querySelector(".primary-btn.submit");
const content = btn.querySelector(".content");
const loader = btn.querySelector(".loader");

let loaderTimeout = null;
let isLoaderActive = false;

function btnLoaderStart() {
  if (isLoaderActive) return; // Предотвращаем множественные запуски

  isLoaderActive = true;
  content.classList.add("hidden");
  loader.classList.remove("hidden");

  // Защитный таймаут - если btnLoaderEnd не вызвался через 10 секунд, принудительно останавливаем
  loaderTimeout = setTimeout(() => {
    console.warn("Loader timeout - forcing end");
    btnLoaderEnd();
  }, 10000);
}

function btnLoaderEnd() {
  if (!isLoaderActive) return; // Предотвращаем множественные остановки

  isLoaderActive = false;
  content.classList.remove("hidden");
  loader.classList.add("hidden");

  if (loaderTimeout) {
    clearTimeout(loaderTimeout);
    loaderTimeout = null;
  }
}

// Принудительная остановка лоадера при ошибках
window.addEventListener("error", () => {
  btnLoaderEnd();
});

// Принудительная остановка лоадера при уходе со страницы
window.addEventListener("beforeunload", () => {
  btnLoaderEnd();
});

// Плашка сверху

const filterForm = document.querySelector(".new-catalogForm");
const stickyMenu = document.querySelector(".filter-sticky-menu");

function updateStickyWidth() {
  const rect = filterForm.getBoundingClientRect();
  // stickyMenu.style.width = `${rect.width}px`;
  stickyMenu.style.left = `${rect.left}px`;
}

function toggleStickyMenu() {
  const rect = filterForm.getBoundingClientRect();

  if (rect.bottom < 0) {
    stickyMenu.classList.add("visible");
    updateStickyWidth();
  } else {
    stickyMenu.classList.remove("visible");
  }
}

window.addEventListener("scroll", toggleStickyMenu);
window.addEventListener("resize", updateStickyWidth);

stickyMenu
  .querySelector(".filter-sticky-menu__btn")
  .addEventListener("click", () => {
    filterForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });

document.querySelectorAll(".tdata").forEach((cell) => {
  const content = cell.querySelector(".tdvalue") || cell;

  cell.addEventListener("mouseenter", () => {
    if (content.scrollWidth > content.clientWidth) {
      cell.classList.add("hover-visible");
    }
  });

  cell.addEventListener("mouseleave", () => {
    cell.classList.remove("hover-visible");
  });
});

let initialViewportHeight = window.visualViewport.height;
const viewport = window.visualViewport;

function updateButtonPosition() {
  const buttons = document.querySelectorAll(".primary-btn.mobile-apply");

  // Проверяем, что это мобильное устройство
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    );

  // Проверяем, что это НЕ Яндекс.Браузер
  const isYandex = /YaBrowser/i.test(window.navigator.userAgent);

  if (!isMobile || isYandex) {
    // На десктопе или в Яндекс.Браузере оставляем стандартное положение
    buttons.forEach((btn) => {
      btn.style.position = "fixed";
      btn.style.bottom = "24px";
    });
    return;
  }

  // Для всех остальных мобильных браузеров: используем VisualViewport
  const currentViewportHeight = viewport.height;
  const keyboardHeight = initialViewportHeight - currentViewportHeight;

  buttons.forEach((btn) => {
    if (keyboardHeight > 100) {
      // Клавиатура открыта - поднимаем кнопку
      btn.style.position = "fixed";
      btn.style.bottom = `${keyboardHeight + 16}px`;
    } else {
      // Клавиатура закрыта
      btn.style.position = "fixed";
      btn.style.bottom = "24px";
    }
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  initialViewportHeight = window.visualViewport.height;
  updateButtonPosition();
});

// Отслеживание изменений VisualViewport (только для не-Яндекс браузеров)
window.visualViewport.addEventListener("resize", updateButtonPosition);

// Отслеживание скролла (только для не-Яндекс браузеров)
window.addEventListener("scroll", updateButtonPosition);

// Обработка фокуса (только для не-Яндекс браузеров)
document.addEventListener("focusout", (e) => {
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    );
  const isYandex = /YaBrowser/i.test(window.navigator.userAgent);

  if (
    isMobile &&
    !isYandex &&
    (e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.contentEditable === "true")
  ) {
    setTimeout(updateButtonPosition, 100);
  }
});

document.addEventListener("focusin", (e) => {
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    );
  const isYandex = /YaBrowser/i.test(window.navigator.userAgent);

  if (
    isMobile &&
    !isYandex &&
    (e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.contentEditable === "true")
  ) {
    setTimeout(updateButtonPosition, 100);
  }
});

// Безопасный парсинг JSON
function safeJsonParse(str, defaultValue = { range: "", list: [] }) {
  if (!str || str === "undefined" || str === "null") {
    return defaultValue;
  }

  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("JSON parse error:", error, "for string:", str);
    return defaultValue;
  }
}

function mainFiltersMobileLogic() {
  const mainFiltersContainer = document.querySelector(
    ".new-catalogForm__main-filters"
  );

  const filters = mainFiltersContainer.querySelectorAll(
    ".new-catalogForm__filter"
  );
  filters.forEach((filter) => {
    const options = filter.querySelectorAll(
      ".new-catalogForm__filter__select__option"
    );
    const input = filter.querySelector(".new-catalogForm__filter__input");
    options.forEach((option) => {
      option.addEventListener("click", (event) => {
        if (isDesktop()) return;
        event.preventDefault();
        input.placeholder = option.innerText;
        filter.querySelector(".select_wrapper").classList.remove("open");

        if (input.name === "city") {
          document.querySelector(
            ".new-catalogResults__header__mobile-filters .new-catalogForm__filter__input"
          ).placeholder = option.innerText;
        }
        filter.querySelector(
          ".mobile-filter-header__selected-option"
        ).innerHTML = option.innerText;

        // Добавляем query параметры в URL
        const url = new URL(window.location);
        if (option.dataset.value === "all") {
          url.searchParams.delete(input.name);
          input.classList.remove("active");
        } else {
          url.searchParams.set(input.name, option.dataset.value);
        }
        window.history.pushState({}, "", url);
      });
    });
  });
}
mainFiltersMobileLogic();

function btnGroupFilterLogic() {
  const btnGroupList = document.querySelectorAll(
    ".new-catalogForm__sub-filters .btn-group"
  );
  btnGroupList.forEach((btnGroup) => {
    const wrapper = btnGroup.querySelectorAll(".btn-group__wrapper");
    wrapper.forEach((wrapper) => {
      const options = wrapper.querySelectorAll(".btn-group__option");
      options.forEach((option) => {
        option.addEventListener("click", () => {
          // Добавляем query параметры в URL
          const url = new URL(window.location);
          if (option.dataset.value === "all") {
            url.searchParams.delete(btnGroup.dataset.value);
          } else {
            url.searchParams.set(btnGroup.dataset.value, option.dataset.value);
          }
          window.history.pushState({}, "", url);
        });
      });
    });
  });
}
btnGroupFilterLogic();

function cityBtnsListFilterLogic() {
  const btnsList = document.querySelectorAll(
    ".new-catalogForm__filter__select .buttons-list__el"
  );
  btnsList.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      if (!isDesktop()) {
        event.preventDefault();
        btnsList.forEach((btn) => {
          btn.classList.remove("active-btn");
        });
        btn.classList.add("active-btn");
        const uiWrapper = btn.closest(".new-catalogForm__filter__ui");
        uiWrapper
          .querySelector(".select_wrapper.open")
          .classList.remove("open");
        uiWrapper.querySelector(
          ".mobile-filter-header__selected-option"
        ).innerHTML = btn.innerText.trim();
        uiWrapper.querySelector(".new-catalogForm__filter__input").placeholder =
          btn.innerText.trim();
        document
          .querySelector(
            ".new-catalogResults__header__mobile-filters .new-catalogForm__filter__input"
          ).placeholder = btn.innerText.trim();
        const url = new URL(window.location);
        if (btn.dataset.value === "Все города") {
          url.searchParams.delete("city");
          uiWrapper.querySelector(
            ".new-catalogForm__filter__input"
          ).classList.remove("active");
        } else {
          url.searchParams.set("city", btn.dataset.value);
          uiWrapper.querySelector(
            ".new-catalogForm__filter__input"
          ).classList.add("active");
        }
        window.history.pushState({}, "", url);
      }
    });
  });
}
cityBtnsListFilterLogic();


function cityFilterLogic(){
  const cityFilter = document.querySelector(
    ".mobile-filter-wrapper.city .new-catalogForm__filter .new-catalogForm__filter__ui"
  );
  const input = cityFilter.querySelector(".new-catalogForm__filter__input");
  const options = cityFilter.querySelectorAll(
    ".new-catalogForm__filter__select__option"
  );
  options.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.preventDefault();
      input.placeholder = option.innerText.trim();

      options.forEach((option) => {
        option.classList.remove("active");
      });
      option.classList.add("active");

      cityFilter.querySelector(".select_wrapper").classList.remove("open");
      cityFilter.querySelector(
        ".mobile-filter-header__selected-option"
      ).innerHTML = option.innerText.trim();


      const url = new URL(window.location);
      if (option.dataset.value === "Все города") {
        url.searchParams.delete("city");
        input.classList.remove("active");
      } else {
        url.searchParams.set("city", option.dataset.value);
        input.classList.add("active");
      }
      window.history.pushState({}, "", url);
    });
  });
}
cityFilterLogic()