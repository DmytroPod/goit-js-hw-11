import Notiflix, { Loading } from 'notiflix';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './JS/marcup.js';
import { fetchPixabay } from './JS/pixabay.js';
import { refs } from './JS/refs.js';

const { form, gallery } = refs;

form.addEventListener('submit', onSubmit);

let searchQuery = '';
let page = 1;

async function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value;
  page = 11;
  let marcupArr = [];
  if (!searchQuery) {
    Notiflix.Notify.failure('Enter search data');
    return;
  }

  try {
    const data = await fetchPixabay(searchQuery, page);
    marcupArr = data.hits;

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    const markup = createMarkup(marcupArr);

    gallery.innerHTML = markup;
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  const lightbox = new SimpleLightbox('.gallery a');
  form.reset();
}
const options = {
  root: null, // відслідковуємо весь viewport
  rootMargin: '200px', // відступи від кордонів viewport
  threshold: 1, // коли хоча б половина цільового елемента видима
};

const observer = new IntersectionObserver(handleIntersection, options);
const lastImage = document.querySelector('.target');
observer.observe(lastImage);

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;

      fetchPixabay(searchQuery, page)
        .then(data => {
          console.log(page);
          const newMarkupArr = data.hits;

          if (newMarkupArr.length > 0) {
            const newMarkup = createMarkup(newMarkupArr);
            gallery.insertAdjacentHTML('beforeend', newMarkup);
          } else {
            observer.unobserve(lastImage);
          }
        })
        .catch(error => {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        });
    }
  });
}
