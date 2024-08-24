const place = document.querySelector(".place");
const companyWrap = document.querySelector(".company__bottom");
const companyTabs = document.querySelectorAll(".company__tab-btn");
const companyDescr = document.querySelectorAll(".company__descr");

// кнопка формы
const form = document.querySelector(".question__form");
const nameValue = document.querySelector("#name");
const numberValue = document.querySelector("#number");
const mailValue = document.querySelector("#mail");
const questionValue = document.querySelector("#questionText");

// buildings
const buildingList = document.querySelector('.buildings__list');
const buildingItems = document.querySelectorAll('.building__item');

// Получаем ширину одного слайда (включая gap)
const slideWidth = buildingItems[0].offsetWidth + 20;

// Кнопка ипотечного калькулятора
const btnMortgage = document.querySelector(".mortgage__button");


// Текущая позиция слайда (индекс текущего элемента)
let currentIndex = 0;

// Изображения place
const placeImages = [
    "./images/place/place-1.jpg",
    "./images/place/place-2.jpg",
    "./images/place/place-3.jpg",
    "./images/place/place-4.jpg",
];

const companyImages = [
    "./images/company/photo-1.jpg",
    "./images/company/photo-2.jpg",
]

let index = 0;

document.addEventListener("click", (event) => {

    // если клик был на кнопок place то меняем url place
    if (event.target.closest("#placeNext")) {
        nextSlide(placeImages, place)
    }

    if (event.target.closest("#placePrev")) {
        prevSlide(placeImages, place);
    }

    // если клик был на кнопок company то меняем url company
    if (event.target.closest("#companyNext")) {
        nextSlide(companyImages, companyWrap);
    }

    if (event.target.closest("#companyPrev")) {
        prevSlide(companyImages, companyWrap);
    }

    // Клик на кнопок buidlings (слайдер)
    if (event.target.closest("#buildingPrev")) {
        buildingPrev()
    }

    if (event.target.closest("#buildingNext")) {
        buildingNext()
    }

    if (!event.target.closest(".header-services")) {
        headerSubMenu.classList.remove("submenu-active");
        headerArrow.classList.remove("arrow-active");
        return;
    }

})


// Функции для кнопок
function nextSlide(arr, content) {
    index++;

    if (index >= arr.length) {
        index = 0;
    }
    content.style.backgroundImage = `url(${arr[index]})`;
}

function prevSlide(arr, content) {
    index--;

    if (index < 0) {
        index = arr.length - 1; // Если индекс стал меньше нуля, перемещаемся на последний элемент массива
    }

    content.style.backgroundImage = `url(${arr[index]})`;
}

// Функции для кнопок buildings
function buildingPrev() {
    if (currentIndex > 0) {
        currentIndex -= 1;
        console.log("Мы в if: " + currentIndex);
    } else {
        currentIndex = buildingItems.length - 3; // Переходим к последнему элементу
        console.log("Мы в else: " + currentIndex);
    }
    buildingList.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
}

function buildingNext() {
    if (currentIndex < buildingItems.length - 3) {
        currentIndex++;
        buildingList.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    } else {
        currentIndex = 0; // Возвращаемся к первому элементу
        buildingList.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    }
}

// Работа с табами
companyTabs.forEach((tab) => {
    tab.addEventListener("click", tabActive);
})

function tabActive(event) {
    let target = event.target;

    companyTabs.forEach((item) => {
        item.classList.remove("company-active")
    })

    target.classList.add("company-active")

    companyDescr.forEach((item) => {
        item.classList.remove("decr-active");

        if (target.dataset.companyBtn == item.id) {
            item.classList.add("decr-active");
        }
    })
}

