'use strict';

// ВИБІР ЕЛЕМЕНТІВ
const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');


//******МОДАЛЬНЕ ВІКНО***********************************************************************************************************************************
const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button => button.addEventListener('click', openModalWindow));

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});
//*******************************************************************************************************************************************************


//******ПЛАВНЕ ПРОКРУЧУВАННЯ****************************************************************************************************************************
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//*******************************************************************************************************************************************************


//******ДЕЛЕГУВАННЯ ПОДІЙ - ПЛАВНЕ ПРОКРУЧУВАННЯ*********************************************************************************************************
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  console.log(e.target);

  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    console.log(href);
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
});
//*******************************************************************************************************************************************************


//***************ТАБИ************************************************************************************************************************************
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const clickedButton = e.target.closest('.operations__tab');

  if (!clickedButton) return;

  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
  clickedButton.classList.add('operations__tab--active');

  tabContents.forEach((content) => content.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clickedButton.dataset.tab}`).classList.add('operations__content--active');
});

//*******************************************************************************************************************************************************


//******ПРИГЛУШЕНИЙ КОЛІР ПОСИЛАНЬ ПІСЛЯ НАТИСКАННЯ******************************************************************************************************
const nav = document.querySelector('.nav');

const navLinksHoverAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const siblingLinks = linkOver.closest('.nav__links').querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach((el) => {
      if (el !== linkOver) el.style.opacity = this;
    });
    logo.style.opacity = this;
    logoText.style.opacity = this;
  }
};

nav.addEventListener('mouseover', navLinksHoverAnimation.bind(0.4));
nav.addEventListener('mouseout', navLinksHoverAnimation.bind(1));
//*******************************************************************************************************************************************************




//***********STICKY NAVIGATION WITH INTERSECTION OBSERVER API********************************************************************************************
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const getStickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
//*******************************************************************************************************************************************************


//***********ПОКАЗ ЕЛЕМЕНТІВ ПРИ ПРОКРУЧИВАННІ***********************************************************************************************************
const allSections = document.querySelectorAll('.section');

const sectionAppearance = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(sectionAppearance, {
  root: null,
  threshold: 0.1,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})
//*******************************************************************************************************************************************************


//***********LAZY LOADING********************************************************************************************************************************
const lazyImages = document.querySelectorAll('img[data-src]');

const loadImages = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.1,
  rootMargin: '300px',
});

lazyImages.forEach((image) => lazyImagesObserver.observe(image));
//*******************************************************************************************************************************************************


//***********СЛАЙДЕР*************************************************************************************************************************************
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const slidesNumber = slides.length;

// Дотси
const createDots = function () {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    )
  })
};
createDots();

const activateCurrentDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach((dot) => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}
activateCurrentDot(0);

const moveToSlide = function (slide) {
  slides.forEach((s, index) => s.style.transform = `translateX(${(index - slide) * 100}%)`);
}

moveToSlide(0);

const nextSlide = function () {
  if (currentSlide === slidesNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
}

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slidesNumber - 1;
  } else {
    currentSlide--;
  }

  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);

}

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') previousSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
})
//*******************************************************************************************************************************************************