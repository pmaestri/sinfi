import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
  Home as HomeIcon,
  MessageSquare,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderTracking } from './components/OrderTracking';
import { Feedback } from './components/Feedback';
import { Account } from './components/Account';

type Screen = 'onboarding' | 'login' | 'home' | 'cart' | 'checkout' | 'tracking' | 'feedback' | 'account';

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

interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [userName, setUserName] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const itemKey = product.cartKey ?? String(product.id);
      const existingItem = prevCart.find(
        (item) => (item.cartKey ?? String(item.id)) === itemKey,
      );
      const productLabel = product.selectedFlavor
        ? `${product.name} · ${product.selectedFlavor}`
        : product.name;

      if (existingItem) {
        toast.success(`${productLabel} agregado al carrito`, {
          description: `Cantidad: ${existingItem.quantity + 1}`,
          duration: 2000,
          action: {
            label: 'Ver carrito',
            onClick: () => setCurrentScreen('cart'),
          },
        });
        return prevCart.map((item) =>
          (item.cartKey ?? String(item.id)) === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      toast.success(`${productLabel} agregado al carrito`, {
        description: 'Cantidad: 1',
        duration: 2000,
        action: {
          label: 'Ver carrito',
          onClick: () => setCurrentScreen('cart'),
        },
      });
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (cartKey: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          (item.cartKey ?? String(item.id)) === cartKey
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    const item = cart.find((i) => (i.cartKey ?? String(i.id)) === cartKey);
    if (item) {
      const itemLabel = item.selectedFlavor
        ? `${item.name} · ${item.selectedFlavor}`
        : item.name;
      toast.error(`${itemLabel} eliminado del carrito`, {
        duration: 2000,
      });
    }
    setCart((prevCart) =>
      prevCart.filter((item) => (item.cartKey ?? String(item.id)) !== cartKey),
    );
  };

  const handleCheckout = () => {
    const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(randomOrderNumber);
    setOrderTotal(cartTotal);
    setOrderItems(cart);
    setCurrentScreen('tracking');
    setCart([]);
  };

  const handleNewOrder = () => {
    setOrderItems([]);
    setCurrentScreen('home');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const showBottomNav =
    Boolean(userName) &&
    !['onboarding', 'login'].includes(currentScreen) &&
    !(currentScreen === 'cart' && cartItemCount > 0);
  const goHome = () => setCurrentScreen(userName ? 'home' : 'login');
  const goAccount = () => {
    if (!userName) {
      setCurrentScreen('login');
      return;
    }
    setCurrentScreen('account');
  };
  const handleLogout = () => {
    setUserName('');
    setCart([]);
    setSearchQuery('');
    setIsSearchOpen(false);
    setCurrentScreen('login');
  };
  const navItemClass = (isActive: boolean) =>
    `relative z-10 flex h-12 w-12 items-center justify-center justify-self-center rounded-full transition-colors ${
      isActive
        ? 'text-white'
        : 'text-[#7c4a00] hover:bg-amber-100/90 hover:text-[#5c3500]'
    }`;
  const activeNavIndex = isSearchOpen
    ? 1
    : ['cart', 'checkout'].includes(currentScreen)
      ? 2
      : currentScreen === 'feedback'
        ? 3
        : currentScreen === 'account'
          ? 4
          : currentScreen === 'home'
            ? 0
            : -1;

  useEffect(() => {
    if (!isSearchOpen) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isSearchOpen]);

  return (
    <div className="size-full">
      <Toaster position="top-center" richColors />
      {currentScreen === 'onboarding' && (
        <Onboarding onComplete={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'login' && (
        <Login onLogin={(name) => {
          setUserName(name);
          setCurrentScreen('home');
        }} onFeedback={() => setCurrentScreen('feedback')} />
      )}

      {currentScreen === 'home' && (
        <Home
          userName={userName}
          onAddToCart={handleAddToCart}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'cart' && (
        <Cart
          items={cart}
          onBack={() => setCurrentScreen('home')}
          onCheckout={() => setCurrentScreen('checkout')}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {currentScreen === 'checkout' && (
        <Checkout
          total={cartTotal}
          onBack={() => setCurrentScreen('cart')}
          onConfirm={handleCheckout}
        />
      )}

      {currentScreen === 'tracking' && (
        <OrderTracking
          orderNumber={orderNumber}
          total={orderTotal}
          items={orderItems}
          onNewOrder={handleNewOrder}
        />
      )}

      {currentScreen === 'feedback' && (
        <Feedback onBack={() => setCurrentScreen(userName ? 'home' : 'login')} />
      )}

      {currentScreen === 'account' && (
        <Account
          userName={userName}
          onBack={() => setCurrentScreen('home')}
          onLogout={handleLogout}
          onUpdateName={setUserName}
        />
      )}

      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-0 pb-0 pointer-events-none">
          <nav className="relative grid w-full grid-cols-5 items-center rounded-none border-t-2 border-amber-200 bg-white/96 px-5 py-2 shadow-[0_-10px_30px_rgba(92,53,0,0.16)] backdrop-blur-xl pointer-events-auto">
            <div className="pointer-events-none absolute inset-x-6 top-1 h-px rounded-full bg-amber-100/80" />
            <div
              className={`pointer-events-none absolute inset-x-5 top-2 h-12 transition-opacity duration-200 ${
                activeNavIndex === -1 ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div
                className="flex h-12 w-1/5 justify-center transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${activeNavIndex * 100}%)` }}
              >
                <div className="h-12 w-12 rounded-full bg-yellow-800 shadow-[0_10px_24px_rgba(137,82,0,0.34)] ring-4 ring-amber-50" />
              </div>
            </div>
            <button
              onClick={goHome}
              className={navItemClass(currentScreen === 'home')}
              aria-label="Home"
              type="button"
            >
              <HomeIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setCurrentScreen('home');
                setIsSearchOpen(true);
              }}
              className={navItemClass(isSearchOpen)}
              aria-label="Buscar"
              type="button"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentScreen('cart')}
              className={`${navItemClass(['cart', 'checkout'].includes(currentScreen))} relative`}
              aria-label="Carrito"
              type="button"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentScreen('feedback')}
              className={navItemClass(currentScreen === 'feedback')}
              aria-label="Opinión"
              type="button"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
            <button
              onClick={goAccount}
              className={navItemClass(currentScreen === 'account')}
              aria-label="Mi cuenta"
              type="button"
            >
              <User className="w-6 h-6" />
            </button>
          </nav>
        </div>
      )}

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5 backdrop-blur-[2px]"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-5 w-full max-w-md shadow-2xl border-2 border-amber-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Buscar productos</h2>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Encontrá comidas, bebidas o combos.
                </p>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-800" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentScreen('home');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsSearchOpen(false);
                  }
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-yellow-700 font-semibold"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="w-full mt-4 bg-yellow-800 text-white py-3 rounded-xl font-bold hover:bg-yellow-900 transition-colors shadow-md"
              type="button"
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
