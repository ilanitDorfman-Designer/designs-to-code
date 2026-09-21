// Sample data interface
export interface SampleDataItem extends Record<string, unknown> {
  id: string;
  gain: number;
  peak: string;
  buyPrice: string;
  sellPrice: string;
}

// Sample data
export const sampleData: SampleDataItem[] = [
  {
    id: '1',
    gain: 79467,
    peak: 'Ullam quis facere soluta.',
    buyPrice: '150.25',
    sellPrice: '150.20',
  },
  {
    id: '2',
    gain: 94308,
    peak: 'Ea nemo aut dolorem beatae.',
    buyPrice: '305.50',
    sellPrice: '305.45',
  },
  {
    id: '3',
    gain: 52341,
    peak: 'Lorem ipsum dolor sit.',
    buyPrice: '230.75',
    sellPrice: '230.70',
  },
  {
    id: '4',
    gain: 67890,
    peak: 'Quisquam est qui dolorem.',
    buyPrice: '125.30',
    sellPrice: '125.25',
  },
  {
    id: '5',
    gain: 81234,
    peak: 'Voluptatem accusantium doloremque.',
    buyPrice: '2800.50',
    sellPrice: '2800.45',
  },
  {
    id: '6',
    gain: 45678,
    peak: 'Eum fugiat quo voluptas.',
    buyPrice: '320.10',
    sellPrice: '320.05',
  },
  {
    id: '7',
    gain: 98765,
    peak: 'Nisi ut aliquid ex ea.',
    buyPrice: '450.75',
    sellPrice: '450.70',
  },
  {
    id: '8',
    gain: 34567,
    peak: 'Temporibus autem quibusdam.',
    buyPrice: '190.25',
    sellPrice: '190.20',
  },
  {
    id: '9',
    gain: 56789,
    peak: 'Et harum quidem rerum.',
    buyPrice: '500.50',
    sellPrice: '500.45',
  },
  {
    id: '10',
    gain: 23456,
    peak: 'Nam libero tempore soluta.',
    buyPrice: '35.75',
    sellPrice: '35.70',
  },
  {
    id: '11',
    gain: 67812,
    peak: 'Doloremque laudantium totam rem.',
    buyPrice: '75.50',
    sellPrice: '75.45',
  },
  {
    id: '12',
    gain: 81290,
    peak: 'Sed ut perspiciatis unde.',
    buyPrice: '210.30',
    sellPrice: '210.25',
  },
  {
    id: '13',
    gain: 45612,
    peak: 'Omnis iste natus error.',
    buyPrice: '50.75',
    sellPrice: '50.70',
  },
  {
    id: '14',
    gain: 34589,
    peak: 'Sit voluptatem accusantium.',
    buyPrice: '85.25',
    sellPrice: '85.20',
  },
  {
    id: '15',
    gain: 56734,
    peak: 'Nemo enim ipsam voluptatem.',
    buyPrice: '65.50',
    sellPrice: '65.45',
  },
];

// Generate large dataset with 100 rows and 20 columns
export const generateLargeDataset = () => {
  const stocks = [
    'AAPL',
    'MSFT',
    'AMZN',
    'GOOGL',
    'TSLA',
    'META',
    'NVDA',
    'NFLX',
    'ADBE',
    'CRM',
    'PYPL',
    'INTC',
    'CSCO',
    'ORCL',
    'IBM',
    'AMD',
    'QCOM',
    'BRCM',
    'TXN',
    'AMAT',
  ];

  const logos = [
    'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg',
    'https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_3183FF_F7F7F7.svg',
    'https://etoro-cdn.etorostatic.com/market-avatars/1003/1003_F7F7F7_2C2C2C.svg',
    'https://etoro-cdn.etorostatic.com/market-avatars/1004/1004_F7F7F7_2C2C2C.svg',
    'https://etoro-cdn.etorostatic.com/market-avatars/1005/1005_494D5A_F7F7F7.svg',
    'https://etoro-cdn.etorostatic.com/market-avatars/1006/1006_EE7128_F7F7F7.svg',
    'https://etoro-cdn.etorostatic.com/market-avatars/1011/1011_F7F7F7_2C2C2C.svg',
  ];

  return Array.from({ length: 50 }, (_, index) => ({
    id: `stock-${index + 1}`,
    stock: `${stocks[index % stocks.length]}`,
    price: `$${(Math.random() * 1000 + 50).toFixed(2)}`,
    change: `${(Math.random() * 10 - 5).toFixed(2)}%`,
    volume: `${(Math.random() * 1000000).toLocaleString()}`,
    marketCap: `$${(Math.random() * 100 + 10).toFixed(1)}B`,
    peRatio: (Math.random() * 50 + 5).toFixed(1),
    dividend: `${(Math.random() * 5).toFixed(2)}%`,
    beta: (Math.random() * 2 + 0.5).toFixed(2),
    eps: `$${(Math.random() * 20 + 1).toFixed(2)}`,
    revenue: `$${(Math.random() * 50 + 5).toFixed(1)}B`,
    profit: `$${(Math.random() * 10 + 1).toFixed(1)}B`,
    employees: `${(Math.random() * 100000 + 1000).toLocaleString()}`,
    founded: Math.floor(Math.random() * 50 + 1970),
    sector: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'][index % 5],
    country: ['USA', 'Canada', 'UK', 'Germany', 'Japan'][index % 5],
    exchange: ['NASDAQ', 'NYSE', 'LSE', 'TSE'][index % 4],
    analyst: ['Buy', 'Hold', 'Sell'][index % 3],
    target: `$${(Math.random() * 1200 + 100).toFixed(2)}`,
    rating: `${(Math.random() * 2 + 3).toFixed(1)}/5`,
    buyPrice: `${(Math.random() * 1200 + 100).toFixed(2)}`,
    sellPrice: `${(Math.random() * 1200 + 100).toFixed(2)}`,
    logo: logos[index % logos.length],
  }));
};

export const largeDataset = generateLargeDataset();
