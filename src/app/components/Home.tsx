import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Croissant, LogOut, MapPin, Plus, SlidersHorizontal } from 'lucide-react';
import starbucksLogo from '../../assets/starbucks-logo.png';

const rusticaLogo = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" fill="#d98d98"/>
    <defs>
      <path id="rustica-circle" d="M60,60 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
    </defs>
    <text fill="#f5e7c9" font-size="9" font-family="Georgia,Times New Roman,serif" font-weight="700" letter-spacing="1.4">
      <textPath href="#rustica-circle" startOffset="50%" text-anchor="middle">
        RUSTICA LA PASTELERIA RUSTICA LA PASTELERIA
      </textPath>
    </text>
    <text x="60" y="86" text-anchor="middle" fill="#f5e7c9" font-size="72" font-family="Georgia,Times New Roman,serif" font-weight="700">R</text>
  </svg>
`)}`;

const laCantinaLogo = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 88">
    <rect width="220" height="88" fill="white"/>
    <text
      x="12"
      y="48"
      fill="#1f1f1f"
      font-size="38"
      font-family="Baskerville, Didot, Times New Roman, serif"
      font-style="italic"
      font-weight="700"
      letter-spacing="-1.4"
    >
      La Cantina
    </text>
    <text
      x="138"
      y="66"
      fill="#1f1f1f"
      font-size="13"
      font-family="Baskerville, Didot, Times New Roman, serif"
      font-weight="700"
      letter-spacing="0.8"
    >
      DINING HALL
    </text>
  </svg>
`)}`;

interface Product {
  id: number;
  name: string;
  venue: string;
  description: string;
  price: number;
  category: string;
  image: string;
  imageUrl: string;
  waitTimeMinutes: number;
  isOutOfStock?: boolean;
  flavorOptions?: string[];
  selectedFlavor?: string;
  cartKey?: string;
}

