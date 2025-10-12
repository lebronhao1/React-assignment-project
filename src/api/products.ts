import { fakeProducts } from './fake-products';
import { PricingOption } from '../store/productsSlice';

type Product = {
  id: string;
  photo: string;
  userName: string;
  title: string;
  pricingOption: PricingOption;
  price?: number;
};

interface ApiProduct {
  id: string;
  imagePath: string;
  creator: string;
  title: string;
  pricingOption: 0 | 1 | 2;
  price?: number;
}

const FAKE_PRODUCTS = fakeProducts.map(product => ({
  id: product.id,
  photo: product.imagePath,
  userName: product.creator,
  title: product.title,
  pricingOption: product.pricingOption,
  price: product.price
}));

function mapPricingOptionFromNumber(option: number): PricingOption {
  switch (option) {
    case 0: return PricingOption.FREE;
    case 1: return PricingOption.PAID;
    case 2: return PricingOption.VIEW_ONLY;
    default: return PricingOption.FREE;
  }
}


let cachedProducts: Product[] | null = null;
let isFetching = false;

export async function fetchProducts(): Promise<Product[]> {
  if (cachedProducts) {
    return cachedProducts;
  }

  if (isFetching) {
    return new Promise((resolve) => {
      const checkCache = () => {
        if (cachedProducts) {
          resolve(cachedProducts);
        } else {
          setTimeout(checkCache, 100);
        }
      };
      checkCache();
    });
  }

  isFetching = true;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch('https://closet-recruiting-api.azurewebsites.net/api/data', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiProducts: ApiProduct[] = await response.json();

    // Map API product structure to our application's Product type
  const products = apiProducts.map(apiProduct => ({
    id: apiProduct.id,
    photo: apiProduct.imagePath,
    userName: apiProduct.creator,
    title: apiProduct.title,
    pricingOption: apiProduct.pricingOption,
    price: apiProduct.price
  }));

    cachedProducts = products;
    isFetching = false;
    return products;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn('API request timed out, using fallback data');
      return FAKE_PRODUCTS;
    }
    console.error('Error fetching products:', error);
    throw error;
  }
}

function mapPricingOption(apiType?: 'paid' | 'free' | 'view'): 0 | 1 | 2 {
  switch (apiType) {
    case 'paid': return 1; // Paid
    case 'free': return 0; // Free
    case 'view': return 2; // View Only
    default:
      console.warn(`Unknown pricing option: ${apiType}, defaulting to Free`);
      return 0; // Default to Free
  }
}
