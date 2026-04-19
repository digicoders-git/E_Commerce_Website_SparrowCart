export const mapProduct = (backendProduct) => {
  if (!backendProduct) return null;
  
  return {
    id: backendProduct._id,
    name: backendProduct.name,
    description: backendProduct.description || '',
    price: backendProduct.offerPrice || backendProduct.price,
    originalPrice: backendProduct.price,
    image: backendProduct.images && backendProduct.images.length > 0 ? backendProduct.images[0] : 'https://via.placeholder.com/300',
    images: backendProduct.images || [],
    category: backendProduct.category?.title || 'General',
    categoryId: backendProduct.category?._id || backendProduct.category,
    badge: backendProduct.percentageOff > 0 ? `${backendProduct.percentageOff}% OFF` : '',
    rating: 4.5, // Mocked as backend doesn't have it yet
    reviews: Math.floor(Math.random() * 100) + 10, // Mocked
    stock: backendProduct.stockQuantity || 0,
    unit: backendProduct.unit || 'piece'
  };
};

export const mapCategory = (backendCategory) => {
  if (!backendCategory) return null;
  
  return {
    id: backendCategory._id,
    name: backendCategory.title,
    image: backendCategory.imageUrl || 'https://via.placeholder.com/150'
  };
};

export const mapSlider = (backendSlider) => {
  if (!backendSlider) return null;
  
  return {
    id: backendSlider._id,
    title: backendSlider.title,
    subtitle: backendSlider.subtitle || '',
    desc: backendSlider.subtitle || '', // Mapping subtitle to desc if needed
    tag: 'NEW', // Default tag
    cta: 'Shop Now',
    ctaLink: backendSlider.redirectUrl || '/products',
    image: backendSlider.imageUrl || 'https://via.placeholder.com/1200x500',
    bg: 'from-[#0F3D3E] to-[#1a5557]', // Default bg
    accent: '#1FB6C9', // Default accent
    badge: { text: 'Sale', sub: 'Active' }
  };
};

export const mapOfferImage = (backendOfferImage) => {
  if (!backendOfferImage) return null;
  return {
    id: backendOfferImage._id,
    image: backendOfferImage.imageUrl,
    isActive: backendOfferImage.isActive
  };
};

export const mapOfferText = (backendOfferText) => {
  if (!backendOfferText) return null;
  return {
    id: backendOfferText._id,
    text: backendOfferText.text,
    isActive: backendOfferText.isActive
  };
};
