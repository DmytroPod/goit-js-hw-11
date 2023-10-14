import Notiflix, { Loading } from 'notiflix';

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
const { form, gallery } = refs;

let searchQuery = '';
let page = 1;

form.addEventListener('submit', onSubmit);
async function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value;
  page = 1;

  if (!searchQuery) {
    Notiflix.Notify.failure('Enter search data');
    return;
  }

  try {
    const data = await fetchPixabay(searchQuery, page);
    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
      return;
    }
    marcupArr = data.hits;
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
      const data = await fetchPixabay(searchQuery, page);
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