interface HomeProps {
  userName: string;
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Agua con gas/Agua Saborizada', venue: 'La Cantina', description: 'Bebida disponible en La Cantina.', price: 2900, category: 'Bebidas', image: '💧', imageUrl: '/assets/beverages/agua-con-gas.png', waitTimeMinutes: 1 },
  { id: 2, name: 'Arabe/Pebete/Bagel de J y Q', venue: 'La Cantina', description: 'Sándwich disponible en La Cantina.', price: 10129, category: 'Sandwiches', image: '🥯', imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 3, name: 'Baguette Caprese', venue: 'La Cantina', description: 'Sándwich disponible en La Cantina.', price: 8296, category: 'Sandwiches', image: '🥖', imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 8 },
  { id: 4, name: 'Baguette de jamon y queso', venue: 'La Cantina', description: 'Sándwich disponible en La Cantina.', price: 8296, category: 'Sandwiches', image: '🥖', imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 8 },
  { id: 5, name: 'Baguettes Crudo/Salame', venue: 'La Cantina', description: 'Sándwich disponible en La Cantina.', price: 9952, category: 'Sandwiches', image: '🥖', imageUrl: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 9 },
  { id: 6, name: 'Baguettes pollo queso y tomate', venue: 'La Cantina', description: 'Sándwich disponible en La Cantina.', price: 9952, category: 'Sandwiches', image: '🥖', imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 9 },
  { id: 7, name: 'Brownie/Budin/Alfajor', venue: 'La Cantina', description: 'Pastelería disponible en La Cantina.', price: 5803, category: 'Pastelería', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1590841609987-4ac211afdde1?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 8, name: 'Café Grande', venue: 'La Cantina', description: 'Café disponible en La Cantina.', price: 6157, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 4 },
  { id: 9, name: 'Café Chico', venue: 'La Cantina', description: 'Café disponible en La Cantina.', price: 2925, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 10, name: 'Citric', venue: 'La Cantina', description: 'Elegí el gusto antes de agregar la bebida.', price: 5787, category: 'Bebidas', image: '🧃', imageUrl: '/assets/beverages/citric.png', waitTimeMinutes: 1, flavorOptions: ['Naranja', 'Naranja + frutilla'] },
  { id: 11, name: 'Coca Cola 500cc', venue: 'La Cantina', description: 'Elegí el sabor antes de agregar la bebida.', price: 3183, category: 'Bebidas', image: '🥤', imageUrl: '/assets/beverages/coca-cola-500cc.png', waitTimeMinutes: 1, flavorOptions: ['Sabor original', 'Zero'] },
  { id: 12, name: 'Coca Cola Lata', venue: 'La Cantina', description: 'Bebida disponible en La Cantina.', price: 2749, category: 'Bebidas', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 13, name: 'Cookie', venue: 'La Cantina', description: 'Pastelería disponible en La Cantina.', price: 5803, category: 'Pastelería', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 14, name: 'Gatorade', venue: 'La Cantina', description: 'Elegí el gusto antes de agregar la bebida.', price: 4630, category: 'Bebidas', image: '🥤', imageUrl: '/assets/beverages/gatorade.png', waitTimeMinutes: 1, flavorOptions: ['Manzana', 'Cool Blue', 'Frutas tropicales'] },
  { id: 15, name: 'Medialunas rellenas', venue: 'La Cantina', description: 'Panadería disponible en La Cantina.', price: 3714, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 16, name: 'Medialunas simples', venue: 'La Cantina', description: 'Panadería disponible en La Cantina.', price: 1661, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 17, name: 'Pepsi 500cc', venue: 'La Cantina', description: 'Bebida disponible en La Cantina.', price: 2900, category: 'Bebidas', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 18, name: 'Pepsi Lata', venue: 'La Cantina', description: 'Bebida disponible en La Cantina.', price: 2460, category: 'Bebidas', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 19, name: 'Scon de queso grande', venue: 'La Cantina', description: 'Panadería disponible en La Cantina.', price: 2894, category: 'Panadería', image: '🧀', imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 20, name: 'Té', venue: 'La Cantina', description: 'Infusión disponible en La Cantina.', price: 3183, category: 'Infusiones', image: '🍵', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 21, name: 'Yogurisimo/Ser cereales', venue: 'La Cantina', description: 'Lácteo disponible en La Cantina.', price: 7091, category: 'Lácteos', image: '🥣', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 22, name: 'Sandwich de milanesa', venue: 'La Cantina', description: 'Sándwich disponible en La Cantina.', price: 13270, category: 'Sandwiches', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 10 },
  { id: 23, name: 'Empanadas', venue: 'La Cantina', description: 'Producto disponible en La Cantina.', price: 3159, category: 'Empanadas', image: '🥟', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 24, name: 'Yogurt "La Cantina"', venue: 'La Cantina', description: 'Lácteo disponible en La Cantina.', price: 8296, category: 'Lácteos', image: '🥣', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 25, name: 'Fruta', venue: 'La Cantina', description: 'Producto disponible en La Cantina.', price: 1580, category: 'Frutas', image: '🍎', imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 26, name: 'Alf. Capitan simple', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 2363, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 27, name: 'Alfajor Capitan x3', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 2953, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 28, name: 'Alfajor Chocoarroz', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 1477, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 29, name: 'Alfajor cordobes', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 2605, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 30, name: 'Alfajor Guaymallén', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 591, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 31, name: 'Alfajor Guaymallén triple', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 886, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 32, name: 'Alfajor Jorgelin triple', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 2079, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 33, name: 'Alfajor Jorgito simple', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 1455, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 34, name: 'Alfajor Shot simple', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 1477, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 35, name: 'Alfajor terrabusi simple', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 1447, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 36, name: 'Alfajor triples', venue: 'La Cantina', description: 'Alfajor disponible en La Cantina.', price: 2215, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 37, name: 'Bonobon', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 579, category: 'Golosinas', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 38, name: 'Cadbury 25G', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 3300, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 39, name: 'Cadbury 82G', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 5196, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 40, name: 'Cadbury chico', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 2605, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 41, name: 'Caramelos Halls', venue: 'La Cantina', description: 'Caramelos disponibles en La Cantina.', price: 1143, category: 'Caramelos', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 42, name: 'Caramelos X2 unid', venue: 'La Cantina', description: 'Caramelos disponibles en La Cantina.', price: 145, category: 'Caramelos', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 43, name: 'Cereal flow', venue: 'La Cantina', description: 'Barra o snack de cereal disponible en La Cantina.', price: 1477, category: 'Cereales', image: '🥣', imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 44, name: 'Cereal Fort', venue: 'La Cantina', description: 'Barra o snack de cereal disponible en La Cantina.', price: 1455, category: 'Cereales', image: '🥣', imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 45, name: 'Cereal mix', venue: 'La Cantina', description: 'Barra o snack de cereal disponible en La Cantina.', price: 1275, category: 'Cereales', image: '🥣', imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 46, name: 'Cerealitas', venue: 'La Cantina', description: 'Galletitas o snack de cereal disponible en La Cantina.', price: 3014, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 47, name: 'Chicle beldent', venue: 'La Cantina', description: 'Chicle disponible en La Cantina.', price: 1034, category: 'Chicles', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 48, name: 'Chicle beldent tachito', venue: 'La Cantina', description: 'Chicle disponible en La Cantina.', price: 5104, category: 'Chicles', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 49, name: 'Chocobar', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 1455, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 50, name: 'Chocolate Block', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 2325, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 51, name: 'Chocolate milka 55g', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 5250, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 52, name: 'Chocolate Shot chico', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 2315, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 53, name: 'Chocolate Shot grande', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 3617, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 54, name: 'Chupetin Mr Evolut', venue: 'La Cantina', description: 'Chupetín disponible en La Cantina.', price: 270, category: 'Golosinas', image: '🍭', imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 55, name: 'Chupetin Mr pop', venue: 'La Cantina', description: 'Chupetín disponible en La Cantina.', price: 295, category: 'Golosinas', image: '🍭', imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 56, name: 'D.R.F', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 457, category: 'Golosinas', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 57, name: 'Dos Corazones', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 3326, category: 'Golosinas', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 58, name: 'Elite', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 665, category: 'Golosinas', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 59, name: 'Flynn paff', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 145, category: 'Golosinas', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 60, name: 'Frutos secos energia', venue: 'La Cantina', description: 'Snack disponible en La Cantina.', price: 7235, category: 'Frutos secos', image: '🥜', imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 61, name: 'Frutos secos proteina', venue: 'La Cantina', description: 'Snack disponible en La Cantina.', price: 6077, category: 'Frutos secos', image: '🥜', imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 62, name: 'Galletitas 9 de oro', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1736, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 63, name: 'Galletitas Amor', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1871, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 64, name: 'Galletitas criollitas', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1447, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 65, name: 'Galletitas Don Satur', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1767, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 66, name: 'Galletitas Melba', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1881, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 67, name: 'Galletitas Merengadas', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1920, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 68, name: 'Galletitas Oreo', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 2658, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 69, name: 'Galletitas Oreo Mani', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 2605, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 70, name: 'Galletitas Pepas', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1477, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 71, name: 'Galletitas Pepitos', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 2658, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 72, name: 'Galletitas Rumba', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1871, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 73, name: 'Galletitas Sonrisas', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1871, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 74, name: 'Galletitas Surt Bagley/Terrab', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 4365, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 75, name: 'Habanitos/Mini rhodesia', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 3000, category: 'Golosinas', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 76, name: 'Kesitas / Rex', venue: 'La Cantina', description: 'Snack disponible en La Cantina.', price: 3014, category: 'Snacks', image: '🧀', imageUrl: '/assets/snacks/kesitas-rex.png', waitTimeMinutes: 1 },
  { id: 77, name: 'MANA', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 1559, category: 'Golosinas', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 78, name: 'Marroc', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 1808, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 79, name: 'Mentitas Felfort', venue: 'La Cantina', description: 'Caramelos disponibles en La Cantina.', price: 2827, category: 'Caramelos', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 80, name: 'Milka 20gr', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 1455, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 81, name: 'Milka bis', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 5051, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 82, name: 'Milka chico', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 2605, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 83, name: 'Mogul', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 831, category: 'Golosinas', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 84, name: 'Muecas', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 2286, category: 'Golosinas', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 85, name: 'Nachos', venue: 'La Cantina', description: 'Snack disponible en La Cantina.', price: 3356, category: 'Snacks', image: '🍟', imageUrl: '/assets/snacks/nachos.png', waitTimeMinutes: 1 },
  { id: 86, name: 'Obleas Gallo', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 1425, category: 'Golosinas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 87, name: 'Pico Dulce', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 355, category: 'Golosinas', image: '🍭', imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 89, name: 'Rhodesia', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 1351, category: 'Golosinas', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 90, name: 'Rocklets', venue: 'La Cantina', description: 'Chocolate disponible en La Cantina.', price: 1975, category: 'Chocolates', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 91, name: 'Saladix', venue: 'La Cantina', description: 'Snack disponible en La Cantina. Elegí el gusto antes de agregarlo.', price: 2183, category: 'Snacks', image: '🍘', imageUrl: '/assets/snacks/saladix.png', waitTimeMinutes: 1, flavorOptions: ['Calabresa', 'Parmesano', 'Jamón', 'Pizza', 'Dúo Jamón y Queso'] },
  { id: 92, name: 'Sugus confitados', venue: 'La Cantina', description: 'Caramelos disponibles en La Cantina.', price: 1871, category: 'Caramelos', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 93, name: 'Tic Tac', venue: 'La Cantina', description: 'Caramelos disponibles en La Cantina.', price: 1455, category: 'Caramelos', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 94, name: 'Tita', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 1143, category: 'Golosinas', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 95, name: 'Topline', venue: 'La Cantina', description: 'Chicle disponible en La Cantina.', price: 1477, category: 'Chicles', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 96, name: 'Traviata', venue: 'La Cantina', description: 'Galletitas disponibles en La Cantina.', price: 1447, category: 'Galletitas', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 97, name: 'Turron', venue: 'La Cantina', description: 'Golosina disponible en La Cantina.', price: 437, category: 'Golosinas', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 98, name: 'Yerba 1kg', venue: 'La Cantina', description: 'Producto disponible en La Cantina.', price: 5067, category: 'Yerbas', image: '🧉', imageUrl: 'https://images.unsplash.com/photo-1663552728001-4f9c2f4a5d9a?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 99, name: 'Yerba 500gr', venue: 'La Cantina', description: 'Producto disponible en La Cantina.', price: 3617, category: 'Yerbas', image: '🧉', imageUrl: 'https://images.unsplash.com/photo-1663552728001-4f9c2f4a5d9a?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 101, name: 'Espresso', venue: 'Starbucks', description: 'Café espresso servido en barra.', price: 3900, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 4 },
  { id: 102, name: 'Latte/Cappuccino Alto', venue: 'Starbucks', description: 'Bebida caliente de espresso con leche en tamaño alto.', price: 5500, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 103, name: 'Caramel Macchiato Alto', venue: 'Starbucks', description: 'Espresso con leche y caramelo en tamaño alto.', price: 6300, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 104, name: 'Mocha/Mocha Blanco Alto', venue: 'Starbucks', description: 'Bebida de espresso con salsa mocha en tamaño alto.', price: 6300, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 105, name: 'Flat White/Latte Macchiato Alto', venue: 'Starbucks', description: 'Espresso con leche texturizada en tamaño alto.', price: 5800, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 106, name: 'Matcha Latte/Chai Latte Alto', venue: 'Starbucks', description: 'Bebida caliente en tamaño alto.', price: 5500, category: 'Infusiones', image: '🍵', imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 107, name: 'Chocolate/Chocolate Blanco Alto', venue: 'Starbucks', description: 'Bebida caliente cremosa en tamaño alto.', price: 6300, category: 'Infusiones', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 108, name: 'Dulce de Leche Corto', venue: 'Starbucks', description: 'Bebida espresso sabor dulce de leche en tamaño corto.', price: 6300, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 109, name: 'Vanilla Latte/Skimny Vanilla Latte Corto', venue: 'Starbucks', description: 'Latte sabor vainilla en tamaño corto.', price: 5800, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 110, name: 'Americano Corto', venue: 'Starbucks', description: 'Espresso con agua caliente en tamaño corto.', price: 5000, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 111, name: 'Café del Día con Leche Corto', venue: 'Starbucks', description: 'Café filtrado con leche en tamaño corto.', price: 5000, category: 'Cafés', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 112, name: 'Avellana Alto', venue: 'Starbucks', description: 'Shaken espresso & cold brew sabor avellana en tamaño alto.', price: 5800, category: 'Fríos', image: '🧋', imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 113, name: 'Chocolate Blanco Alto', venue: 'Starbucks', description: 'Shaken espresso & cold brew sabor chocolate blanco en tamaño alto.', price: 5800, category: 'Fríos', image: '🧋', imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 114, name: 'Sweet Vanilla Cold Brew Alto', venue: 'Starbucks', description: 'Cold brew con vainilla en tamaño alto.', price: 6700, category: 'Fríos', image: '🧋', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 115, name: 'Mocha Frappuccino Alto', venue: 'Starbucks', description: 'Frappuccino sabor mocha en tamaño alto.', price: 8400, category: 'Frappuccinos', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 8 },
  { id: 116, name: 'Caramel Frappuccino Alto', venue: 'Starbucks', description: 'Frappuccino sabor caramelo en tamaño alto.', price: 8400, category: 'Frappuccinos', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 8 },
  { id: 117, name: 'Ultra Dulce de Leche Frappuccino Alto', venue: 'Starbucks', description: 'Frappuccino sabor dulce de leche en tamaño alto.', price: 8900, category: 'Frappuccinos', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 9 },
  { id: 118, name: 'Ultra Frutilla Frappuccino Alto', venue: 'Starbucks', description: 'Frappuccino sabor frutilla en tamaño alto.', price: 8900, category: 'Frappuccinos', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 9 },
  { id: 119, name: 'Berry Perlas Refresher Alto', venue: 'Starbucks', description: 'Refresher frío con perlas en tamaño alto.', price: 7900, category: 'Refreshers', image: '🧋', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 120, name: 'Berry Perlas Coconut Refresher Alto', venue: 'Starbucks', description: 'Refresher con coco y perlas en tamaño alto.', price: 8500, category: 'Refreshers', image: '🧋', imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 121, name: 'Berry Perlas Lemonade Refresher Alto', venue: 'Starbucks', description: 'Refresher con limonada y perlas en tamaño alto.', price: 8500, category: 'Refreshers', image: '🧋', imageUrl: 'https://images.unsplash.com/photo-1551751299-1b51cab2694c?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 122, name: 'Shaken Lemonade Green Tea Alto', venue: 'Starbucks', description: 'Té frío con limonada en tamaño alto.', price: 7200, category: 'Fríos', image: '🍋', imageUrl: 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 123, name: 'Shaken Lemonade Hibiscus Alto', venue: 'Starbucks', description: 'Té frío de hibiscus con limonada en tamaño alto.', price: 7200, category: 'Fríos', image: '🍹', imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 124, name: 'Mango Dragon Fruit Alto', venue: 'Starbucks', description: 'Refresher frío sabor mango dragon fruit en tamaño alto.', price: 8000, category: 'Refreshers', image: '🍹', imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 125, name: 'Frutilla Acai Alto', venue: 'Starbucks', description: 'Refresher frío sabor frutilla acai en tamaño alto.', price: 8000, category: 'Refreshers', image: '🍓', imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 126, name: 'Pink Drink Alto', venue: 'Starbucks', description: 'Refresher cremoso en tamaño alto.', price: 8400, category: 'Refreshers', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 127, name: 'Dragon Drink Alto', venue: 'Starbucks', description: 'Refresher cremoso sabor dragon drink en tamaño alto.', price: 8400, category: 'Refreshers', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 128, name: 'Agua sin gas / Agua con gas', venue: 'Starbucks', description: 'Agua embotellada fría.', price: 2800, category: 'Bebidas', image: '💧', imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 129, name: 'Agua sin gas 850 ml', venue: 'Starbucks', description: 'Agua embotellada de 850 ml.', price: 3400, category: 'Bebidas', image: '💧', imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 130, name: 'Fruggina Pera / Manzana', venue: 'Starbucks', description: 'Bebida frutal lista para llevar.', price: 4100, category: 'Bebidas', image: '🧃', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 131, name: 'Jugo Detox', venue: 'Starbucks', description: 'Jugo listo para llevar.', price: 3200, category: 'Jugos', image: '🧃', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 132, name: 'Jugo de Naranja / Manzana', venue: 'Starbucks', description: 'Jugo frío listo para llevar.', price: 3200, category: 'Jugos', image: '🧃', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 133, name: 'Kombucha', venue: 'Starbucks', description: 'Bebida fría kombucha.', price: 6400, category: 'Bebidas', image: '🧃', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 134, name: 'Wrap Carne Braseada', venue: 'Starbucks', description: 'Wrap frío listo para llevar.', price: 8400, category: 'Comida', image: '🌯', imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 135, name: 'Sándwich con Jamón y Queso en Pan Artesanal', venue: 'Starbucks', description: 'Sándwich frío listo para llevar.', price: 11800, category: 'Comida', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 136, name: 'Triángulo Italiano', venue: 'Starbucks', description: 'Sándwich listo para llevar.', price: 10900, category: 'Comida', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 137, name: 'Baguette 3 Quesos y Tomates Secos', venue: 'Starbucks', description: 'Baguette listo para llevar.', price: 11800, category: 'Comida', image: '🥖', imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 138, name: 'Tostado de Amapola', venue: 'Starbucks', description: 'Tostado listo para llevar.', price: 9700, category: 'Comida', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 139, name: 'Tostado Pavita y Queso', venue: 'Starbucks', description: 'Tostado listo para llevar.', price: 10200, category: 'Comida', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 140, name: 'Hummus', venue: 'Starbucks', description: 'Dip individual.', price: 1100, category: 'Snacks', image: '🥣', imageUrl: 'https://images.unsplash.com/photo-1571197119738-26123cb0d22f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 141, name: 'Crackers Semillas', venue: 'Starbucks', description: 'Snack salado de semillas.', price: 3500, category: 'Snacks', image: '🍘', imageUrl: 'https://images.unsplash.com/photo-1518133683791-0b9de5a055f0?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 142, name: 'Papas Fritas', venue: 'Starbucks', description: 'Papas fritas en paquete.', price: 5600, category: 'Snacks', image: '🍟', imageUrl: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 143, name: 'Lingote Chococake', venue: 'Starbucks', description: 'Porción de torta tipo lingote de chocolate.', price: 9100, category: 'Pastelería', image: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 144, name: 'Bites Cookies & Cream x1', venue: 'Starbucks', description: 'Bite individual cookies & cream.', price: 3400, category: 'Pastelería', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 145, name: 'Bites Cookies & Cream x2', venue: 'Starbucks', description: 'Dos bites cookies & cream.', price: 6000, category: 'Pastelería', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 146, name: 'Peanut Butter Chocochips Cookie', venue: 'Starbucks', description: 'Cookie grande con peanut butter y chips de chocolate.', price: 3900, category: 'Pastelería', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 147, name: 'Croissant Integral Queso y Palta', venue: 'Starbucks', description: 'Croissant integral relleno con queso y palta.', price: 5500, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 148, name: 'Bagel Sandwich', venue: 'Starbucks', description: 'Bagel sandwich listo para llevar.', price: 11200, category: 'Comida', image: '🥯', imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 149, name: 'Focaccia Jamón & Queso', venue: 'Starbucks', description: 'Focaccia rellena de jamón y queso.', price: 7700, category: 'Comida', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 150, name: 'Chicken Chedd Bread Sandwich', venue: 'Starbucks', description: 'Sándwich de pollo y cheddar.', price: 11600, category: 'Comida', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 151, name: 'Macachino Mediano', venue: 'Starbucks', description: 'Sándwich o pieza de panadería exhibida en vitrina.', price: 5800, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 152, name: 'Croissant Madrileño', venue: 'Starbucks', description: 'Croissant relleno estilo madrileño.', price: 8300, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 153, name: 'Pan de Queso', venue: 'Starbucks', description: 'Pan de queso individual.', price: 3200, category: 'Panadería', image: '🧀', imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 154, name: 'Scones 4 Quesos', venue: 'Starbucks', description: 'Scones salados de cuatro quesos.', price: 7400, category: 'Panadería', image: '🧀', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 155, name: 'Scon 4 Quesos Avena', venue: 'Starbucks', description: 'Scon salado de cuatro quesos con avena.', price: 7900, category: 'Panadería', image: '🧀', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 156, name: 'Muffin de Arándanos Relleno', venue: 'Starbucks', description: 'Muffin con arándanos y relleno.', price: 5600, category: 'Pastelería', image: '🧁', imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 157, name: 'Golden Star Chocolate Muffin', venue: 'Starbucks', description: 'Muffin de chocolate.', price: 5600, category: 'Pastelería', image: '🧁', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 158, name: 'Muffin Banana y Nuez', venue: 'Starbucks', description: 'Muffin de banana y nuez.', price: 5500, category: 'Pastelería', image: '🧁', imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 159, name: 'Lemon Pound Cake Marble Loaf Cake', venue: 'Starbucks', description: 'Budín marmolado sabor limón.', price: 5600, category: 'Pastelería', image: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 160, name: 'Chocolate Croissant', venue: 'Starbucks', description: 'Croissant relleno de chocolate.', price: 3900, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 161, name: 'Bagel Avocado Toast', venue: 'Starbucks', description: 'Bagel con avocado.', price: 6600, category: 'Comida', image: '🥯', imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 4 },
  { id: 162, name: 'Tostadas Multicereal con Queso y Mermelada', venue: 'Starbucks', description: 'Tostadas multicereal con queso y mermelada.', price: 4300, category: 'Panadería', image: '🍞', imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 163, name: 'Tostadas Multicereal con Queso y Avocado', venue: 'Starbucks', description: 'Tostadas multicereal con queso y avocado.', price: 4500, category: 'Panadería', image: '🍞', imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 164, name: 'Roll de Manzana / Roll de Canela', venue: 'Starbucks', description: 'Roll dulce exhibido en vitrina.', price: 4500, category: 'Pastelería', image: '🍥', imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 165, name: 'Donas Rellenas con Dulce de Leche / Pink Donut', venue: 'Starbucks', description: 'Dona dulce exhibida en vitrina.', price: 4500, category: 'Pastelería', image: '🍩', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 166, name: 'Pan de Jamón y Queso', venue: 'Starbucks', description: 'Pieza salada de panadería con jamón y queso.', price: 3900, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 167, name: 'Cheese Twist', venue: 'Starbucks', description: 'Tira de queso horneada.', price: 3300, category: 'Panadería', image: '🧀', imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 168, name: 'Cookies', venue: 'Starbucks', description: 'Cookie empaquetada.', price: 2800, category: 'Snacks', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 169, name: 'Barra 60% Cacao', venue: 'Starbucks', description: 'Barra snack de cacao.', price: 2600, category: 'Snacks', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 170, name: 'Moneda de Chocolate', venue: 'Starbucks', description: 'Snack dulce de chocolate.', price: 2400, category: 'Snacks', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 171, name: 'Barra Castañas & Arándanos', venue: 'Starbucks', description: 'Barra snack de castañas y arándanos.', price: 3400, category: 'Snacks', image: '🥜', imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 172, name: 'Barra Chocolate & Avena', venue: 'Starbucks', description: 'Barra snack de chocolate y avena.', price: 3400, category: 'Snacks', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 173, name: 'Barra Proteica Integra', venue: 'Starbucks', description: 'Barra proteica.', price: 3400, category: 'Snacks', image: '🥜', imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 174, name: 'Fitbeans con Sal Marina', venue: 'Starbucks', description: 'Snack crocante con sal marina.', price: 2700, category: 'Snacks', image: '🥜', imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 201, name: 'Alfajor de Chocolate', venue: 'La Cantina', description: 'Alfajor relleno de dulce de leche con baño de chocolate.', price: 1500, category: 'Alfajores', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 202, name: 'Papas Fritas', venue: 'La Cantina', description: 'Elegí cómo las querés antes de agregar el pedido.', price: 1300, category: 'Snacks', image: '🍟', imageUrl: '/assets/snacks/papas-fritas.png', waitTimeMinutes: 1, flavorOptions: ['Sin nada', 'Con cheddar', 'Con cheddar y panceta'] },
  { id: 203, name: 'Gomitas', venue: 'La Cantina', description: 'Bolsa de gomitas surtidas frutales.', price: 1200, category: 'Dulces', image: '🍬', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 204, name: 'Sándwich de Jamón y Queso', venue: 'La Cantina', description: 'Sándwich frío listo para llevar.', price: 2600, category: 'Sándwiches', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 4 },
  { id: 205, name: 'Coca Cola Lata', venue: 'La Cantina', description: 'Lata individual helada de Coca Cola.', price: 1600, category: 'Bebidas', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 206, name: 'Bon o Bon', venue: 'La Cantina', description: 'Bombón de chocolate relleno con crema de maní.', price: 900, category: 'Dulces', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1, isOutOfStock: true },
  { id: 301, name: 'Café 12 Oz.', venue: 'Rústica', description: 'Elegí americano, latte, mocca o cortado.', price: 6500, category: 'Cafetería', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 302, name: 'Café 16 Oz.', venue: 'Rústica', description: 'Elegí americano, latte, mocca o cortado.', price: 7000, category: 'Cafetería', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 303, name: 'Latte o flat', venue: 'Rústica', description: 'Café con leche en su versión latte o flat.', price: 7600, category: 'Cafetería', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 304, name: 'Submarino 16 Oz.', venue: 'Rústica', description: 'Bebida caliente clásica tamaño grande.', price: 7000, category: 'Cafetería', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 305, name: 'Latte saborizado', venue: 'Rústica', description: 'Elegí vainilla o almendras.', price: 7600, category: 'Cafetería', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 306, name: 'Caramel Latte', venue: 'Rústica', description: 'Latte con un toque dulce de caramelo.', price: 7600, category: 'Cafetería', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 307, name: 'Kinder Latte', venue: 'Rústica', description: 'Cafecito con sabor Kinder, blanco o negro.', price: 8600, category: 'Cafetería', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 308, name: 'Latte Choco-avellanas', venue: 'Rústica', description: 'Latte con sabor a chocolate y avellanas.', price: 8300, category: 'Cafetería', image: '☕', imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 309, name: 'Té', venue: 'Rústica', description: 'Con o sin leche.', price: 3900, category: 'Cafetería', image: '🍵', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 310, name: 'Medialuna XL', venue: 'Rústica', description: 'Medialuna grande, ideal para acompañar el café.', price: 2000, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 311, name: 'Chipa', venue: 'Rústica', description: 'Chipa de queso recién horneado.', price: 3400, category: 'Panadería', image: '🧀', imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 312, name: 'Scon de queso', venue: 'Rústica', description: 'Scon salado con queso.', price: 4500, category: 'Panadería', image: '🧀', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 3 },
  { id: 313, name: 'Palito de queso', venue: 'Rústica', description: 'Palito crocante con queso.', price: 1450, category: 'Panadería', image: '🧀', imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 314, name: 'Pan de chocolate', venue: 'Rústica', description: 'Pieza dulce de panadería con chocolate.', price: 3500, category: 'Panadería', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 315, name: 'Croissant', venue: 'Rústica', description: 'Croissant clásico de manteca.', price: 3200, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 316, name: 'Saladito', venue: 'Rústica', description: 'Pieza salada de panadería.', price: 3590, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 317, name: 'Palmera', venue: 'Rústica', description: 'Clásica palmera crocante.', price: 3040, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 318, name: 'Danesas', venue: 'Rústica', description: 'Pieza dulce tipo danesa.', price: 4800, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 319, name: 'Roll', venue: 'Rústica', description: 'Roll dulce de panadería.', price: 4650, category: 'Panadería', image: '🍥', imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 320, name: 'Croissant jamón y queso', venue: 'Rústica', description: 'Croissant relleno de jamón y queso.', price: 7090, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 4 },
  { id: 321, name: 'Tostado de jamón y queso', venue: 'Rústica', description: 'Panini o pan árabe con jamón y queso.', price: 6845, category: 'Panadería', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 322, name: 'Medialuna XL de jamón y queso', venue: 'Rústica', description: 'Medialuna XL rellena de jamón y queso.', price: 5600, category: 'Panadería', image: '🥐', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 4 },
  { id: 323, name: 'Cuadrado dulce', venue: 'Rústica', description: 'Brownie, limón o cinnamon fudge.', price: 4850, category: 'Pastelería', image: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 324, name: 'Cuadrado de torta', venue: 'Rústica', description: 'Brownie cheesecake o coco con dulce de leche.', price: 5050, category: 'Pastelería', image: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 325, name: 'Alfajores', venue: 'Rústica', description: 'Alfajores de varios sabores para elegir.', price: 4650, category: 'Pastelería', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 326, name: 'Conitos', venue: 'Rústica', description: 'Conitos dulces para acompañar.', price: 2600, category: 'Pastelería', image: '🍫', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 327, name: 'Paquete de Pepas', venue: 'Rústica', description: 'Paquete de pepas dulces.', price: 5300, category: 'Pastelería', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 328, name: 'Producto sin Tacc', venue: 'Rústica', description: 'Opciones sin TACC como cuadrados y alfajores.', price: 5000, category: 'Pastelería', image: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 329, name: 'Porción de budín', venue: 'Rústica', description: 'De banana o zanahoria.', price: 4650, category: 'Pastelería', image: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 330, name: 'Porción de torta', venue: 'Rústica', description: 'Porción individual de torta.', price: 9000, category: 'Pastelería', image: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 331, name: 'Crumble Cookies', venue: 'Rústica', description: 'Cookies estilo crumble.', price: 4300, category: 'Pastelería', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 332, name: 'Crumble Cookie con topping', venue: 'Rústica', description: 'Cookie crumble con topping.', price: 5500, category: 'Pastelería', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 333, name: 'Cookie decorada', venue: 'Rústica', description: 'Cookie decorada individual.', price: 4650, category: 'Pastelería', image: '🍪', imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 334, name: 'Muffins', venue: 'Rústica', description: 'Muffins dulces individuales.', price: 4700, category: 'Pastelería', image: '🧁', imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 2 },
  { id: 335, name: 'Barra proteica vegana', venue: 'Rústica', description: 'Barra proteica vegana Wiki.', price: 4280, category: 'Pastelería', image: '🥜', imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 336, name: 'Jugos de frutas PuraFrutta', venue: 'Rústica', description: 'Jugo frutal listo para llevar.', price: 2000, category: 'Bebidas', image: '🧃', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 337, name: 'Jugo de frutas 100% natural 500 cc', venue: 'Rústica', description: 'Jugo natural en presentación de 500 cc.', price: 7050, category: 'Bebidas', image: '🧃', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 338, name: 'Jugo de frutas 100% natural 300 cc', venue: 'Rústica', description: 'Jugo natural en presentación de 300 cc.', price: 5000, category: 'Bebidas', image: '🧃', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 339, name: 'Agua con gas', venue: 'Rústica', description: 'Agua con gas fría.', price: 2900, category: 'Bebidas', image: '💧', imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 340, name: 'Gaseosa', venue: 'Rústica', description: 'Bebida gaseosa fría.', price: 3180, category: 'Bebidas', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 341, name: 'Tazón de cerámica XL', venue: 'Rústica', description: 'Tazón reutilizable de cerámica tamaño XL.', price: 22400, category: 'Otros', image: '🏺', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 342, name: 'Tazón de cerámica', venue: 'Rústica', description: 'Tazón reutilizable de cerámica.', price: 17500, category: 'Otros', image: '🏺', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 343, name: 'Vaso impreso Rusti', venue: 'Rústica', description: 'Vaso con diseño impreso de Rusti.', price: 5800, category: 'Otros', image: '🥤', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 1 },
  { id: 344, name: 'Promo del día', venue: 'Rústica', description: 'Consultá por la opción disponible de hoy.', price: 8900, category: 'Promos', image: '✨', imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 4 },
  { id: 345, name: 'Promo Pastelería', venue: 'Rústica', description: 'Cuadrado más café 12 Oz.', price: 10500, category: 'Promos', image: '🍰', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 5 },
  { id: 346, name: 'Promo Tostado', venue: 'Rústica', description: 'Tostado de pan árabe más café 12 Oz.', price: 12200, category: 'Promos', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
  { id: 347, name: 'Ciabatta ceasar', venue: 'Rústica', description: 'Sándwich ciabatta estilo ceasar.', price: 9750, category: 'Almuerzos', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 348, name: 'Grillado de lomito y cheddar', venue: 'Rústica', description: 'Sándwich grillado con lomito y cheddar.', price: 8950, category: 'Almuerzos', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 7 },
  { id: 349, name: 'Fosforito lomito y queso', venue: 'Rústica', description: 'Fosforito relleno de lomito y queso.', price: 6700, category: 'Almuerzos', image: '🥪', imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=240&h=240&q=80', waitTimeMinutes: 6 },
];

const MAX_WAIT_TIME_MINUTES = 30;
const VENUE_LOCATIONS: Record<string, string[]> = {
  'La Cantina': [
    'Lima 2, Piso 10',
    'Independencia 2, Piso 5',
    'Lima 3, Piso 7',
    'Lima 3, Piso 7',
    'Lima 3, Subsuelo 1, Buffet grande',
    'Lima 3, Subsuelo 1, Buffet chico',
    'Patio, Al lado del edificio Labs',
  ],
  'Rústica': [
    'Lima 1, Piso 2',
    'Lima 1, Piso 4',
  ],
  Starbucks: [
    'Lima 3, Piso 8',
    'Chile, Patio al lado del edificio',
  ],
};

const getWaitTimeBarColor = (waitTimeMinutes: number) => {
  if (waitTimeMinutes <= 10) {
    return 'bg-green-500';
  }

  if (waitTimeMinutes <= 20) {
    return 'bg-yellow-400';
  }

  return 'bg-red-500';
};

const normalizeSearchText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getVenueLocationNote = (venue: string) => {
  if (venue === 'La Cantina') {
    return 'Buffets y puntos de retiro dentro del campus.';
  }

  if (venue === 'Rústica') {
    return 'Locales de cafetería y pastelería disponibles.';
  }

  return 'Puntos Starbucks habilitados dentro de la sede.';
};

const getGroupedVenueLocations = (venue: string) => {
  const locations = VENUE_LOCATIONS[venue] ?? [];
  const groupedLocations = new Map<string, string[]>();

  locations.forEach((location) => {
    const [building, ...rest] = location.split(',').map((part) => part.trim());
    const detail = rest.join(', ');
    const currentLocations = groupedLocations.get(building) ?? [];
    groupedLocations.set(building, [...currentLocations, detail || building]);
  });

  return Array.from(groupedLocations.entries()).map(([building, details]) => ({
    building,
    details,
  }));
};

const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`;
const formatUserName = (name: string) =>
  name ? `${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;

const getSeededFeaturedProducts = (products: Product[], venue: string, tick: number) => {
  if (products.length <= 3) {
    return products;
  }

  const baseSeed =
    venue.split('').reduce((total, char) => total + char.charCodeAt(0), 0) + tick * 997;

  return [...products]
    .sort((firstProduct, secondProduct) => {
      const firstScore = (firstProduct.id * 31 + baseSeed) % 1000;
      const secondScore = (secondProduct.id * 31 + baseSeed) % 1000;
      return firstScore - secondScore;
    })
    .slice(0, 3);
};

const getHighlightedText = (text: string, query: string) => {
  const normalizedQuery = normalizeSearchText(query).trim();

  if (!normalizedQuery) {
    return text;
  }

  const normalizedChars = Array.from(text).map((char) => normalizeSearchText(char));
  const normalizedText = normalizedChars.join('');
  const matchIndex = normalizedText.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return text;
  }

  const queryLength = normalizedQuery.length;
  const start = normalizedChars.slice(0, matchIndex).length;
  const end = normalizedChars.slice(0, matchIndex + queryLength).length;

  return (
    <>
      {text.slice(0, start)}
      <strong className="font-extrabold text-gray-950">{text.slice(start, end)}</strong>
      {text.slice(end)}
    </>
  );
};

const getVenueBadge = (venue: string) => {
  if (venue === 'Starbucks') {
    return (
      <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-[#00754A]/20">
        <img src={starbucksLogo} alt="Starbucks" className="h-full w-full object-cover" />
      </span>
    );
  }

  if (venue === 'La Cantina') {
    return (
      <span className="flex h-7 w-[3.5rem] items-center justify-center overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-amber-200">
        <img src={laCantinaLogo} alt="La Cantina" className="h-full w-full object-contain" />
      </span>
    );
  }

  if (venue === 'Rústica') {
    return (
      <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-[0.9rem] bg-transparent shadow-sm">
        <img src={rusticaLogo} alt="Rústica" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-700 text-white shadow-sm">
      <Croissant className="h-3.5 w-3.5" />
    </span>
  );
};

export function Home({ userName, onAddToCart, searchQuery, onSearchChange, onLogout }: HomeProps) {
  const venues = ['La Cantina', 'Starbucks', 'Rústica'];
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [isVenueMenuOpen, setIsVenueMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBackToTopButton, setShowBackToTopButton] = useState(false);
  const [visibleProductsCount, setVisibleProductsCount] = useState(10);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedVenueLocations, setSelectedVenueLocations] = useState<string | null>(null);
  const [featuredShuffleTick, setFeaturedShuffleTick] = useState(0);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);

  const venueProducts = PRODUCTS.filter((product) => product.venue === selectedVenue);
  const featuredProductsByVenue = venues.map((venue) => {
    const venueItems = PRODUCTS.filter(
      (product) =>
        product.venue === venue &&
        !product.isOutOfStock &&
        normalizeSearchText(product.name).includes(normalizeSearchText(searchQuery)),
    );

    return {
      venue,
      products: getSeededFeaturedProducts(venueItems, venue, featuredShuffleTick),
    };
  });
  const categories = [
    'Todos',
    ...Array.from(new Set(venueProducts.map((product) => product.category))),
  ];

  useEffect(() => {
    const updateBackToTopButton = () => {
      setShowBackToTopButton(window.scrollY > 900);
    };

    updateBackToTopButton();
    window.addEventListener('scroll', updateBackToTopButton, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateBackToTopButton);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    setSelectedCategory('Todos');
    setIsCategoryMenuOpen(false);
  }, [selectedVenue]);

  useEffect(() => {
    if (!selectedVenueLocations) {
      return;
    }

    if (!selectedVenue) {
      setSelectedVenueLocations(null);
      return;
    }

    if (selectedVenueLocations !== selectedVenue) {
      setSelectedVenueLocations(selectedVenue);
    }
  }, [selectedVenue, selectedVenueLocations]);

  const filteredProducts = venueProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = normalizeSearchText(product.name).includes(normalizeSearchText(searchQuery));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setVisibleProductsCount(10);
  }, [selectedVenue, selectedCategory, searchQuery]);

  useEffect(() => {
    if (selectedVenue || selectedVenueLocations) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFeaturedShuffleTick((currentTick) => currentTick + 1);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [selectedVenue, selectedVenueLocations]);

  const availableProducts = filteredProducts.filter((product) => !product.isOutOfStock);
  const outOfStockProducts = filteredProducts.filter((product) => product.isOutOfStock);
  const visibleAvailableProducts = availableProducts.slice(0, visibleProductsCount);
  const hasMoreProducts = availableProducts.length > visibleAvailableProducts.length;

  useEffect(() => {
    setSelectedFlavor(null);
  }, [selectedProduct]);

  const buildProductSelection = (product: Product) => {
    if (!product.flavorOptions?.length) {
      return product;
    }

    if (!selectedFlavor) {
      return null;
    }

    return {
      ...product,
      selectedFlavor,
      cartKey: `${product.id}:${selectedFlavor}`,
    };
  };

  const renderProductCard = (product: Product) => (
    <div
      key={product.id}
      onClick={() => setSelectedProduct(product)}
      className={`relative flex items-center gap-3 rounded-xl border-2 p-3 shadow-md transition-colors cursor-pointer ${
        product.isOutOfStock
          ? 'bg-gray-100 border-gray-200 opacity-80'
          : 'bg-white border-amber-100 hover:border-yellow-700'
      }`}
    >
      {product.category === 'Combos' && !product.isOutOfStock && (
        <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-white">
          ¡COMBO!
        </div>
      )}
      {product.isOutOfStock && (
        <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-white">
          Sin stock
        </div>
      )}
      <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border-2 border-amber-100 bg-amber-100 shadow-sm">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover ${product.isOutOfStock ? 'grayscale' : ''}`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="hidden w-full h-full items-center justify-center px-2 text-center text-xs font-bold text-yellow-900">
          Sin foto
        </div>
      </div>
      <div className="flex-1">
        <h3 className={`text-[15px] font-semibold leading-tight ${product.isOutOfStock ? 'text-gray-500' : 'text-gray-900'}`}>
          {getHighlightedText(product.name, searchQuery)}
        </h3>
        <p className={`mt-1 text-[17px] font-bold ${product.isOutOfStock ? 'text-gray-500' : 'text-yellow-900'}`}>{formatPrice(product.price)}</p>
        {!product.isOutOfStock && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-600">
              <span>Tiempo estimado</span>
              <span>{product.waitTimeMinutes} min</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
              <div
                className={`h-full rounded-full ${getWaitTimeBarColor(product.waitTimeMinutes)}`}
                style={{ width: `${(product.waitTimeMinutes / MAX_WAIT_TIME_MINUTES) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-gray-400">
              <span>0'</span>
              <span>30'</span>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={(event) => {
          event.stopPropagation();
          if (!product.isOutOfStock) {
            if (product.flavorOptions?.length) {
              setSelectedProduct(product);
              return;
            }

            onAddToCart(product);
          }
        }}
        disabled={product.isOutOfStock}
        className={`rounded-full p-2.5 transition-all shadow-md ${
          product.isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-yellow-800 text-white hover:bg-yellow-900 hover:scale-110 active:scale-95'
        }`}
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );

  if (selectedProduct) {
    const requiresFlavorSelection = Boolean(selectedProduct.flavorOptions?.length);
    const selectedProductForCart = buildProductSelection(selectedProduct);

    return (
      <div className="min-h-screen bg-amber-50 flex flex-col">
        <div className="relative h-80 bg-amber-100">
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            className={`h-full w-full object-cover ${selectedProduct.isOutOfStock ? 'grayscale' : ''}`}
          />
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow-md"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-extrabold text-gray-900">{selectedProduct.name}</h2>
              <span className={`shrink-0 text-xl font-extrabold ${selectedProduct.isOutOfStock ? 'text-gray-500' : 'text-yellow-900'}`}>
                {formatPrice(selectedProduct.price)}
              </span>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-gray-400">{selectedProduct.category}</p>
          </div>

          <p className="text-base font-medium leading-relaxed text-gray-700">{selectedProduct.description}</p>

          {requiresFlavorSelection && (
            <div className="rounded-2xl border-2 border-amber-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">Gusto</p>
                  <p className="mt-1 text-sm font-medium text-gray-600">Elegí una opción para continuar.</p>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-red-700">
                  Obligatorio
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {selectedProduct.flavorOptions?.map((flavor) => (
                  <button
                    key={flavor}
                    type="button"
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition-colors ${
                      selectedFlavor === flavor
                        ? 'border-yellow-800 bg-amber-100 text-yellow-950'
                        : 'border-amber-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border-2 border-amber-100 bg-white p-4 space-y-2 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.14em]">Retiro</p>
            <p className="text-lg font-bold text-gray-900">Se puede retirar en: {selectedProduct.venue}</p>
            {!selectedProduct.isOutOfStock && (
              <>
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>Tiempo estimado</span>
                  <span>{selectedProduct.waitTimeMinutes} min</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-amber-100">
                  <div
                    className={`h-full rounded-full ${getWaitTimeBarColor(selectedProduct.waitTimeMinutes)}`}
                    style={{ width: `${(selectedProduct.waitTimeMinutes / MAX_WAIT_TIME_MINUTES) * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t-2 border-amber-100 p-6 shadow-lg">
          <button
            type="button"
            onClick={() => {
              if (!selectedProduct.isOutOfStock && selectedProductForCart) {
                onAddToCart(selectedProductForCart);
              }
            }}
            disabled={selectedProduct.isOutOfStock || !selectedProductForCart}
            className={`w-full py-4 rounded-2xl font-bold shadow-md transition-colors ${
              selectedProduct.isOutOfStock || !selectedProductForCart
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-800 text-white hover:bg-yellow-900'
            }`}
          >
            {selectedProduct.isOutOfStock
              ? 'Sin stock'
              : requiresFlavorSelection && !selectedProductForCart
                ? 'Elegí un gusto'
                : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-28">
      <div className="bg-yellow-800 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Hola,</p>
            <h1 className="text-2xl font-bold">{formatUserName(userName)}</h1>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 hover:bg-white/22 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="sticky top-0 z-40 -mt-px">
        <div className="bg-amber-50 px-6 pt-4 pb-3">
          <div className="flex w-full items-end gap-4">
            <div className={`${selectedVenue ? 'min-w-0 basis-0 flex-1' : 'w-full'} relative`}>
              <button
                type="button"
                onClick={() => setIsVenueMenuOpen((currentValue) => !currentValue)}
                className="flex w-full items-center justify-between gap-2.5 border-b border-amber-300 bg-transparent px-0 py-1.5 transition-colors hover:border-amber-400"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center text-yellow-900">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">Punto de compra</p>
                    <p className={`truncate text-[13px] font-bold ${selectedVenue ? 'text-gray-900' : 'text-gray-500'}`}>
                      {selectedVenue ?? 'Elegir lugar'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform ${isVenueMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isVenueMenuOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto overscroll-contain rounded-xl border-2 border-amber-200 bg-white p-1.5 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVenue(null);
                      setIsVenueMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors ${
                      selectedVenue === null ? 'bg-amber-100 text-yellow-950' : 'hover:bg-amber-50 text-gray-800'
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-yellow-900">
                      <MapPin className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-bold">Elegir un lugar</span>
                  </button>
                  {venues.map((venue) => (
                    <button
                      key={venue}
                      type="button"
                      onClick={() => {
                        setSelectedVenue(venue);
                        setIsVenueMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors ${
                        selectedVenue === venue ? 'bg-amber-100 text-yellow-950' : 'hover:bg-amber-50 text-gray-800'
                      }`}
                    >
                      <span className="flex w-12 shrink-0 justify-center">
                        {getVenueBadge(venue)}
                      </span>
                      <span className="text-sm font-bold">{venue}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedVenue && (
              <div className="relative min-w-0 basis-0 flex-1">
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen((currentValue) => !currentValue)}
                  className="flex w-full items-center justify-between gap-2 border-b border-amber-300 bg-transparent px-0 py-1.5 transition-colors hover:border-amber-400"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-yellow-900">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">Filtrar</p>
                      <p className="truncate text-[13px] font-bold text-gray-900">{selectedCategory}</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryMenuOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto overscroll-contain rounded-xl border-2 border-amber-200 bg-white p-1.5 shadow-xl">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-2.5 py-2 text-left text-sm font-bold transition-colors ${
                          selectedCategory === category
                            ? 'bg-amber-100 text-yellow-950'
                            : 'text-gray-800 hover:bg-amber-50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {searchQuery && (
          <div className="bg-amber-50 px-6 pb-4 pt-5">
            <div className="bg-white border-2 border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between gap-4 shadow-sm">
              <span className="text-base font-bold text-yellow-900 truncate">
                Buscando: {searchQuery}
              </span>
              <button
                onClick={() => onSearchChange('')}
                className="shrink-0 text-base font-bold text-yellow-800 hover:text-yellow-900"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pt-3 space-y-3">
        {selectedVenue && !selectedVenueLocations && (
          <div className="flex items-center gap-2 px-1 pb-1">
            <span className="flex h-9 w-11 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-amber-100">
              {getVenueBadge(selectedVenue)}
            </span>
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="truncate text-base font-extrabold text-gray-900">{selectedVenue}</h2>
              <button
                type="button"
                onClick={() => setSelectedVenueLocations(selectedVenue)}
                className="shrink-0 text-xs font-bold text-gray-400 transition-colors hover:text-gray-500"
              >
                Ver ubicaciones
              </button>
            </div>
          </div>
        )}

        {selectedVenueLocations && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-[1.75rem] border-2 border-amber-100 bg-white shadow-sm">
              <div className="bg-[linear-gradient(135deg,#fff8dc_0%,#fffdf4_55%,#ffffff_100%)] px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-amber-100">
                      {getVenueBadge(selectedVenueLocations)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                        Ubicaciones de {selectedVenueLocations}
                      </p>
                      <p className="mt-1 max-w-[14rem] text-sm font-medium leading-relaxed text-gray-500">
                        {getVenueLocationNote(selectedVenueLocations)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedVenueLocations(null)}
                    className="shrink-0 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-gray-400 shadow-sm ring-1 ring-amber-100 transition-colors hover:text-gray-600"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>

            {getGroupedVenueLocations(selectedVenueLocations).map(({ building, details }) => (
              <div
                key={building}
                className="rounded-[1.65rem] border-2 border-amber-100 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100/70 text-yellow-900">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Edificio</p>
                    <p className="mt-1 text-base font-extrabold leading-snug text-gray-900">{building}</p>
                    <div className="mt-3 space-y-2">
                      {details.map((detail) => (
                        <div key={`${building}-${detail}`} className="rounded-2xl bg-amber-50/70 px-3 py-2">
                          <p className="text-sm font-semibold leading-snug text-gray-700">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!selectedVenueLocations && !selectedVenue && featuredProductsByVenue.map(({ venue, products }) => (
          <div key={venue} className="space-y-3">
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2 min-w-0">
                {getVenueBadge(venue)}
                <h2 className="text-lg font-extrabold text-gray-900">{venue}</h2>
              </div>
              <div className="h-px flex-1 bg-amber-200" />
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-amber-100 shadow-md p-5 text-center">
                <p className="font-medium text-gray-600">No hay destacados para mostrar en este momento.</p>
              </div>
            ) : (
              products.map((product) => renderProductCard(product))
            )}
          </div>
        ))}

        {!selectedVenueLocations && !selectedVenue && featuredProductsByVenue.every(({ products }) => products.length === 0) && (
          <div className="bg-white rounded-2xl border-2 border-amber-100 shadow-md p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-yellow-900">
              <MapPin className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Elegí un lugar</h2>
            <p className="mt-2 font-medium text-gray-600">
              Seleccioná un local para ver su menú y los productos disponibles.
            </p>
          </div>
        )}

        {!selectedVenueLocations && selectedVenue && visibleAvailableProducts.map((product) => renderProductCard(product))}

        {!selectedVenueLocations && selectedVenue && hasMoreProducts && (
          <button
            type="button"
            onClick={() => setVisibleProductsCount((currentCount) => currentCount + 10)}
            className="w-full rounded-xl border-2 border-amber-200 bg-white py-4 font-bold text-yellow-900 shadow-sm hover:border-yellow-700 hover:bg-amber-50 transition-colors"
          >
            Ver más
          </button>
        )}

        {!selectedVenueLocations && selectedVenue && outOfStockProducts.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">Sin stock</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
          </div>
        )}

        {!selectedVenueLocations && selectedVenue && outOfStockProducts.map((product) => renderProductCard(product))}
      </div>

      {showBackToTopButton && (
        <button
          type="button"
          onClick={handleBackToTop}
          className="back-to-top-bounce fixed right-5 bottom-21 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black text-white shadow-[0_12px_28px_rgba(0,0,0,0.32)] ring-4 ring-amber-50/90 hover:bg-neutral-900 active:scale-95 transition-all"
          aria-label="Volver al inicio"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

    </div>
  );
}
