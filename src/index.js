import Notiflix from 'notiflix';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './JS/marcup.js';
import { fetchPixabay } from './JS/pixabay.js';
import { refs } from './JS/refs.js';
const options = {
  root: null, // відслідковуємо весь viewport
  rootMargin: '200px', // відступи від кордонів viewport
  threshold: 1, // коли хоча б половина цільового елемента видима
};
const { form, gallery, btnSearch } = refs;

let query = '';
let page = 1;
let marcupArr = [];
form.addEventListener('submit', onSubmit);
async function onSubmit(e) {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value;
  console.log(query);
  page = 1;

  if (!query.trim()) {
    Notiflix.Notify.failure('Enter search data');
    return;
  }

  try {
    const data = await fetchPixabay(query, page);
    if (data.totalHits === 0) {
      console.log(data.totalHits);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
      return;
    }
    marcupArr = data.hits;
    console.log(marcupArr);
    const markup = createMarkup(marcupArr);
    gallery.innerHTML = markup;

    observer.observe(lastImage);

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
  });
  form.reset();
}

const observer = new IntersectionObserver(handleIntersection, options);
const lastImage = document.querySelector('.target');

async function handleIntersection(entries, observer) {
  entries.forEach(async entry => {
    if (!entry.isIntersecting) {
      return;
    }
    page += 1;
    try {
      const data = await fetchPixabay(query, page);
      const newMarkupArr = data.hits;

      if (newMarkupArr.length > 0) {
        const newMarkup = createMarkup(newMarkupArr);
        gallery.insertAdjacentHTML('beforeend', newMarkup);
      } else {
        observer.unobserve(lastImage);
      }
    } catch {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    lightbox.refresh();
  });
}
