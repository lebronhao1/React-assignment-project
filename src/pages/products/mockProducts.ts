type Product = {
  id: string;
  photo: string;
  userName: string;
  title: string;
  pricingOption: 'Paid' | 'Free' | 'View Only';
  price?: number;
};

const mockProducts: Product[] = [
  {
    id: '1',
    photo: 'https://via.placeholder.com/300?text=Product+Image',
    userName: 'Anisha Smith',
    title: 'Design Course',
    pricingOption: 'Paid',
    price: 49.99
  },
  {
    id: '2',
    photo: 'https://via.placeholder.com/300',
    userName: 'John Doe',
    title: 'Free Template',
    pricingOption: 'Free'
  },
  {
    id: '3',
    photo: 'https://via.placeholder.com/300',
    userName: 'Emma Johnson',
    title: 'Portfolio Showcase',
    pricingOption: 'View Only'
  },
  {
    id: '4',
    photo: 'https://via.placeholder.com/300',
    userName: 'Michael Brown',
    title: 'Premium Plugin',
    pricingOption: 'Paid',
    price: 29.99
  },
  {
    id: '5',
    photo: 'https://via.placeholder.com/300',
    userName: 'Sarah Wilson',
    title: 'Open Source Library',
    pricingOption: 'Free'
  },
  {
    id: '6',
    photo: 'https://via.placeholder.com/300',
    userName: 'David Lee',
    title: 'Case Study',
    pricingOption: 'View Only'
  },
  {
    id: '7',
    photo: 'https://via.placeholder.com/300',
    userName: 'Anisha Patel',
    title: 'UI Kit',
    pricingOption: 'Paid',
    price: 19.99
  },
  {
    id: '8',
    photo: 'https://via.placeholder.com/300',
    userName: 'Robert Taylor',
    title: 'Free Icon Set',
    pricingOption: 'Free'
  },
  {
    id: '9',
    photo: 'https://via.placeholder.com/300',
    userName: 'Lisa Chen',
    title: 'Design System',
    pricingOption: 'View Only'
  },
  {
    id: '10',
    photo: 'https://via.placeholder.com/300',
    userName: 'James Wilson',
    title: 'Video Tutorial',
    pricingOption: 'Paid',
    price: 9.99
  },
  {
    id: '11',
    photo: 'https://via.placeholder.com/300',
    userName: 'Anisha Gupta',
    title: 'Free Font',
    pricingOption: 'Free'
  },
  {
    id: '12',
    photo: 'https://via.placeholder.com/300',
    userName: 'Daniel Kim',
    title: 'Design Article',
    pricingOption: 'View Only'
  },
  {
    id: '13',
    photo: 'https://via.placeholder.com/300',
    userName: 'Olivia Martin',
    title: 'Premium Template',
    pricingOption: 'Paid',
    price: 39.99
  },
  {
    id: '14',
    photo: 'https://via.placeholder.com/300',
    userName: 'William Davis',
    title: 'Free Stock Photo',
    pricingOption: 'Free'
  },
  {
    id: '15',
    photo: 'https://via.placeholder.com/300',
    userName: 'Sophia Garcia',
    title: 'Design Process',
    pricingOption: 'View Only'
  },
  {
    id: '16',
    photo: 'https://via.placeholder.com/300',
    userName: 'Anisha Johnson',
    title: 'Illustration Pack',
    pricingOption: 'Paid',
    price: 24.99
  },
  {
    id: '17',
    photo: 'https://via.placeholder.com/300',
    userName: 'Ethan Wilson',
    title: 'Free Mockup',
    pricingOption: 'Free'
  },
  {
    id: '18',
    photo: 'https://via.placeholder.com/300',
    userName: 'Ava Martinez',
    title: 'Design Guide',
    pricingOption: 'View Only'
  },
  {
    id: '19',
    photo: 'https://via.placeholder.com/300',
    userName: 'Noah Anderson',
    title: 'Animation Toolkit',
    pricingOption: 'Paid',
    price: 34.99
  },
  {
    id: '20',
    photo: 'https://via.placeholder.com/300',
    userName: 'Mia Thompson',
    title: 'Free Color Palette',
    pricingOption: 'Free'
  }
];

export default mockProducts;
