const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  // Check for JWT token first (from backend login)
  const jwtToken = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (jwtToken) return jwtToken;
  
  // Fallback: check for session user (from AuthContext)
  const session = localStorage.getItem('sparrowcart_session');
  if (session) {
    try {
      const user = JSON.parse(session);
      return user.token; // if token exists in user object
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle auth errors
const handleAuthError = (response) => {
  if (response.status === 401) {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('sparrowcart_session');
    
    // Show session expired message
    console.warn('Session expired. Please login again.');
    
    // Optionally redirect to login
    // window.location.href = '/login';
    
    throw new Error('Session expired. Please login again.');
  }
};

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      handleAuthError(response);
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
export const getSearchSuggestions = (query) => fetchData(`/products/search/suggestions?query=${query}`);


// Review API
export const getApprovedReviewsByProduct = (productId) => fetchData(`/reviews/product/${productId}`);
export const getAllApprovedReviews = () => fetchData('/reviews/approved');
export const postReview = async (reviewData) => {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData)
  });
  
  if (!response.ok) {
    handleAuthError(response);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// User Authentication APIs
export const sendOtp = async (phone) => {
  const response = await fetch(`${BASE_URL}/users/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return await response.json();
};

export const verifyOtp = async (phone, otp) => {
  const response = await fetch(`${BASE_URL}/users/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  const result = await response.json();
  
  // Store JWT token if login successful
  if (result.success && result.token) {
    localStorage.setItem('authToken', result.token);
  }
  
  return result;
};

// User Profile APIs (JWT required)
export const getUserProfile = async () => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    handleAuthError(response);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const updateUserProfile = async (userData) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    handleAuthError(response);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};