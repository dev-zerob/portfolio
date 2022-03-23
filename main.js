'use strict';

// Make navbar transparent when it is on the top
const $navbar = document.querySelector('#navbar');
const navbarHeight = $navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    $navbar.classList.add('navbar--dark');
  } else {
    $navbar.classList.remove('navbar--dark');
  }
});

// Handle scrolling when tapping on the navbar menu
const $navbarMenu = document.querySelector('.navbar__menu');
$navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }

  $navbarMenu.classList.remove('open');
  scrollIntoView(link);
});

// Handle click on "contact me" button on home
const $homeContactBtn = document.querySelector('.home__contact');
$homeContactBtn.addEventListener('click', () => {
  scrollIntoView('#contact');
});

// Make home slowly fade to transparent as the window scrolls down
const $home = document.querySelector('.home__container');
const homeHeight = $home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  $home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Navbar toggle button for small screen
const $navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
$navbarToggleBtn.addEventListener('click', () => {
  $navbarMenu.classList.toggle('open');
});


// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector(".arrow-up");
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

// Handle Click on the "arrow up" button
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

// Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (event) => {
  const filter = event.target.dataset.filter || event.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }

  // remove selection from the previous item and select the new one
  const active = document.querySelector('.category__btn.selected');
  active.classList.remove('selected');
  const target = event.target.nodeName === 'BUTTON' ? event.target : event.target.parentNode;
  target.classList.add('selected');

  projectContainer.classList.add('animate-out');
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === 'all' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });

    projectContainer.classList.remove('animate-out');
  }, 300);
});

const sectionIds = ['#home', '#about', '#skills', '#work', '#testimonials', '#contact'];
const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) => document.querySelector(`[data-link="${id}"]`));

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth"});
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
};
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤링이 아래로 되어서 페이지가 올라옴      
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

// scroll과 whell의 차이는 scroll은 모든 스크롤, wheel은 사용자가 직접 스크롤할 때 발생하는 event
window.addEventListener('wheel', () => {
  if (window.scrollY === 0 ){
    selectedNavIndex = 0;
  } else if (window.scrollY + window.innerHeight === document.body.clientHeight) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});
