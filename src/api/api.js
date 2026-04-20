const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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

// Review API
export const getApprovedReviewsByProduct = (productId) => fetchData(`/reviews/product/${productId}`);
export const getAllApprovedReviews = () => fetchData('/reviews/approved');
export const postReview = async (reviewData) => {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  return await response.json();
};
