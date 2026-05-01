
export interface Product {
  id: number;
  name: string;
  series: string;
  price: string;
  image: string;
  images?: string[];
  description: string;
  specs?: {
    case: string;
    movement: string;
    glass: string;
    waterResistance: string;
  };
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Seiko Prospex',
    series: 'DIVER SCUBA',
    price: '15.500.000₫',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aac291ba59e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Dòng đồng hồ lặn chuyên nghiệp với khả năng chịu nước 200m. Thiết kế mạnh mẽ, vòng xoay bezel đơn hướng và kim dạ quang LumiBrite siêu sáng.',
    specs: {
      case: 'Thép không gỉ 42.4mm',
      movement: 'Automatic 4R35 (Cót 41h)',
      glass: 'Hardlex Crystal',
      waterResistance: '200m Diver'
    }
  },
  {
    id: 2,
    name: 'Seiko Presage',
    series: 'COCKTAIL TIME',
    price: '12.800.000₫',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aac291ba59e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1434056886845-dac89faf9b5d?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Vẻ đẹp thanh lịch được truyền cảm hứng từ những ly cocktail tinh tế. Mặt số hình tia mặt trời với màu sắc cuốn hút và các cọc số sắc sảo.',
    specs: {
      case: 'Thép không gỉ 40.5mm',
      movement: 'Automatic 4R35',
      glass: 'Hardlex Box',
      waterResistance: '50m'
    }
  },
  {
    id: 3,
    name: 'Seiko Alpinist',
    series: 'PROSPEX LAND',
    price: '18.200.000₫',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1526045431048-f857369aba09?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aac291ba59e?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Biểu tượng của sự bền bỉ, dành cho những chuyến thám hiểm đỉnh cao. Compass hướng dẫn trên vòng bezel trong và mặt kính Sapphire chống trầy.',
    specs: {
      case: 'Thép không gỉ 39.5mm',
      movement: 'Automatic 6R35 (Cót 70h)',
      glass: 'Sapphire Crystal',
      waterResistance: '200m'
    }
  },
  {
    id: 4,
    name: 'Seiko 5 Sports',
    series: 'SKX STYLE',
    price: '7.500.000₫',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1526045431048-f857369aba09?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1434056886845-dac89faf9b5d?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Phong cách năng động, trẻ trung cho thế hệ mới. Kế thừa linh hồn của dòng SKX huyền thoại với những cải tiến về bộ máy và thiết kế.',
    specs: {
      case: 'Thép không gỉ 42.5mm',
      movement: 'Automatic 4R36',
      glass: 'Hardlex',
      waterResistance: '100m'
    }
  },
  {
    id: 5,
    name: 'Seiko Grand Seiko',
    series: 'HERITAGE COLLECTION',
    price: '115.000.000₫',
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1619134769032-e9d7583626e9?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Đỉnh cao của nghệ thuật chế tác đồng hồ Nhật Bản. Kim giây trôi mượt mà và mặt số được hoàn thiện thủ công tỉ mỉ.',
    specs: {
      case: 'Thép không gỉ 40mm',
      movement: 'Spring Drive 9R65',
      glass: 'Sapphire kép',
      waterResistance: '100m'
    }
  },
  {
    id: 6,
    name: 'Seiko King Seiko',
    series: 'KINTARO HATTORI',
    price: '45.000.000₫',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Sự trở lại của một huyền thoại trong thập niên 60. Đường nét góc cạnh mạnh mẽ và bộ máy mỏng ấn tượng.',
    specs: {
      case: 'Thép không gỉ 37mm',
      movement: 'Automatic 6L35',
      glass: 'Box Sapphire',
      waterResistance: '100m'
    }
  }
];
