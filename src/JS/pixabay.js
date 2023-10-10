import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39954424-47304ed465a3c8c1a64f1cd2f';

export async function fetchPixabay(query, page = 1) {
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
