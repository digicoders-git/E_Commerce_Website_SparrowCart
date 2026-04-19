const BASE_URL = 'http://localhost:5000/api';

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

export const getProducts = () => fetchData('/products');
export const getCategories = () => fetchData('/categories');
export const getSliders = () => fetchData('/sliders');
export const getOfferImages = () => fetchData('/offer-images');
export const getOfferTexts = () => fetchData('/offer-texts');
export const getProductById = (id) => fetchData(`/products/${id}`);