// ипотечный калькулятор 
function calcMortgage() {

    // инпуты
    const cost = parseInt(document.querySelector("#cost").value);
    const deposit = parseInt(document.querySelector("#deposit").value);
    const period = parseInt(document.querySelector("#period").value);
    const rate = parseFloat(document.querySelector("#rate").value);

    // HTML результат
    const resultMonth = document.querySelector("#resultMonth");
    const resultProcent = document.querySelector("#resultProcent");
    const resultSum = document.querySelector("#resultSum");
    const resultEndDate = document.querySelector("#resultEndDate");

    if (isNaN(cost) || isNaN(deposit) || isNaN(period) || isNaN(rate) || period <= 0 || cost <= 0 || deposit < 0) {
        alert('Пожалуйста, введите корректные значения');
        return;
    } else {
        // сумма кредита
        const amount = cost - deposit;

        // Ежемесячная процентная ставка
        const monthRate = (rate / 100) / 12;

        // Общее количество месяцев (срок кредита в месяцах)
        const numMonth = period * 12;

        // Формула для расчета ежемесячного платежа (аннуитет)
        const monthlyPayment = amount * monthRate / (1 - Math.pow(1 + monthRate, -numMonth));

        // Расчет даты последнего платежа (начало выплат с сентября 2024 года)
        const startDate = new Date(2024, 8, 1); // Сентябрь 2024 года
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + numMonth);

        resultMonth.innerHTML = `${monthlyPayment.toFixed(1)} у.е.`;
        resultProcent.innerHTML = `${rate}%`;
        resultSum.innerHTML = `${amount} у.е.`;
        resultEndDate.innerHTML = `${endDate.toLocaleDateString()}`;
    }

    document.querySelector("#cost").value = " ";
    document.querySelector("#deposit").value = " ";
    document.querySelector("#period").value = " ";
    document.querySelector("#rate").value = " ";
}

btnMortgage.addEventListener("click", calcMortgage);


// Функция для проверки email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Функция для проверки телефона (пример для России, можно адаптировать)
function validatePhone(phone) {
    const re = /^\d{10,12}$/; // Номер телефона должен содержать от 10 до 12 цифр
    return re.test(String(phone));
}

form.addEventListener("submit", (event) => {

    let isValid = true;

    // проверка имени
    if (nameValue.value.trim() == "") {
        isValid = false;
        nameValue.classList.add("error");
        event.preventDefault();
    } else {
        isValid = true;
        nameValue.classList.remove("error");
    }

    // Валидация номера телефона
    if (numberValue.value.trim() === "" || !validatePhone(numberValue.value.trim())) {
        isValid = false;
        numberValue.classList.add("error");
        event.preventDefault();
    } else {
        isValid = true;
        numberValue.classList.remove("error");
    }

    // Валидация email (если поле заполнено)
    if (mailValue.value.trim() !== "" && !validateEmail(mailValue.value.trim())) {
        isValid = false;
        mailValue.classList.add("error")
        event.preventDefault();
    } else {
        isValid = true;
        mailValue.classList.remove("error")
    }

    // Валидация поля вопроса (необязательное, но если заполняется, проверить длину)
    if (questionValue.value.trim() == "" || questionValue.value.length < 5) {
        isValid = false;
        questionValue.classList.add("error");
        event.preventDefault();
    } else {
        isValid = true;
        questionValue.classList.remove("error");
    }

    if (isValid) {
        alert("Форма отправлена");
    }

})


// Работа с бургер меню
const burgerBtn = document.querySelector(".burger");
const headerNav = document.querySelector(".header__nav");
const body = document.querySelector("body")
const callMobile = document.querySelector(".mobile");
const headerMobileCall = document.querySelector(".header__mobile-link");
const burgerBlock = document.querySelector(".burger__bloc");

burgerBtn.addEventListener("click", (event) => {
    burgerBtn.classList.toggle("burger-active");
    headerNav.classList.toggle("header-open");
    body.classList.toggle("body-low");
    callMobile.classList.toggle("lang__mobile-active");
    headerMobileCall.classList.toggle("header__mobile-link-active");
    burgerBlock.classList.toggle("burger__bloc-active")

})


// Работа с кнопкой nav Услуги и ховеры
const headerServices = document.querySelector(".header-services");
const headerArrow = document.querySelector(".header__arrow");
const headerSubMenu = document.querySelector(".header__submenu");


headerServices.addEventListener("click", (event) => {

    if (event.target.closest(".header-services") && headerSubMenu.closest(".submenu-active")) {

        console.log("мы в if")
        headerSubMenu.classList.remove("submenu-active");
    } else {
        console.log("Мы в else")
        headerSubMenu.classList.add("submenu-active");
    }

})

