// import Notiflix from 'notiflix';
import axios from 'axios';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  btnSearch: document.querySelector('.submit'),
  gallery: document.querySelector('.gallery'),
};

const { form, gallery } = refs;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39954424-47304ed465a3c8c1a64f1cd2f';

async function fetchPixabay(query, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });

  const responce = await axios.get(`${BASE_URL}?${params}`);

  return responce.data;
}
fetchPixabay('cat', 1).then(data => {
  console.log(data);
});

form.addEventListener('submit', onSubmit);

let searchQuery = '';
let page = 1;

async function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value;
  page = 1;

  const data = await fetchPixabay(searchQuery, page);

  const markup = createMarkup(data.hits);
  gallery.innerHTML = markup;

  const lightbox = new SimpleLightbox('.gallery a');
  form.reset();
}

function createMarkup(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}" class="gallery-item">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </a>`;
      }
    )
    .join('');
}
